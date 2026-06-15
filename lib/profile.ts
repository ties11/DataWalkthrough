import { supabase } from "./supabase";

export type Experience = "beginner" | "intermediate" | "advanced";
export type Goal =
  | "career"      // Career change into data science
  | "academic"    // Academic / research
  | "upskill"     // Professional upskilling
  | "curiosity";  // Personal curiosity

export interface Profile {
  display_name: string;
  experience: Experience | null;
  goal: Goal | null;
}

const DEFAULT_PROFILE: Profile = {
  display_name: "",
  experience: null,
  goal: null,
};

export async function getProfile(): Promise<Profile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, experience, goal")
    .eq("id", session.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("getProfile error:", error.message);
    return null;
  }

  return data
    ? { ...DEFAULT_PROFILE, ...data }
    : null; // null = no profile row yet → needs onboarding
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { error } = await supabase.from("profiles").upsert({
    id: session.user.id,
    ...profile,
  });

  if (error) console.error("saveProfile error:", error.message);

  // Also mirror display_name into auth user_metadata so the shell shows it
  if (profile.display_name) {
    await supabase.auth.updateUser({ data: { display_name: profile.display_name } });
  }
}

export function experienceLabel(e: Experience | null): string {
  if (e === "beginner") return "Beginner";
  if (e === "intermediate") return "Intermediate";
  if (e === "advanced") return "Advanced";
  return "";
}

export function goalLabel(g: Goal | null): string {
  if (g === "career") return "Career change";
  if (g === "academic") return "Academic / research";
  if (g === "upskill") return "Professional upskilling";
  if (g === "curiosity") return "Personal curiosity";
  return "";
}

/** Which phase to recommend as a starting point based on experience */
export function recommendedPhase(e: Experience | null): number {
  if (e === "advanced") return 3;
  if (e === "intermediate") return 1;
  return 0; // beginner or unknown → start at foundations
}
