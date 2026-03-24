import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Scopri il tuo 
            <span className="text-blue-600"> Quoziente Intellettivo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Test scientifico di 5 domande che valuta logica, ragionamento e capacità cognitive. 
            Ottieni il tuo punteggio immediato e sblocca il report completo con analisi dettagliata.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/quiz"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors text-lg shadow-lg"
            >
              Inizia il Test Gratuito
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Scopri di più
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5 min</div>
              <div className="text-gray-600">Tempo medio per completare</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Soddisfazione utenti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Test completati</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Perché scegliere IQDecoder?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Test Scientifico</h3>
            <p className="text-gray-600">
              Domande validate da psicometristi per una valutazione accurata delle capacità cognitive.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Garantita</h3>
            <p className="text-gray-600">
              I tuoi dati sono sempre al sicuro. Nessuna informazione personale richiesta per il test base.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Report Dettagliato</h3>
            <p className="text-gray-600">
              Sblocca l'analisi completa con grafici, percentili e consigli personalizzati per migliorare.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto a scoprire il tuo potenziale?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Inizia ora il test gratuito e ottieni il tuo punteggio IQ immediato.
          </p>
          <Link
            href="/quiz"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
          >
            Inizia il Test Gratuito
          </Link>
          <p className="mt-6 text-blue-200">
            Nessuna carta di credito richiesta • Risultato immediato
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">IQDecoder</div>
              <p className="text-gray-400 mt-2">Valuta il tuo potenziale cognitivo</p>
            </div>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Termini
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contatti
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 IQDecoder. Tutti i diritti riservati.</p>
            <p className="mt-2">Questo test non costituisce una diagnosi medica o psicologica.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
