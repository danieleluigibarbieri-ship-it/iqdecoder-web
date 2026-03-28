"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CheckoutCard.module.css";

const PRICE_LABEL = "EUR 0.50";

type SurveyQuestion = {
  id: string;
  title: string;
  options: Array<{ label: string; value: string }>;
};

const INTRO_QUESTION: SurveyQuestion = {
  id: "intro",
  title: "Do you like quick surveys?",
  options: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};

const EXTRA_QUESTIONS: SurveyQuestion[] = [
  {
    id: "pref",
    title: "What is easier for you?",
    options: [
      { label: "Numbers", value: "numbers" },
      { label: "Words", value: "words" },
    ],
  },
  {
    id: "time",
    title: "When do you feel sharper?",
    options: [
      { label: "Morning", value: "morning" },
      { label: "Evening", value: "evening" },
    ],
  },
  {
    id: "style",
    title: "Which task do you enjoy more?",
    options: [
      { label: "Logic puzzles", value: "logic" },
      { label: "Creative tasks", value: "creative" },
    ],
  },
];

const BASE_CHECKPOINTS = [0];
const EXTENDED_CHECKPOINTS = [0, 34, 61, 84];
const LOADING_LIMIT = 100;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function CheckoutCard({ publicToken }: { publicToken: string }) {
  const searchParams = useSearchParams();
  const canceled = useMemo(() => searchParams.get("status") === "cancel", [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [surveyEnabled, setSurveyEnabled] = useState<boolean | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = useMemo(() => {
    if (surveyEnabled === true) return [INTRO_QUESTION, ...EXTRA_QUESTIONS];
    return [INTRO_QUESTION];
  }, [surveyEnabled]);

  const checkpoints = surveyEnabled === true ? EXTENDED_CHECKPOINTS : BASE_CHECKPOINTS;
  const currentThreshold = checkpoints[currentQuestionIndex];
  const showSurveyPopup = currentQuestionIndex < questions.length && typeof currentThreshold === "number" && progress >= currentThreshold;
  const canAdvanceProgress = !showSurveyPopup;

  useEffect(() => {
    if (!canAdvanceProgress || progress >= LOADING_LIMIT) return;

    const timer = window.setTimeout(() => {
      setProgress((value) => Math.min(value + 1, LOADING_LIMIT));
    }, 80);

    return () => window.clearTimeout(timer);
  }, [canAdvanceProgress, progress]);

  function answerSurvey(value: string) {
    const current = questions[currentQuestionIndex];
    if (!current) return;

    if (current.id === "intro") {
      setSurveyEnabled(value === "yes");
    }

    setCurrentQuestionIndex((valueIdx) => valueIdx + 1);
  }

  function confirmEmail() {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError(null);
    setEmailConfirmed(true);
  }

  async function onCheckout() {
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicToken,
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        alreadyPaid?: boolean;
        resultUrl?: string;
        url?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setError(data.error || "Checkout error");
        setLoading(false);
        return;
      }

      if (data.alreadyPaid && data.resultUrl) {
        window.location.href = data.resultUrl;
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Missing checkout URL");
      setLoading(false);
    } catch {
      setError("Connection error. Please retry.");
      setLoading(false);
    }
  }

  const loadingDone = progress >= LOADING_LIMIT;
  const activeQuestion = showSurveyPopup ? questions[currentQuestionIndex] : null;

  return (
    <section className={styles.card}>
      <p className={styles.badge}>FINAL STEP</p>
      <h1>Preparing your score...</h1>
      <p>We are analyzing your answers before unlocking the premium report.</p>

      <div className={styles.loadingWrap}>
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressLabel}>{progress}% completed</p>
      </div>

      {activeQuestion ? (
        <div className={styles.popup}>
          <p className={styles.popupTitle}>{activeQuestion.title}</p>
          <div className={styles.popupActions}>
            {activeQuestion.options.map((option) => (
              <button key={option.value} className={styles.popupBtn} onClick={() => answerSurvey(option.value)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {loadingDone ? (
        <div className={styles.flowBlock}>
          {!showEmailForm ? (
            <button className={styles.primary} onClick={() => setShowEmailForm(true)}>
              Continue
            </button>
          ) : null}

          {showEmailForm && !emailConfirmed ? (
            <div className={styles.fieldBlock}>
              <p className={styles.blockTitle}>Where should we send your results?</p>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
              <button className={styles.primary} onClick={confirmEmail}>
                Continue to payment
              </button>
            </div>
          ) : null}

          {emailConfirmed && !showPaymentForm ? (
            <button className={styles.primary} onClick={() => setShowPaymentForm(true)}>
              Open payment form
            </button>
          ) : null}

          {showPaymentForm ? (
            <div className={styles.fieldBlock}>
              <div className={styles.priceRow}>
                <span>Total</span>
                <strong>{PRICE_LABEL}</strong>
              </div>

              <div className={styles.field}>
                <label htmlFor="name">Name on certificate</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
              </div>

              <button className={styles.primary} onClick={() => void onCheckout()} disabled={loading}>
                {loading ? "Redirecting..." : "Unlock report"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {canceled ? <p className={styles.error}>Payment canceled. You can retry now.</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}
