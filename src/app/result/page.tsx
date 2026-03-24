"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type AttemptData = {
  id: string;
  score: number;
  percentile: number;
  answers: number[];
  created_at: string;
};

type PaymentData = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  paid_at: string;
} | null;

type ReportData = {
  id: string;
  pdf_url: string | null;
  accessed_count: number;
  expires_at: string;
} | null;

export default function ResultPage() {
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [payment, setPayment] = useState<PaymentData>(null);
  const [report, setReport] = useState<ReportData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId') || localStorage.getItem('current_attempt_id');

  useEffect(() => {
    if (!attemptId) {
      router.push('/quiz');
      return;
    }
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('iq_session_id');
      
      const response = await fetch(`/api/result/${attemptId}`, {
        headers: {
          'x-session-id': sessionId || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load result');
      }

      setAttempt(data.attempt);
      setPayment(data.payment);
      setReport(data.report);

      // Handle Stripe redirect
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      
      if (success === 'true') {
        // Payment succeeded, refresh data
        setTimeout(fetchResult, 2000);
      } else if (canceled === 'true') {
        setError('Pagamento annullato. Puoi riprovare quando vuoi.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!attempt) return;
    
    setIsPurchasing(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attemptId: attempt.id,
          successUrl: `${window.location.origin}/result?success=true&attemptId=${attempt.id}`,
          cancelUrl: `${window.location.origin}/result?canceled=true&attemptId=${attempt.id}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      if (data.alreadyPaid) {
        // Already paid, refresh
        fetchResult();
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsPurchasing(false);
    }
  };

  const getIQCategory = (score: number) => {
    if (score >= 90) return { label: "Alto", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 70) return { label: "Medio-Alto", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 50) return { label: "Medio", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "In sviluppo", color: "text-red-600", bg: "bg-red-100" };
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento risultato...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700">Nessun risultato trovato.</p>
          <Link
            href="/quiz"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Fai il test
          </Link>
        </div>
      </div>
    );
  }

  const category = getIQCategory(attempt.score);
  const hasPaid = !!payment && payment.status === 'succeeded';
  const price = 990; // €9.90 in cents

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Il Tuo Risultato IQ</h1>
          <p className="text-gray-600 mt-2">Test completato il {new Date(attempt.created_at).toLocaleDateString('it-IT')}</p>
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

        {/* Success message */}
        {searchParams.get('success') === 'true' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <p className="font-medium">Pagamento completato con successo!</p>
            <p>Stiamo preparando il tuo report...</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                <span className="text-4xl font-bold">{attempt.score}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Punteggio IQ</h2>
              <div className={`inline-block px-4 py-2 rounded-full ${category.bg} ${category.color} font-medium mt-2`}>
                {category.label}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Percentile</span>
                <span className="font-bold text-gray-900">{attempt.percentile}°</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Stato</span>
                <span className={`font-bold ${hasPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {hasPaid ? 'Sbloccato' : 'Da sbloccare'}
                </span>
              </div>
              {payment && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Pagamento</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Explanation & Upgrade */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cosa significa questo punteggio?</h3>
              <p className="text-gray-700 mb-4">
                Il tuo punteggio di {attempt.score} indica un quoziente intellettivo {category.label.toLowerCase()}. 
                Questo risultato si colloca nel {attempt.percentile}° percentile rispetto alla popolazione generale.
              </p>
              <p className="text-gray-700">
                {hasPaid 
                  ? 'Hai accesso completo al report dettagliato!'
                  : 'Sblocca il report completo per analisi dettagliate, confronti e consigli personalizzati.'
                }
              </p>
            </div>

            {!hasPaid ? (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Sblocca il Report Completo</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Analisi dettagliata per ogni domanda
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Confronto con gruppi per età e professione
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Consigli personalizzati per migliorare
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    PDF scaricabile con grafici e statistiche
                  </li>
                </ul>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold">{formatCurrency(price, 'eur')}</div>
                  <div className="text-blue-200">Pagamento una tantum</div>
                </div>
                
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPurchasing ? 'Preparazione checkout...' : 'Sblocca Report Completo'}
                </button>
                
                <p className="text-center text-blue-200 text-sm mt-4">
                  Pagamento sicuro con Stripe • Rimborso entro 30 giorni
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Report Sbloccato! 🎉</h3>
                <p className="mb-6">Hai accesso completo al report dettagliato del tuo test IQ.</p>
                
                {report?.pdf_url ? (
                  <a
                    href={report.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-center"
                  >
                    Scarica PDF Report
                  </a>
                ) : (
                  <button
                    onClick={() => alert('PDF in preparazione...')}
                    className="w-full py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Genera PDF Report
                  </button>
                )}
                
                <div className="mt-6 text-center text-green-200 text-sm">
                  <p>Scadenza: {new Date(report?.expires_at || '').toLocaleDateString('it-IT')}</p>
                  <p className="mt-2">Accessi rimanenti: illimitati</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            Rifai il test
          </Link>
          <button
            onClick={() => alert('Condivisione social coming soon')}
            className="px-8 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
          >
            Condividi risultato
          </button>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>IQDecoder è uno strumento di valutazione cognitiva. I risultati non costituiscono una diagnosi medica.</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> • 
            <Link href="/terms" className="text-blue-600 hover:underline ml-4">Termini di servizio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
