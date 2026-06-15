import { supabase } from './supabase';

export interface ProgressData {
  completed_quizzes: string[];
  completed_exercises: string[];
  quiz_retakes: number;
  mastery_score: number;
}

const DEFAULT_PROGRESS: ProgressData = { 
  completed_quizzes: [], 
  completed_exercises: [],
  quiz_retakes: 0,
  mastery_score: 0
};

// --- READ PROGRESS ---
export async function getProgress(subjectSlug: string): Promise<ProgressData> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    const local = localStorage.getItem(`progress_${subjectSlug}`);
    return local ? JSON.parse(local) : DEFAULT_PROGRESS;
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('completed_quizzes, completed_exercises, quiz_retakes, mastery_score')
    .eq('subject_slug', subjectSlug)
    .single();

  if (error && error.code !== 'PGRST116') console.error('Error fetching progress:', error.message);

  return data ? {
    completed_quizzes: data.completed_quizzes || [],
    completed_exercises: data.completed_exercises || [],
    quiz_retakes: data.quiz_retakes || 0,
    mastery_score: data.mastery_score || 0
  } : DEFAULT_PROGRESS;
}

// --- WRITE PROGRESS ---
export async function markCompleted(
  subjectSlug: string, 
  type: 'quiz' | 'exercise', 
  itemId: string
): Promise<ProgressData> {
  const current = await getProgress(subjectSlug);
  const listToUpdate = type === 'quiz' ? current.completed_quizzes : current.completed_exercises;
  
  if (listToUpdate.includes(itemId)) return current;

  const newProgress = {
    ...current,
    [type === 'quiz' ? 'completed_quizzes' : 'completed_exercises']: [...listToUpdate, itemId]
  };

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (typeof window !== 'undefined') localStorage.setItem(`progress_${subjectSlug}`, JSON.stringify(newProgress));
    return newProgress;
  }

  await supabase.from('user_progress').upsert({
    user_id: session.user.id,
    subject_slug: subjectSlug,
    completed_quizzes: newProgress.completed_quizzes,
    completed_exercises: newProgress.completed_exercises,
    quiz_retakes: newProgress.quiz_retakes,
    mastery_score: newProgress.mastery_score,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id, subject_slug' });

  return newProgress;
}

// --- UPDATE MASTERY SCORE ---
export async function updateMastery(subjectSlug: string, pointsDelta: number): Promise<void> {
  const current = await getProgress(subjectSlug);
  const newScore = Math.max(0, current.mastery_score + pointsDelta); // Prevent negative scores
  const newProgress = { ...current, mastery_score: newScore };

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    if (typeof window !== 'undefined') localStorage.setItem(`progress_${subjectSlug}`, JSON.stringify(newProgress));
    return;
  }

  await supabase.from('user_progress').update({ mastery_score: newScore })
    .eq('user_id', session.user.id)
    .eq('subject_slug', subjectSlug);
}

// --- RESET QUIZ PROGRESS ---
export async function resetSubjectQuiz(subjectSlug: string): Promise<ProgressData> {
  const current = await getProgress(subjectSlug);
  const newProgress = { 
    ...current, 
    completed_quizzes: [],
    quiz_retakes: current.quiz_retakes + 1 
  };

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (typeof window !== 'undefined') localStorage.setItem(`progress_${subjectSlug}`, JSON.stringify(newProgress));
    return newProgress;
  }

  await supabase.from('user_progress').upsert({
    user_id: session.user.id,
    subject_slug: subjectSlug,
    completed_quizzes: [],
    completed_exercises: newProgress.completed_exercises,
    quiz_retakes: newProgress.quiz_retakes,
    mastery_score: newProgress.mastery_score,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id, subject_slug' });

  return newProgress;
}

// --- READ ALL PROGRESS ---
export async function getAllProgress(): Promise<Record<string, ProgressData>> {
  const { data: { session } } = await supabase.auth.getSession();
  const allProgress: Record<string, ProgressData> = {};

  if (!session) {
    if (typeof window === 'undefined') return allProgress;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('progress_')) {
        const slug = key.replace('progress_', '');
        allProgress[slug] = JSON.parse(localStorage.getItem(key) || '{"completed_quizzes":[],"completed_exercises":[],"quiz_retakes":0,"mastery_score":0}');
      }
    }
    return allProgress;
  }

  const { data } = await supabase
    .from('user_progress')
    .select('subject_slug, completed_quizzes, completed_exercises, quiz_retakes, mastery_score')
    .eq('user_id', session.user.id);

  data?.forEach(row => {
    allProgress[row.subject_slug] = {
      completed_quizzes: row.completed_quizzes || [],
      completed_exercises: row.completed_exercises || [],
      quiz_retakes: row.quiz_retakes || 0,
      mastery_score: row.mastery_score || 0
    };
  });

  return allProgress;
}

// Module-level userId cache so we don't hit getSession() on every read.
// Set by AuthProvider on sign-in/sign-out.
let _userId: string | null = null;
export function setProgressUser(userId: string | null) {
  _userId = userId;
}

/** Pull all rows for the current user from DB into localStorage. */
export async function pullProgressFromDB(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || typeof window === 'undefined') return;

  const { data, error } = await supabase
    .from('user_progress')
    .select('subject_slug, completed_quizzes, completed_exercises, quiz_retakes, mastery_score')
    .eq('user_id', session.user.id);

  if (error) { console.error('pullProgressFromDB error:', error.message); return; }

  data?.forEach(row => {
    const key = `progress_${row.subject_slug}`;
    const existing = JSON.parse(localStorage.getItem(key) || '{"completed_quizzes":[],"completed_exercises":[],"quiz_retakes":0,"mastery_score":0}');
    // Merge: union of completed sets, take max of mastery_score
    const merged = {
      completed_quizzes: Array.from(new Set([...existing.completed_quizzes, ...(row.completed_quizzes || [])])),
      completed_exercises: Array.from(new Set([...existing.completed_exercises, ...(row.completed_exercises || [])])),
      quiz_retakes: Math.max(existing.quiz_retakes || 0, row.quiz_retakes || 0),
      mastery_score: Math.max(existing.mastery_score || 0, row.mastery_score || 0),
    };
    localStorage.setItem(key, JSON.stringify(merged));
  });
}

export async function pushAllLocalToDB() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || typeof window === 'undefined') return;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('progress_')) {
      const subjectSlug = key.replace('progress_', '');
      try {
        const localData = JSON.parse(localStorage.getItem(key) || '{}');
        const quizzes = localData.completed_quizzes || localData.quizDone || [];
        const exercises = localData.completed_exercises || localData.exercisesDone || [];
        const score = localData.mastery_score || 0;
        const retakes = localData.quiz_retakes || 0;

        if (quizzes.length > 0 || exercises.length > 0 || score > 0) {
          await supabase.from('user_progress').upsert({
            user_id: session.user.id,
            subject_slug: subjectSlug,
            completed_quizzes: quizzes,
            completed_exercises: exercises,
            quiz_retakes: retakes,
            mastery_score: score,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id, subject_slug' });
        }
      } catch (e) {}
    }
  }
}