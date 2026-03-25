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
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Scopri di più
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
              <div className="text-gray-600 text-sm">Tempo medio</div>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600 text-sm">Soddisfazione</div>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600 text-sm">Test completati</div>
            </div>
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
              <div className="text-gray-600 text-sm">Valutazione media</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Perché scegliere il nostro test?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-blue-600 text-2xl font-bold mb-4">🎯 Scientifico</div>
            <p className="text-gray-600">
              Basato su principi di psicometria e test cognitivi validati.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-blue-600 text-2xl font-bold mb-4">⚡ Veloce</div>
            <p className="text-gray-600">
              5 domande mirate che valutano diverse capacità cognitive.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-blue-600 text-2xl font-bold mb-4">📊 Dettagliato</div>
            <p className="text-gray-600">
              Report completo con analisi per area e consigli personalizzati.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Cosa dicono i nostri utenti
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">M</div>
              <div className="ml-4">
                <div className="font-bold">Marco R.</div>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600 italic">"Il report premium mi ha dato consigli pratici che sto applicando. Vale ogni centesimo!"</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">S</div>
              <div className="ml-4">
                <div className="font-bold">Sara L.</div>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600 italic">"Test veloce e preciso. Mi ha aiutato a capire le mie aree di miglioramento."</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">A</div>
              <div className="ml-4">
                <div className="font-bold">Andrea B.</div>
                <div className="text-yellow-500">★★★★★</div>
              </div>
            </div>
            <p className="text-gray-600 italic">"Facile da usare sul telefono. Ho fatto il test in metropolitana!"</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Domande Frequenti
        </h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Il test è veramente gratuito?</h3>
            <p className="text-gray-600">Sì, il test di 5 domande e il punteggio base sono completamente gratuiti. Solo il report dettagliato con analisi completa è a pagamento.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">I miei dati sono sicuri?</h3>
            <p className="text-gray-600">Utilizziamo crittografia end-to-end e non condividiamo mai i tuoi dati con terze parti. I pagamenti sono gestiti da Stripe, leader mondiale in sicurezza.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Posso ottenere un rimborso?</h3>
            <p className="text-gray-600">Offriamo 30 giorni di garanzia soddisfatti. Se non sei contento del report, ti rimborsiamo integralmente.</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto a scoprire il tuo vero potenziale?</h2>
          <p className="text-xl mb-6 opacity-90">
            Unisciti a <span className="font-bold">10.000+ persone</span> che hanno già scoperto il loro quoziente intellettivo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
            >
              🚀 Inizia Test Gratuito
            </Link>
            <div className="text-sm opacity-80">
              ✅ Nessuna carta di credito richiesta • 5 minuti • Risultato immediato
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-8 text-sm opacity-80">
            <div>🔒 Pagamento sicuro</div>
            <div>📄 Privacy garantita</div>
            <div>⏱️ Test veloce</div>
          </div>
        </div>
      </div>
    </div>
  );
}
