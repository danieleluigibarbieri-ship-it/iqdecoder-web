import type { Lang } from "@/i18n/translations";

export type QuestionCategory = "logic" | "numeric" | "verbal" | "spatial" | "memory";

export type Question = {
  id: string;
  category: QuestionCategory;
  prompt: Record<Lang, string>;
  options: Record<Lang, [string, string, string, string]>;
  correctIndex: number;
};

export type CategoryScore = {
  category: QuestionCategory;
  correct: number;
  total: number;
};

export type Evaluation = {
  totalCorrect: number;
  totalQuestions: number;
  estimatedIq: number;
  percentile: number;
  categories: CategoryScore[];
  summary: Record<Lang, string>;
  strengths: Record<Lang, string[]>;
  recommendations: Record<Lang, string[]>;
  assessmentBand: Record<Lang, string>;
};

export const TEST_MINUTES = 20;
export const PRICE_EUR_CENTS = 50;
export const QUESTION_SET_VERSION = "v1";

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "logic",
    prompt: {
      en: "Complete the sequence: 3, 8, 15, 24, 35, ?",
      it: "Completa la sequenza: 3, 8, 15, 24, 35, ?",
      fr: "Completez la suite: 3, 8, 15, 24, 35, ?",
      de: "Erganz die Folge: 3, 8, 15, 24, 35, ?",
      es: "Completa la secuencia: 3, 8, 15, 24, 35, ?",
    },
    options: {
      en: ["46", "48", "50", "52"],
      it: ["46", "48", "50", "52"],
      fr: ["46", "48", "50", "52"],
      de: ["46", "48", "50", "52"],
      es: ["46", "48", "50", "52"],
    },
    correctIndex: 1,
  },
  {
    id: "q2",
    category: "logic",
    prompt: {
      en: "All coders are analysts. Some analysts are musicians. Which statement must be true?",
      it: "Tutti i coder sono analisti. Alcuni analisti sono musicisti. Quale affermazione e certamente vera?",
      fr: "Tous les codeurs sont analystes. Certains analystes sont musiciens. Quelle affirmation est toujours vraie?",
      de: "Alle Coder sind Analysten. Einige Analysten sind Musiker. Welche Aussage muss wahr sein?",
      es: "Todos los coders son analistas. Algunos analistas son musicos. Que afirmacion debe ser verdadera?",
    },
    options: {
      en: ["All musicians are coders", "No musician is an analyst", "Some musicians are analysts", "All analysts are coders"],
      it: ["Tutti i musicisti sono coder", "Nessun musicista e analista", "Alcuni musicisti sono analisti", "Tutti gli analisti sono coder"],
      fr: ["Tous les musiciens sont codeurs", "Aucun musicien n'est analyste", "Certains musiciens sont analystes", "Tous les analystes sont codeurs"],
      de: ["Alle Musiker sind Coder", "Kein Musiker ist Analyst", "Einige Musiker sind Analysten", "Alle Analysten sind Coder"],
      es: ["Todos los musicos son coders", "Ningun musico es analista", "Algunos musicos son analistas", "Todos los analistas son coders"],
    },
    correctIndex: 2,
  },
  {
    id: "q3",
    category: "logic",
    prompt: {
      en: "If the day after tomorrow is Thursday, what day was 3 days before yesterday?",
      it: "Se dopodomani e giovedi, che giorno era 3 giorni prima di ieri?",
      fr: "Si apres-demain est jeudi, quel jour etait 3 jours avant hier?",
      de: "Wenn ubermorgen Donnerstag ist, welcher Tag war 3 Tage vor gestern?",
      es: "Si pasado manana es jueves, que dia era 3 dias antes de ayer?",
    },
    options: {
      en: ["Thursday", "Friday", "Saturday", "Sunday"],
      it: ["Giovedi", "Venerdi", "Sabato", "Domenica"],
      fr: ["Jeudi", "Vendredi", "Samedi", "Dimanche"],
      de: ["Donnerstag", "Freitag", "Samstag", "Sonntag"],
      es: ["Jueves", "Viernes", "Sabado", "Domingo"],
    },
    correctIndex: 1,
  },
  {
    id: "q4",
    category: "logic",
    prompt: {
      en: "Which number does not fit: 2, 3, 5, 9, 17, 33",
      it: "Quale numero non appartiene: 2, 3, 5, 9, 17, 33",
      fr: "Quel nombre ne convient pas: 2, 3, 5, 9, 17, 33",
      de: "Welche Zahl passt nicht: 2, 3, 5, 9, 17, 33",
      es: "Que numero no encaja: 2, 3, 5, 9, 17, 33",
    },
    options: {
      en: ["3", "5", "9", "33"],
      it: ["3", "5", "9", "33"],
      fr: ["3", "5", "9", "33"],
      de: ["3", "5", "9", "33"],
      es: ["3", "5", "9", "33"],
    },
    correctIndex: 0,
  },
  {
    id: "q5",
    category: "numeric",
    prompt: {
      en: "If x:y = 3:5 and x + y = 64, what is x?",
      it: "Se x:y = 3:5 e x + y = 64, quanto vale x?",
      fr: "Si x:y = 3:5 et x + y = 64, combien vaut x?",
      de: "Wenn x:y = 3:5 und x + y = 64, wie gross ist x?",
      es: "Si x:y = 3:5 y x + y = 64, cuanto vale x?",
    },
    options: {
      en: ["20", "22", "24", "26"],
      it: ["20", "22", "24", "26"],
      fr: ["20", "22", "24", "26"],
      de: ["20", "22", "24", "26"],
      es: ["20", "22", "24", "26"],
    },
    correctIndex: 2,
  },
  {
    id: "q6",
    category: "numeric",
    prompt: {
      en: "Find the missing number: 5, 9, 17, 33, 65, ?",
      it: "Trova il numero mancante: 5, 9, 17, 33, 65, ?",
      fr: "Trouvez le nombre manquant: 5, 9, 17, 33, 65, ?",
      de: "Finde die fehlende Zahl: 5, 9, 17, 33, 65, ?",
      es: "Encuentra el numero faltante: 5, 9, 17, 33, 65, ?",
    },
    options: {
      en: ["97", "113", "121", "129"],
      it: ["97", "113", "121", "129"],
      fr: ["97", "113", "121", "129"],
      de: ["97", "113", "121", "129"],
      es: ["97", "113", "121", "129"],
    },
    correctIndex: 3,
  },
  {
    id: "q7",
    category: "numeric",
    prompt: {
      en: "A value drops 20% then rises 20%. Final value is:",
      it: "Un valore scende del 20% e poi sale del 20%. Il valore finale e:",
      fr: "Une valeur baisse de 20% puis monte de 20%. La valeur finale est:",
      de: "Ein Wert sinkt um 20% und steigt dann um 20%. Der Endwert ist:",
      es: "Un valor baja 20% y luego sube 20%. El valor final es:",
    },
    options: {
      en: ["Same", "4% higher", "4% lower", "8% lower"],
      it: ["Uguale", "4% piu alto", "4% piu basso", "8% piu basso"],
      fr: ["Identique", "4% plus haut", "4% plus bas", "8% plus bas"],
      de: ["Gleich", "4% hoher", "4% niedriger", "8% niedriger"],
      es: ["Igual", "4% mas alto", "4% mas bajo", "8% mas bajo"],
    },
    correctIndex: 2,
  },
  {
    id: "q8",
    category: "numeric",
    prompt: {
      en: "How many 3-letter arrangements from A,B,C,D without repetition?",
      it: "Quante disposizioni di 3 lettere con A,B,C,D senza ripetizioni?",
      fr: "Combien d'arrangements de 3 lettres avec A,B,C,D sans repetition?",
      de: "Wie viele 3-Buchstaben-Anordnungen aus A,B,C,D ohne Wiederholung?",
      es: "Cuantos arreglos de 3 letras con A,B,C,D sin repeticion?",
    },
    options: {
      en: ["12", "18", "24", "36"],
      it: ["12", "18", "24", "36"],
      fr: ["12", "18", "24", "36"],
      de: ["12", "18", "24", "36"],
      es: ["12", "18", "24", "36"],
    },
    correctIndex: 2,
  },
  {
    id: "q9",
    category: "verbal",
    prompt: {
      en: "Opaque is to transparent as taciturn is to:",
      it: "Opaco sta a trasparente come taciturno sta a:",
      fr: "Opaque est a transparent comme taciturne est a:",
      de: "Undurchsichtig steht zu transparent wie wortkarg zu:",
      es: "Opaco es a transparente como taciturno es a:",
    },
    options: {
      en: ["Reflective", "Talkative", "Uncertain", "Careful"],
      it: ["Riflessivo", "Loquace", "Incerto", "Prudente"],
      fr: ["Reflexif", "Bavard", "Incertain", "Prudent"],
      de: ["Nachdenklich", "Gesprachig", "Unsicher", "Vorsichtig"],
      es: ["Reflexivo", "Hablador", "Incierto", "Prudente"],
    },
    correctIndex: 1,
  },
  {
    id: "q10",
    category: "verbal",
    prompt: {
      en: "Choose the best opposite of mitigate:",
      it: "Scegli il contrario migliore di mitigare:",
      fr: "Choisissez le meilleur contraire de attenuer:",
      de: "Wahle das beste Gegenteil von abschwachen:",
      es: "Elige el mejor opuesto de mitigar:",
    },
    options: {
      en: ["Soothe", "Exacerbate", "Reduce", "Adapt"],
      it: ["Attenuare", "Esacerbare", "Ridurre", "Adattare"],
      fr: ["Adoucir", "Aggraver", "Reduire", "Adapter"],
      de: ["Beruhigen", "Verschlimmern", "Reduzieren", "Anpassen"],
      es: ["Suavizar", "Exacerbar", "Reducir", "Adaptar"],
    },
    correctIndex: 1,
  },
  {
    id: "q11",
    category: "verbal",
    prompt: {
      en: "Book is to reading as fork is to:",
      it: "Libro sta a leggere come forchetta sta a:",
      fr: "Livre est a lecture comme fourchette est a:",
      de: "Buch verhalt sich zu lesen wie Gabel zu:",
      es: "Libro es a leer como tenedor es a:",
    },
    options: {
      en: ["Writing", "Eating", "Cutting", "Washing"],
      it: ["Scrivere", "Mangiare", "Tagliare", "Lavare"],
      fr: ["Ecrire", "Manger", "Couper", "Laver"],
      de: ["Schreiben", "Essen", "Schneiden", "Waschen"],
      es: ["Escribir", "Comer", "Cortar", "Lavar"],
    },
    correctIndex: 1,
  },
  {
    id: "q12",
    category: "verbal",
    prompt: {
      en: "Which sentence is most logically coherent?",
      it: "Quale frase e logicamente piu coerente?",
      fr: "Quelle phrase est la plus coherente logiquement?",
      de: "Welcher Satz ist logisch am stimmigsten?",
      es: "Que frase es la mas coherente logicamente?",
    },
    options: {
      en: ["Popular ideas are always true", "Strong evidence reduces uncertainty", "Random outcomes are always reproducible", "Reliable studies avoid verification"],
      it: ["Le idee popolari sono sempre vere", "Una prova forte riduce l'incertezza", "I risultati casuali sono sempre replicabili", "Gli studi affidabili evitano verifiche"],
      fr: ["Les idees populaires sont toujours vraies", "Une preuve forte reduit l'incertitude", "Les resultats aleatoires sont toujours reproductibles", "Les etudes fiables evitent la verification"],
      de: ["Populare Ideen sind immer wahr", "Starke Evidenz reduziert Unsicherheit", "Zufallsergebnisse sind immer reproduzierbar", "Verlassliche Studien vermeiden Prufung"],
      es: ["Las ideas populares siempre son verdaderas", "La evidencia fuerte reduce la incertidumbre", "Los resultados aleatorios siempre se reproducen", "Los estudios fiables evitan verificacion"],
    },
    correctIndex: 1,
  },
  {
    id: "q13",
    category: "spatial",
    prompt: {
      en: "A painted cube is divided into 27 smaller cubes. How many have exactly two painted faces?",
      it: "Un cubo dipinto su tutte le facce e diviso in 27 cubetti. Quanti hanno esattamente 2 facce dipinte?",
      fr: "Un cube peint est divise en 27 petits cubes. Combien ont exactement 2 faces peintes?",
      de: "Ein bemalter Wurfel wird in 27 kleine Wurfel geteilt. Wie viele haben genau 2 bemalte Flachen?",
      es: "Un cubo pintado se divide en 27 cubitos. Cuantos tienen exactamente 2 caras pintadas?",
    },
    options: {
      en: ["8", "12", "18", "24"],
      it: ["8", "12", "18", "24"],
      fr: ["8", "12", "18", "24"],
      de: ["8", "12", "18", "24"],
      es: ["8", "12", "18", "24"],
    },
    correctIndex: 1,
  },
  {
    id: "q14",
    category: "spatial",
    prompt: {
      en: "How many diagonals does a decagon have?",
      it: "Quante diagonali ha un decagono?",
      fr: "Combien de diagonales a un decagone?",
      de: "Wie viele Diagonalen hat ein Zehneck?",
      es: "Cuantas diagonales tiene un decagono?",
    },
    options: {
      en: ["30", "32", "35", "40"],
      it: ["30", "32", "35", "40"],
      fr: ["30", "32", "35", "40"],
      de: ["30", "32", "35", "40"],
      es: ["30", "32", "35", "40"],
    },
    correctIndex: 2,
  },
  {
    id: "q15",
    category: "spatial",
    prompt: {
      en: "Facing North: right, right, left, then 180 degrees. Final direction?",
      it: "Guardi a Nord: destra, destra, sinistra, poi 180 gradi. Direzione finale?",
      fr: "Face au Nord: droite, droite, gauche, puis 180 degres. Direction finale?",
      de: "Blick nach Norden: rechts, rechts, links, dann 180 Grad. Endrichtung?",
      es: "Mirando al Norte: derecha, derecha, izquierda y 180 grados. Direccion final?",
    },
    options: {
      en: ["North", "South", "East", "West"],
      it: ["Nord", "Sud", "Est", "Ovest"],
      fr: ["Nord", "Sud", "Est", "Ouest"],
      de: ["Nord", "Sud", "Ost", "West"],
      es: ["Norte", "Sur", "Este", "Oeste"],
    },
    correctIndex: 3,
  },
  {
    id: "q16",
    category: "spatial",
    prompt: {
      en: "Which solid has one continuous curved surface and no vertices?",
      it: "Quale solido ha una sola superficie curva continua e nessun vertice?",
      fr: "Quel solide a une seule surface courbe continue et aucun sommet?",
      de: "Welcher Korper hat eine durchgehende gekrummte Flache und keine Ecken?",
      es: "Que solido tiene una sola superficie curva continua y ningun vertice?",
    },
    options: {
      en: ["Cylinder", "Cone", "Sphere", "Prism"],
      it: ["Cilindro", "Cono", "Sfera", "Prisma"],
      fr: ["Cylindre", "Cone", "Sphere", "Prisme"],
      de: ["Zylinder", "Kegel", "Kugel", "Prisma"],
      es: ["Cilindro", "Cono", "Esfera", "Prisma"],
    },
    correctIndex: 2,
  },
  {
    id: "q17",
    category: "memory",
    prompt: {
      en: "Memorize: 7-1-9-4-2-8. What was the 4th number?",
      it: "Memorizza: 7-1-9-4-2-8. Qual era il 4 numero?",
      fr: "Memorisez: 7-1-9-4-2-8. Quel etait le 4e nombre?",
      de: "Merke dir: 7-1-9-4-2-8. Was war die 4. Zahl?",
      es: "Memoriza: 7-1-9-4-2-8. Cual era el 4 numero?",
    },
    options: {
      en: ["2", "4", "7", "9"],
      it: ["2", "4", "7", "9"],
      fr: ["2", "4", "7", "9"],
      de: ["2", "4", "7", "9"],
      es: ["2", "4", "7", "9"],
    },
    correctIndex: 1,
  },
  {
    id: "q18",
    category: "memory",
    prompt: {
      en: "Memorize: Q, T, B, L, R. Which letter came before the last one?",
      it: "Memorizza: Q, T, B, L, R. Quale lettera era prima dell'ultima?",
      fr: "Memorisez: Q, T, B, L, R. Quelle lettre venait avant la derniere?",
      de: "Merke dir: Q, T, B, L, R. Welcher Buchstabe stand vor dem letzten?",
      es: "Memoriza: Q, T, B, L, R. Que letra iba antes de la ultima?",
    },
    options: {
      en: ["B", "L", "Q", "T"],
      it: ["B", "L", "Q", "T"],
      fr: ["B", "L", "Q", "T"],
      de: ["B", "L", "Q", "T"],
      es: ["B", "L", "Q", "T"],
    },
    correctIndex: 1,
  },
  {
    id: "q19",
    category: "memory",
    prompt: {
      en: "Memorize: BLUE, 14, RIVER, 9, CLOUD. What was the second item?",
      it: "Memorizza: BLU, 14, FIUME, 9, NUVOLA. Qual era il secondo elemento?",
      fr: "Memorisez: BLEU, 14, RIVIERE, 9, NUAGE. Quel etait le second element?",
      de: "Merke dir: BLAU, 14, FLUSS, 9, WOLKE. Was war das zweite Element?",
      es: "Memoriza: AZUL, 14, RIO, 9, NUBE. Cual era el segundo elemento?",
    },
    options: {
      en: ["BLUE", "14", "RIVER", "9"],
      it: ["BLU", "14", "FIUME", "9"],
      fr: ["BLEU", "14", "RIVIERE", "9"],
      de: ["BLAU", "14", "FLUSS", "9"],
      es: ["AZUL", "14", "RIO", "9"],
    },
    correctIndex: 1,
  },
  {
    id: "q20",
    category: "memory",
    prompt: {
      en: "Memorize: M7, P2, L9, R4. Which pair came right after P2?",
      it: "Memorizza: M7, P2, L9, R4. Quale coppia veniva subito dopo P2?",
      fr: "Memorisez: M7, P2, L9, R4. Quelle paire venait juste apres P2?",
      de: "Merke dir: M7, P2, L9, R4. Welches Paar kam direkt nach P2?",
      es: "Memoriza: M7, P2, L9, R4. Que par venia justo despues de P2?",
    },
    options: {
      en: ["M7", "L9", "R4", "P2"],
      it: ["M7", "L9", "R4", "P2"],
      fr: ["M7", "L9", "R4", "P2"],
      de: ["M7", "L9", "R4", "P2"],
      es: ["M7", "L9", "R4", "P2"],
    },
    correctIndex: 1,
  },
];

export function categoryLabel(lang: Lang, category: QuestionCategory): string {
  const map: Record<QuestionCategory, Record<Lang, string>> = {
    logic: { en: "Logic", it: "Logica", fr: "Logique", de: "Logik", es: "Logica" },
    numeric: { en: "Numeric", it: "Numerico", fr: "Numerique", de: "Numerisch", es: "Numerico" },
    verbal: { en: "Verbal", it: "Verbale", fr: "Verbal", de: "Verbal", es: "Verbal" },
    spatial: { en: "Spatial", it: "Spaziale", fr: "Spatial", de: "Raumlich", es: "Espacial" },
    memory: { en: "Memory", it: "Memoria", fr: "Memoire", de: "Gedachtnis", es: "Memoria" },
  };
  return map[category][lang];
}

function estimatePercentile(estimatedIq: number): number {
  if (estimatedIq >= 130) return 98;
  if (estimatedIq >= 120) return 91;
  if (estimatedIq >= 110) return 75;
  if (estimatedIq >= 100) return 50;
  if (estimatedIq >= 90) return 30;
  if (estimatedIq >= 80) return 12;
  return 5;
}

export function evaluateAnswers(answers: number[]): Evaluation {
  const totalCorrect = QUESTIONS.reduce((acc, q, index) => acc + (answers[index] === q.correctIndex ? 1 : 0), 0);
  const estimatedIq = Math.max(70, Math.min(145, Math.round(70 + totalCorrect * 3.75)));
  const percentile = estimatePercentile(estimatedIq);

  const categories: CategoryScore[] = (["logic", "numeric", "verbal", "spatial", "memory"] as const).map((category) => {
    const bucket = QUESTIONS.filter((q) => q.category === category);
    const correct = bucket.reduce((acc, q) => {
      const idx = QUESTIONS.findIndex((item) => item.id === q.id);
      return acc + (answers[idx] === q.correctIndex ? 1 : 0);
    }, 0);

    return {
      category,
      correct,
      total: bucket.length,
    };
  });

  const strongest = [...categories].sort((a, b) => b.correct - a.correct).slice(0, 2);
  const weakest = [...categories].sort((a, b) => a.correct - b.correct).slice(0, 2);

  return {
    totalCorrect,
    totalQuestions: QUESTIONS.length,
    estimatedIq,
    percentile,
    categories,
    summary: {
      en: `Estimated score ${estimatedIq} IQ (${percentile}th percentile). You answered ${totalCorrect} out of ${QUESTIONS.length} correctly.`,
      it: `Punteggio stimato ${estimatedIq} IQ (${percentile} percentile). Hai risposto correttamente a ${totalCorrect} domande su ${QUESTIONS.length}.`,
      fr: `Score estime ${estimatedIq} IQ (${percentile}e percentile). Vous avez repondu correctement a ${totalCorrect} questions sur ${QUESTIONS.length}.`,
      de: `Geschaetzter Wert ${estimatedIq} IQ (${percentile}. Perzentil). Du hast ${totalCorrect} von ${QUESTIONS.length} Fragen richtig beantwortet.`,
      es: `Puntuacion estimada ${estimatedIq} IQ (${percentile} percentil). Respondiste correctamente ${totalCorrect} de ${QUESTIONS.length}.`,
    },
    strengths: {
      en: strongest.map((x) => `Strong performance in ${categoryLabel("en", x.category)} (${x.correct}/${x.total}).`),
      it: strongest.map((x) => `Buona performance in ${categoryLabel("it", x.category)} (${x.correct}/${x.total}).`),
      fr: strongest.map((x) => `Bonne performance en ${categoryLabel("fr", x.category)} (${x.correct}/${x.total}).`),
      de: strongest.map((x) => `Starke Leistung in ${categoryLabel("de", x.category)} (${x.correct}/${x.total}).`),
      es: strongest.map((x) => `Buen rendimiento en ${categoryLabel("es", x.category)} (${x.correct}/${x.total}).`),
    },
    recommendations: {
      en: weakest.map((x) => `Train ${categoryLabel("en", x.category)} with focused practice (current ${x.correct}/${x.total}).`),
      it: weakest.map((x) => `Allena ${categoryLabel("it", x.category)} con pratica mirata (attuale ${x.correct}/${x.total}).`),
      fr: weakest.map((x) => `Travaillez ${categoryLabel("fr", x.category)} avec une pratique ciblee (actuel ${x.correct}/${x.total}).`),
      de: weakest.map((x) => `Trainiere ${categoryLabel("de", x.category)} gezielt (aktuell ${x.correct}/${x.total}).`),
      es: weakest.map((x) => `Entrena ${categoryLabel("es", x.category)} con practica enfocada (actual ${x.correct}/${x.total}).`),
    },
    assessmentBand: {
      en: estimatedIq >= 120 ? "High range" : estimatedIq >= 100 ? "Upper-mid range" : estimatedIq >= 90 ? "Mid range" : "Development range",
      it: estimatedIq >= 120 ? "Fascia alta" : estimatedIq >= 100 ? "Fascia medio-alta" : estimatedIq >= 90 ? "Fascia media" : "Fascia da potenziare",
      fr: estimatedIq >= 120 ? "Niveau eleve" : estimatedIq >= 100 ? "Niveau moyen-superieur" : estimatedIq >= 90 ? "Niveau moyen" : "Niveau a developper",
      de: estimatedIq >= 120 ? "Hoher Bereich" : estimatedIq >= 100 ? "Oberer Mittelfeldbereich" : estimatedIq >= 90 ? "Mittlerer Bereich" : "Entwicklungsbereich",
      es: estimatedIq >= 120 ? "Rango alto" : estimatedIq >= 100 ? "Rango medio-alto" : estimatedIq >= 90 ? "Rango medio" : "Rango de desarrollo",
    },
  };
}
