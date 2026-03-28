export type Lang = "en" | "it" | "fr" | "de" | "es";

export type HomeTranslations = {
  title: string;
  bullets: [string, string, string];
  chooseGender: string;
  male: string;
  female: string;
  start: string;
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
    title: "Get ready to start your IQ Test",
    bullets: [
      "20 questions with progressively higher difficulty",
      "Choose the best answer among 4 options",
      "You can go back and review before final submit",
    ],
    chooseGender: "Select your profile to continue",
    male: "Male",
    female: "Female",
    start: "Start Test",
    hint: "Average IQ score today: 120",
    disclaimer: "For educational and informational purposes only. This is not a clinical diagnosis.",
  },
  it: {
    title: "Preparati a iniziare il tuo Test IQ",
    bullets: [
      "20 domande con difficolta progressiva",
      "Seleziona la risposta migliore tra 4 opzioni",
      "Puoi tornare indietro e rivedere prima dell'invio finale",
    ],
    chooseGender: "Seleziona il tuo profilo per continuare",
    male: "Maschio",
    female: "Femmina",
    start: "Inizia Test",
    hint: "Punteggio IQ medio di oggi: 120",
    disclaimer: "Solo per uso educativo e informativo. Non costituisce una diagnosi clinica.",
  },
  fr: {
    title: "Preparez-vous a commencer votre test IQ",
    bullets: [
      "20 questions avec difficulte progressive",
      "Choisissez la meilleure reponse parmi 4 options",
      "Vous pouvez revenir en arriere avant l'envoi final",
    ],
    chooseGender: "Selectionnez votre profil pour continuer",
    male: "Homme",
    female: "Femme",
    start: "Commencer test",
    hint: "Score IQ moyen aujourd'hui: 120",
    disclaimer: "Usage educatif et informatif uniquement. Ce n'est pas un diagnostic clinique.",
  },
  de: {
    title: "Bereit fur deinen IQ-Test",
    bullets: [
      "20 Fragen mit steigender Schwierigkeit",
      "Wahle die beste Antwort aus 4 Optionen",
      "Du kannst vor dem finalen Absenden zuruckgehen",
    ],
    chooseGender: "Wahle dein Profil, um fortzufahren",
    male: "Mannlich",
    female: "Weiblich",
    start: "Test starten",
    hint: "Durchschnittlicher IQ-Wert heute: 120",
    disclaimer: "Nur fur Bildungs- und Informationszwecke. Keine klinische Diagnose.",
  },
  es: {
    title: "Preparate para comenzar tu test IQ",
    bullets: [
      "20 preguntas con dificultad progresiva",
      "Elige la mejor respuesta entre 4 opciones",
      "Puedes volver antes del envio final",
    ],
    chooseGender: "Selecciona tu perfil para continuar",
    male: "Hombre",
    female: "Mujer",
    start: "Empezar test",
    hint: "Puntuacion IQ media de hoy: 120",
    disclaimer: "Solo para uso educativo e informativo. No es un diagnostico clinico.",
  },
};
