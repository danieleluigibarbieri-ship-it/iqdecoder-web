"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const QUESTIONS = [
  {
    id: 1,
    question: "Qual è il prossimo numero nella sequenza: 2, 4, 8, 16, ...?",
    options: ["24", "32", "64", "128"],
    correct: 1, // 32
  },
  {
    id: 2,
    question: "Se tutte le rose sono fiori e alcuni fiori appassiscono, allora:",
    options: [
      "Tutte le rose appassiscono",
      "Alcune rose appassiscono", 
      "Nessuna rosa appassisce",
      "Non si può determinare"
    ],
    correct: 1, // Alcune rose appassiscono
  },
  {
    id: 3,
    question: "Quale parola è diversa dalle altre?",
    options: ["Cane", "Gatto", "Pesce", "Albero"],
    correct: 3, // Albero
  },
  {
    id: 4,
    question: "Se A = 1, B = 2, C = 3, allora D + E = ?",
    options: ["7", "8", "9", "10"],
    correct: 2, // 9 (4 + 5)
  },
  {
    id: 5,
    question: "Completa l'analogia: Libro è a leggere come film è a...",
    options: ["Vedere", "Ascoltare", "Produrre", "Scrivere"],
    correct: 0, // Vedere
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('iq_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('iq_session_id', sessionId);
    }
    return sessionId;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sessionId = getSessionId();
      
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit test');
      }

      // Store attempt ID for result page
      localStorage.setItem('current_attempt_id', data.attemptId);
      localStorage.setItem('iq_session_id', data.sessionId);
      
      // Redirect to result page with attempt ID
      router.push(`/result?attemptId=${data.attemptId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">IQ Test</h1>
          <p className="text-gray-600 mt-2">Rispondi a 5 domande per valutare il tuo quoziente intellettivo</p>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="font-medium">Errore</p>
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Chiudi
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Domanda {currentQuestion + 1} di {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% completato</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Domanda {currentQuestion + 1}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 ${
                    answers[currentQuestion] === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Indietro
          </button>

          {currentQuestion < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Prossima domanda
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answers.some(a => a === -1) || isSubmitting}
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              {isSubmitting ? 'Invio in corso...' : 'Vedi risultato'}
            </button>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Il tuo progresso viene salvato automaticamente. Puoi tornare indietro in qualsiasi momento.</p>
        </div>
      </div>
    </div>
  );
}
