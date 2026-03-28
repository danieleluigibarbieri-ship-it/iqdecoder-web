export type Lang = "en" | "it" | "fr" | "de" | "es";

export type HomeTranslations = {
  kicker: string;
  title: string;
  subtitle: string;
  bullets: [string, string, string];
  metrics: [string, string, string];
  metricsLabels: [string, string, string];
  chooseGender: string;
  male: string;
  female: string;
  start: string;
  ctaHint: string;
  trustLine: string;
  valueTitle: string;
  valueCards: [string, string, string];
  hint: string;
  disclaimer: string;
};

export const LANG_OPTIONS: Array<{ code: Lang; label: string }> = [
  { code: "en", label: "EN" },
  { code: "it", label: "IT" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
];

export const HOME_COPY: Record<Lang, HomeTranslations> = {
  en: {
    kicker: "IQ Decoder Premium",
    title: "Discover your IQ in one focused session.",
    subtitle: "Start free now. Unlock the full report only if you want deeper analysis.",
    bullets: [
      "20 questions with progressively higher difficulty",
      "Choose the best answer among 4 options",
      "You can go back and review before final submit",
    ],
    metrics: ["20 Questions", "20 Minutes", "Unlock EUR 0.50"],
    metricsLabels: ["Users tested this month", "Average experience rating", "One-time premium unlock"],
    chooseGender: "Select your profile to continue",
    male: "Male",
    female: "Female",
    start: "Start Free Test",
    ctaHint: "No subscription. No hidden fees. Pay only if you unlock.",
    trustLine: "Secure checkout by Stripe. Data handled with privacy-first storage.",
    valueTitle: "Why this page converts",
    valueCards: [
      "Fast pre-test flow with one clear action",
      "Scientific tone with simple language",
      "High perceived value before checkout",
    ],
    hint: "Average IQ today: 120",
    disclaimer: "For educational and informational purposes only. This is not a clinical diagnosis.",
  },
  it: {
    kicker: "IQ Decoder Premium",
    title: "Scopri il tuo IQ in una sessione focalizzata.",
    subtitle: "Inizia gratis ora. Sblocchi il report completo solo se vuoi approfondire.",
    bullets: [
      "20 domande con difficolta progressiva",
      "Seleziona la risposta migliore tra 4 opzioni",
      "Puoi tornare indietro e rivedere prima dell'invio finale",
    ],
    metrics: ["20 Domande", "20 Minuti", "Sblocco EUR 0.50"],
    metricsLabels: ["Utenti testati questo mese", "Valutazione media esperienza", "Sblocco premium one-time"],
    chooseGender: "Seleziona il tuo profilo per continuare",
    male: "Maschio",
    female: "Femmina",
    start: "Inizia Test Gratis",
    ctaHint: "Nessun abbonamento. Nessun costo nascosto. Paghi solo se sblocchi.",
    trustLine: "Checkout sicuro con Stripe. Dati gestiti con storage privacy-first.",
    valueTitle: "Perche questa pagina converte",
    valueCards: [
      "Flusso pre-test veloce con una sola azione chiara",
      "Tono scientifico con linguaggio semplice",
      "Valore percepito alto prima del checkout",
    ],
    hint: "IQ medio di oggi: 120",
    disclaimer: "Solo per uso educativo e informativo. Non costituisce una diagnosi clinica.",
  },
  fr: {
    kicker: "IQ Decoder Premium",
    title: "Decouvrez votre IQ en une session ciblee.",
    subtitle: "Commencez gratuitement. Debloquez le rapport complet seulement si vous le souhaitez.",
    bullets: [
      "20 questions avec difficulte progressive",
      "Choisissez la meilleure reponse parmi 4 options",
      "Vous pouvez revenir en arriere avant l'envoi final",
    ],
    metrics: ["20 Questions", "20 Minutes", "Deblocage EUR 0.50"],
    metricsLabels: ["Utilisateurs testes ce mois", "Note moyenne d'experience", "Deblocage premium one-shot"],
    chooseGender: "Selectionnez votre profil pour continuer",
    male: "Homme",
    female: "Femme",
    start: "Commencer test",
    ctaHint: "Aucun abonnement. Aucun frais cache. Paiement uniquement si vous debloquez.",
    trustLine: "Paiement securise Stripe. Donnees gerees avec une logique privacy-first.",
    valueTitle: "Pourquoi cette page convertit",
    valueCards: [
      "Flux pre-test rapide avec une seule action claire",
      "Ton scientifique avec langage simple",
      "Valeur percue elevee avant checkout",
    ],
    hint: "IQ moyen aujourd'hui: 120",
    disclaimer: "Usage educatif et informatif uniquement. Ce n'est pas un diagnostic clinique.",
  },
  de: {
    kicker: "IQ Decoder Premium",
    title: "Entdecke deinen IQ in einer fokussierten Session.",
    subtitle: "Jetzt kostenlos starten. Vollen Bericht nur bei Bedarf freischalten.",
    bullets: [
      "20 Fragen mit steigender Schwierigkeit",
      "Wahle die beste Antwort aus 4 Optionen",
      "Du kannst vor dem finalen Absenden zuruckgehen",
    ],
    metrics: ["20 Fragen", "20 Minuten", "Freischaltung EUR 0.50"],
    metricsLabels: ["Getestete Nutzer diesen Monat", "Durchschnittliche Bewertung", "Einmaliger Premium-Unlock"],
    chooseGender: "Wahle dein Profil, um fortzufahren",
    male: "Mannlich",
    female: "Weiblich",
    start: "Test starten",
    ctaHint: "Kein Abo. Keine versteckten Kosten. Du zahlst nur beim Freischalten.",
    trustLine: "Sicherer Checkout via Stripe. Daten werden privacy-first gespeichert.",
    valueTitle: "Warum diese Seite konvertiert",
    valueCards: [
      "Schneller Pre-Test-Flow mit einer klaren Aktion",
      "Wissenschaftlicher Ton mit einfacher Sprache",
      "Hoher wahrgenommener Wert vor dem Checkout",
    ],
    hint: "Durchschnittlicher IQ heute: 120",
    disclaimer: "Nur fur Bildungs- und Informationszwecke. Keine klinische Diagnose.",
  },
  es: {
    kicker: "IQ Decoder Premium",
    title: "Descubre tu IQ en una sesion enfocada.",
    subtitle: "Empieza gratis ahora. Desbloquea el informe completo solo si quieres mas detalle.",
    bullets: [
      "20 preguntas con dificultad progresiva",
      "Elige la mejor respuesta entre 4 opciones",
      "Puedes volver antes del envio final",
    ],
    metrics: ["20 Preguntas", "20 Minutos", "Desbloqueo EUR 0.50"],
    metricsLabels: ["Usuarios evaluados este mes", "Valoracion media de experiencia", "Desbloqueo premium unico"],
    chooseGender: "Selecciona tu perfil para continuar",
    male: "Hombre",
    female: "Mujer",
    start: "Empezar test",
    ctaHint: "Sin suscripcion. Sin costes ocultos. Pagas solo si desbloqueas.",
    trustLine: "Checkout seguro con Stripe. Datos gestionados con enfoque privacy-first.",
    valueTitle: "Por que esta pagina convierte",
    valueCards: [
      "Flujo pre-test rapido con una accion clara",
      "Tono cientifico con lenguaje simple",
      "Alto valor percibido antes del checkout",
    ],
    hint: "IQ medio hoy: 120",
    disclaimer: "Solo para uso educativo e informativo. No es un diagnostico clinico.",
  },
};
