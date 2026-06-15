"use client";

import { useState } from "react";
import { saveProfile, Experience, Goal } from "@/lib/profile";

interface Props {
  onComplete: () => void;
}

type Step = 0 | 1 | 2;

const EXPERIENCES: { value: Experience; label: string; hint: string }[] = [
  { value: "beginner", label: "Beginner", hint: "New to ML — I know some Python or stats." },
  { value: "intermediate", label: "Intermediate", hint: "I've trained models and read the theory." },
  { value: "advanced", label: "Advanced", hint: "I work in ML/DS professionally." },
];

const GOALS: { value: Goal; label: string; emoji: string }[] = [
  { value: "career", label: "Career change", emoji: "🚀" },
  { value: "academic", label: "Academic / research", emoji: "🎓" },
  { value: "upskill", label: "Professional upskilling", emoji: "📈" },
  { value: "curiosity", label: "Personal curiosity", emoji: "🔍" },
];

export default function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState<Experience | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    await saveProfile({
      display_name: name.trim() || "Learner",
      experience,
      goal,
    });
    setSaving(false);
    onComplete();
  }

  return (
    <div className="onboard-overlay">
      <div className="onboard-modal">
        {/* Progress dots */}
        <div className="onboard-dots">
          {([0, 1, 2] as Step[]).map((s) => (
            <span key={s} className={`onboard-dot ${step === s ? "is-active" : step > s ? "is-done" : ""}`} />
          ))}
        </div>

        {/* Step 0: Name */}
        {step === 0 && (
          <div className="onboard-step">
            <div className="onboard-emoji">👋</div>
            <h2 className="onboard-title">What should we call you?</h2>
            <p className="onboard-sub">Your name is only stored to personalise your experience.</p>
            <input
              className="onboard-input"
              type="text"
              placeholder="Your name or nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(1)}
            />
            <button
              className="onboard-next"
              onClick={() => setStep(1)}
              disabled={!name.trim()}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="onboard-step">
            <div className="onboard-emoji">📊</div>
            <h2 className="onboard-title">What&apos;s your experience level?</h2>
            <p className="onboard-sub">We&apos;ll suggest a recommended starting phase.</p>
            <div className="onboard-options">
              {EXPERIENCES.map((opt) => (
                <button
                  key={opt.value}
                  className={`onboard-option ${experience === opt.value ? "is-selected" : ""}`}
                  onClick={() => setExperience(opt.value)}
                >
                  <span className="onboard-option-label">{opt.label}</span>
                  <span className="onboard-option-hint">{opt.hint}</span>
                </button>
              ))}
            </div>
            <div className="onboard-row">
              <button className="onboard-back" onClick={() => setStep(0)}>← Back</button>
              <button
                className="onboard-next"
                onClick={() => setStep(2)}
                disabled={!experience}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="onboard-step">
            <div className="onboard-emoji">🎯</div>
            <h2 className="onboard-title">What&apos;s your main goal?</h2>
            <p className="onboard-sub">Helps us tailor the learning experience for you.</p>
            <div className="onboard-options onboard-options-2col">
              {GOALS.map((opt) => (
                <button
                  key={opt.value}
                  className={`onboard-option ${goal === opt.value ? "is-selected" : ""}`}
                  onClick={() => setGoal(opt.value)}
                >
                  <span className="onboard-option-emoji">{opt.emoji}</span>
                  <span className="onboard-option-label">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="onboard-row">
              <button className="onboard-back" onClick={() => setStep(1)}>← Back</button>
              <button
                className="onboard-next"
                onClick={finish}
                disabled={!goal || saving}
              >
                {saving ? "Saving…" : "Get started →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
