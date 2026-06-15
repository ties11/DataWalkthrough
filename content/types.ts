// ─── The shape every subject follows ───────────────────────────
// A subject is theory pages + a quiz + coding exercises, as data.

export interface TheoryPage {
  badge: string;        // e.g. "Architecture · Page 2"
  title: string;
  // Blocks render in order. Each block is one of a few known kinds.
  blocks: Block[];
}

export type Block =
  | { kind: "para"; html: string }                        // a paragraph (HTML allowed for <em>, <code>)
  | { kind: "heading"; text: string }                     // a sub-heading
  | { kind: "callout"; tone: Tone; title?: string; html: string }
  | { kind: "equation"; label?: string; tex: string }     // a LaTeX equation
  | { kind: "image"; src: string; caption?: string; credit?: string }
  | { kind: "table"; headers: string[]; rows: string[][] };

export type Tone = "purple" | "teal" | "amber" | "red";

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;   // shown after answering, right or wrong
}

// One checkable step within an exercise. Parts run in sequence;
// each part's check executes the previous parts' solutions plus
// this part's code, so steps can build on one another.
export interface ExercisePart {
  id: string;
  label: string;             // "a", "b", "c", ...
  prompt: string;            // what this step asks for
  starterCode: string;       // pre-filled snippet for this step
  expectedStdout: string;    // the last line(s) this step should print
  hints: string[];
  solution: string;          // reference solution for this step
}

export interface CodeExercise {
  id: string;
  title: string;             // overall exercise title
  intro: string;             // one-line framing of the whole task
  parts: ExercisePart[];
}
export interface Subject {
  slug: string;              // url id, e.g. "random-forests"
  title: string;
  icon: string;              // an emoji
  phase: number;              // 0 = Foundations, 1 = Core Models, ...
  blurb: string;             // one-line description for the home page
  sources: string[];         // academic sources, cited on the page
  theory: TheoryPage[];
  quiz: MCQ[];
  exercises: CodeExercise[];
  cheatsheet: CheatSheetSection[];
}

export interface CheatSheetItem {
  term: string;
  note: string;       // one-line explanation
  formula?: string;   // optional LaTeX, rendered under the note
}

export interface CheatSheetSection {
  heading: string;
  items: CheatSheetItem[];
}