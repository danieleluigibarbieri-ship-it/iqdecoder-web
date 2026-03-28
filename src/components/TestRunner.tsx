"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";
import { QUESTIONS, TEST_MINUTES, categoryLabel } from "@/lib/test";
import styles from "./TestRunner.module.css";

type SavedProgress = {
  index: number;
  answers: number[];
  timeLeft: number;
};

const STORAGE_KEY = "iqdecoder-test-progress-v1";

type SubmitResponse = {
  ok: boolean;
  publicToken?: string;
  error?: string;
};

const LABELS = {
  en: {
    title: "Session in progress",
    subtitle: "Stay focused and answer one question at a time.",
    completion: "Completion",
    unanswered: "Unanswered",
    timeLeft: "Time left",
    question: "Question",
    back: "Back",
    continue: "Continue",
    finish: "Finish test",
    autosave: "Autosave active",
    timeout: "Time is over. Submitting your test...",
    confirmUnanswered: (n: number) => `You still have ${n} unanswered questions. Submit anyway?`,
  },
  it: {
    title: "Sessione in corso",
    subtitle: "Rimani concentrato e rispondi una domanda alla volta.",
    completion: "Completamento",
    unanswered: "Mancanti",
    timeLeft: "Tempo residuo",
    question: "Domanda",
    back: "Indietro",
    continue: "Continua",
    finish: "Termina test",
    autosave: "Autosalvataggio attivo",
    timeout: "Tempo terminato. Invio del test in corso...",
    confirmUnanswered: (n: number) => `Hai ancora ${n} domande senza risposta. Vuoi inviare comunque?`,
  },
  fr: {
    title: "Session en cours",
    subtitle: "Restez concentre, une question a la fois.",
    completion: "Progression",
    unanswered: "Non repondues",
    timeLeft: "Temps restant",
    question: "Question",
    back: "Retour",
    continue: "Continuer",
    finish: "Terminer test",
    autosave: "Sauvegarde auto active",
    timeout: "Temps termine. Envoi du test...",
    confirmUnanswered: (n: number) => `Il reste ${n} questions sans reponse. Envoyer quand meme?`,
  },
  de: {
    title: "Sitzung lauft",
    subtitle: "Bleib fokussiert und beantworte eine Frage nach der anderen.",
    completion: "Fortschritt",
    unanswered: "Offen",
    timeLeft: "Verbleibende Zeit",
    question: "Frage",
    back: "Zuruck",
    continue: "Weiter",
    finish: "Test beenden",
    autosave: "Autospeichern aktiv",
    timeout: "Zeit abgelaufen. Test wird gesendet...",
    confirmUnanswered: (n: number) => `Es sind noch ${n} Fragen offen. Trotzdem senden?`,
  },
  es: {
    title: "Sesion en curso",
    subtitle: "Mantente enfocado y responde una pregunta a la vez.",
    completion: "Progreso",
    unanswered: "Sin responder",
    timeLeft: "Tiempo restante",
    question: "Pregunta",
    back: "Atras",
    continue: "Continuar",
    finish: "Finalizar test",
    autosave: "Autoguardado activo",
    timeout: "Tiempo terminado. Enviando test...",
    confirmUnanswered: (n: number) => `Aun tienes ${n} preguntas sin responder. Enviar de todos modos?`,
  },
};

function clock(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadProgress(): SavedProgress | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedProgress;
    if (!Array.isArray(parsed.answers) || parsed.answers.length !== QUESTIONS.length) return null;
    if (typeof parsed.index !== "number" || parsed.index < 0 || parsed.index >= QUESTIONS.length) return null;
    if (typeof parsed.timeLeft !== "number" || parsed.timeLeft < 0 || parsed.timeLeft > TEST_MINUTES * 60) return null;
    if (parsed.answers.some((value) => typeof value !== "number" || value < -1 || value > 3)) return null;
    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function TestRunner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = LABELS[language] ?? LABELS.en;
  const initial = useMemo(() => loadProgress(), []);

  const [index, setIndex] = useState(initial?.index ?? 0);
  const [answers, setAnswers] = useState<number[]>(initial?.answers ?? Array(QUESTIONS.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(initial?.timeLeft ?? TEST_MINUTES * 60);
  const [submitting, setSubmitting] = useState(false);
  const [timeoutNotice, setTimeoutNotice] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const gender = searchParams.get("gender");
  const current = QUESTIONS[index];
  const answered = useMemo(() => answers.filter((v) => v >= 0).length, [answers]);
  const unanswered = QUESTIONS.length - answered;
  const percent = Math.round((answered / QUESTIONS.length) * 100);

  const submit = useCallback(
    async (force: boolean) => {
      if (submitting) return;
      if (!force && unanswered > 0) {
        const ok = window.confirm(t.confirmUnanswered(unanswered));
        if (!ok) return;
      }

      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/test/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale: language,
            gender: gender === "male" || gender === "female" ? gender : null,
            durationSec: Math.max(1, TEST_MINUTES * 60 - timeLeft),
            answers,
          }),
        });

        const data = (await res.json()) as SubmitResponse;
        if (!res.ok || !data.ok || !data.publicToken) {
          throw new Error(data.error || "Submit failed");
        }

        window.localStorage.removeItem(STORAGE_KEY);
        router.push(`/checkout/${data.publicToken}`);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Submit failed");
        setSubmitting(false);
      }
    },
    [answers, gender, language, router, submitting, t, timeLeft, unanswered],
  );

  useEffect(() => {
    const payload: SavedProgress = { index, answers, timeLeft };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [index, answers, timeLeft]);

  useEffect(() => {
    if (submitting) return;
    const timer = window.setTimeout(() => {
      if (timeLeft <= 1 && !autoSubmitted) {
        setAutoSubmitted(true);
        setTimeoutNotice(true);
        void submit(true);
        setTimeLeft(0);
      } else if (timeLeft > 0) {
        setTimeLeft((v) => v - 1);
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [autoSubmitted, submitting, submit, timeLeft]);

  return (
    <section className={styles.shell}>
      <header className={styles.head}>
        <div>
          <p className={styles.badge}>IQ Decoder Test</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className={styles.right}>
          <LanguageSelector />
          <p>{t.autosave}</p>
          <strong>
            {t.timeLeft}: {clock(timeLeft)}
          </strong>
        </div>
      </header>

      {timeoutNotice ? <p className={styles.notice}>{t.timeout}</p> : null}
      {submitError ? <p className={styles.notice}>{submitError}</p> : null}

      <div className={styles.stats}>
        <p>
          {t.completion}: {answered}/{QUESTIONS.length} ({percent}%)
        </p>
        <p>
          {t.unanswered}: {unanswered}
        </p>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>

      <article className={styles.card}>
        <p className={styles.meta}>
          {t.question} {index + 1}/{QUESTIONS.length} - {categoryLabel(language, current.category)}
        </p>
        <h2>{current.prompt[language]}</h2>

        <div className={styles.answers}>
          {current.options[language].map((option, idx) => (
            <button
              key={option}
              onClick={() => {
                const next = [...answers];
                next[index] = idx;
                setAnswers(next);
              }}
              className={answers[index] === idx ? styles.answerActive : styles.answer}
              disabled={submitting}
            >
              <span className={styles.key}>{String.fromCharCode(65 + idx)}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>

        <div className={styles.nav}>
          <button onClick={() => setIndex((v) => Math.max(0, v - 1))} disabled={index === 0 || submitting}>
            {t.back}
          </button>
          {index === QUESTIONS.length - 1 ? (
            <button className={styles.primary} onClick={() => void submit(false)} disabled={submitting}>
              {t.finish}
            </button>
          ) : (
            <button
              className={styles.primary}
              onClick={() => setIndex((v) => Math.min(QUESTIONS.length - 1, v + 1))}
              disabled={answers[index] < 0 || submitting}
            >
              {t.continue}
            </button>
          )}
        </div>
      </article>
    </section>
  );
}
