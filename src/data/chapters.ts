// ============================================================================
// L'Alchimie du Miroir — Niveau 2 : L'Approfondissement
// Structured content data layer
// ============================================================================

// ---------------------------------------------------------------------------
// TypeScript Types
// ---------------------------------------------------------------------------

export interface WordAnalysis {
  arabic: string;
  transliteration: string;
  literalMeaning: string;
  mirrorDimension: string;
}

export interface MirrorQuestion {
  question: string;
  meditation: string;
}

export interface Exercise {
  question: string;
  placeholder: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  part: "intro" | "A" | "B" | "C" | "appendix";
  arabicVerse: string;
  translation: string;
  translationSource: string;
  wordAnalysis: WordAnalysis[];
  mirrorQuestions: MirrorQuestion[];
  munajatPrompts: string[];
  timerMinutes: number;
  exercises: Exercise[];
  coherencePoints?: string[];
  bulletPoints?: string[];
  callouts?: Array<{
    type: "gold" | "info" | "warning";
    title: string;
    content: string;
  }>;
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  treasuresList?: string[];
  metaphorTable?: Array<{
    element: string;
    metaphor: string;
    interpretation: string;
  }>;
  extraSections?: Array<{
    id: string;
    title: string;
    arabic: string;
    translation: string;
    commentary: string;
  }>;
  quotes?: Array<{
    text: string;
    source: string;
  }>;
}

export interface PartInfo {
  id: string;
  letter: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface SiteContent {
  intro: {
    fromLevel1to2: string;
    whatChanges: Array<{ title: string; description: string }>;
    structure: Array<{ part: string; content: string; chapters: string; duration: string }>;
    advice: string;
  };
  parts: PartInfo[];
  appendices: {
    glossary: Array<{ term: string; definition: string }>;
    journalTemplate: string[];
    resources: Array<{ title: string; author: string; description: string }>;
  };
}

// ---------------------------------------------------------------------------
// Introduction
// ---------------------------------------------------------------------------

const intro = {
  fromLevel1to2:
    "Félicitations pour avoir complété le Niveau 1. Vous avez appris les bases du tadabbur — la méditation réflexive du Coran. Le Niveau 2 est conçu pour approfondir cette pratique et vous emmener plus loin dans la compréhension intime du Livre saint.\n\nAu Niveau 1, vous avez appris à nager près du rivage. Au Niveau 2, vous allez apprendre à plonger dans l'océan de la signification. La différence n'est pas seulement de profondeur — c'est une différence de nature. Vous ne vous contentez plus de comprendre les mots : vous commencez à les vivre.",
  whatChanges: [
    {
      title: "Durée étendue",
      description: "Chaque chapitre dure 18-30 minutes (contre 10-15 au Niveau 1)",
    },
    {
      title: "Textes complets",
      description: "Analyse de versets entiers au lieu d'extraits",
    },
    {
      title: "Profondeur accrue",
      description: "Analyse linguistique, contextuelle et spirituelle avancée",
    },
    {
      title: "Al-Fatiha entière",
      description: "Les 7 versets analysés un par un avec leur dimension miroir",
    },
  ],
  structure: [
    {
      part: "Partie A",
      content: "Al-Fatiha — Verset par verset",
      chapters: "A1 à A7",
      duration: "~2h30",
    },
    {
      part: "Partie B",
      content: "Trésors du Coran — Versets clés",
      chapters: "B1 à B10",
      duration: "~3h",
    },
    {
      part: "Partie C",
      content: "Les Sept Niveaux de Lecture",
      chapters: "Théorie + Pratique",
      duration: "~1h30",
    },
  ],
  advice:
    "Ne précipitez pas votre progression. Si un chapitre vous demande plus de temps que prévu, accordez-le-lui. Le but n'est pas de finir le programme, mais de transformer votre rapport avec le Coran.",
};

// ---------------------------------------------------------------------------
// Part A — Al-Fatiha : Verset par Verset
// ---------------------------------------------------------------------------

const partADescription =
  "La Fatiha, « l'Ouverture », est la sourate la plus récitée par les musulmans. Chaque verset est un univers de signification. Dans cette partie, nous allons méditer chacun des sept versets et les voir comme un miroir de notre propre âme.";

// ---- Chapter A1 — Bismillah ----

const a1: Chapter = {
  id: "a1",
  number: "A1",
  title: "Bismillah",
  subtitle: "Au nom d'Allah",
  part: "A",
  arabicVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  translation: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [
    {
      arabic: "بِسْمِ",
      transliteration: "Bismi",
      literalMeaning: "Avec le nom / Par le nom",
      mirrorDimension:
        "Je commence chaque action en me souvenant de Celui qui me donne la capacité d'agir",
    },
    {
      arabic: "اللَّهِ",
      transliteration: "Allah",
      literalMeaning: "Le Nom propre de Dieu",
      mirrorDimension:
        "Il est le seul Être dont l'existence est nécessaire. Tout le reste dépend de Lui.",
    },
    {
      arabic: "الرَّحْمَٰنِ",
      transliteration: "Ar-Rahman",
      literalMeaning: "Le Tout Miséricordieux",
      mirrorDimension:
        "Sa miséricorde englobe toute la création — croyants et non-croyants.",
    },
    {
      arabic: "الرَّحِيمِ",
      transliteration: "Ar-Rahim",
      literalMeaning: "Le Très Miséricordieux",
      mirrorDimension:
        "Sa miséricorde spécifique est réservée aux croyants dans l'au-delà.",
    },
  ],
  coherencePoints: [
    "L'invocation avant l'action : Le Bismillah enseigne que chaque commencement doit être accompagné du souvenir de Dieu. C'est le premier geste du croyant conscient.",
    "Le nom avant la qualité : On commence par « le nom d'Allah » avant de mentionner Ses qualités (Rahman, Rahim). L'identité divine précède la manifestation de Ses attributs.",
    "La miséricorde encadrée : Les deux noms de miséricorde encadrent le verset comme deux piliers, indiquant que toute action commencée au nom de Dieu est enveloppée de miséricorde.",
  ],
  mirrorQuestions: [
    {
      question: "Est-ce que je commence mes journées avec le Bismillah ?",
      meditation:
        "Réflectez sur votre première pensée du matin. Est-elle un acte de gratitude ?",
    },
    {
      question:
        "Quelles actions entreprends-je sans invoquer Allah ?",
      meditation:
        "Identifiez les moments où vous oubliez de vous reconnecter au Divin.",
    },
    {
      question:
        "Suis-je conscient de la différence entre Rahman et Rahim dans ma vie ?",
      meditation:
        "Ressentez-vous la miséricorde générale dans la création ? La miséricorde spécifique dans la prière ?",
    },
  ],
  munajatPrompts: [
    "Ya Allah, fais que chaque « Bismillah » que je prononce soit un bouclier contre mon oubli.",
    "Ya Rahman, ouvre mon cœur à Ta miséricorde qui englobe toute chose.",
    "Ya Rahim, fais que je sois parmi ceux qui reçoivent Ta miséricorde spéciale.",
    "Ya Allah, enseigne-moi à T'invoquer avec sincérité et présence du cœur.",
  ],
  timerMinutes: 20,
  exercises: [
    {
      question:
        "Choisissez une action quotidienne (manger, travailler, sortir) et pratiquez de dire « Bismillah » avec pleine conscience pendant 24 heures. Qu'avez-vous remarqué ?",
      placeholder:
        "Décrivez votre expérience avec le Bismillah conscient pendant 24h...",
    },
    {
      question:
        "Écrivez une prière personnelle (munajat) où vous utilisez les trois noms du verset (Allah, Ar-Rahman, Ar-Rahim) en vous adressant à Dieu.",
      placeholder:
        "Votre prière personnelle avec les trois noms divins...",
    },
  ],
  callouts: [
    {
      type: "gold",
      title: "Pourquoi « bismi » et non « fi ismi » ?",
      content:
        "La préposition « bi » (avec/par) indique une association intime. Quand je dis « bismillah », je ne prononce pas simplement un nom — je m'associe à Lui, je place Son nom comme un bouclier sur mon action. C'est un acte de dépendance consciente.",
    },
  ],
};

// ---- Chapter A2 — Al-Hamd ----

const a2: Chapter = {
  id: "a2",
  number: "A2",
  title: "Al-Hamd",
  subtitle: "La louange",
  part: "A",
  arabicVerse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  translation: "Louange à Allah, Seigneur de l'univers.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [
    {
      arabic: "الْحَمْدُ",
      transliteration: "Al-Hamd",
      literalMeaning: "La louange / La gratitude",
      mirrorDimension:
        "Le « Al » (défini) indique que toute louange revient en dernier ressort à Allah — Il est la Source de toute chose digne de louange.",
    },
    {
      arabic: "لِلَّهِ",
      transliteration: "Lillah",
      literalMeaning: "A Allah (à Allah seul)",
      mirrorDimension:
        "La préposition « li » (pour) avec le « al » exclusif : la louange est destinée à Lui de manière exclusive.",
    },
    {
      arabic: "رَبِّ",
      transliteration: "Rabb",
      literalMeaning: "Seigneur / Éducateur / Nourricier",
      mirrorDimension:
        "Celui qui pourvoit à nos besoins physiques et spirituels, qui nous élève et nous guide par étapes.",
    },
    {
      arabic: "الْعَالَمِينَ",
      transliteration: "Al-'Alamin",
      literalMeaning: "Les mondes / Les univers",
      mirrorDimension:
        "Tout ce qui existe en dehors d'Allah. Il est le Seigneur non pas d'un peuple, mais de toute la création.",
    },
  ],
  mirrorQuestions: [
    {
      question:
        "Est-ce que ma louange envers Allah est conditionnelle ou inconditionnelle ?",
      meditation:
        "Louez-vous Dieu seulement quand les choses vont bien, ou aussi dans l'épreuve ?",
    },
    {
      question:
        "Reconnais-je Allah comme « Rabb » dans tous les domaines de ma vie ?",
      meditation:
        "L'acceptez-vous comme Éducateur même quand Son plan diffère du vôtre ?",
    },
    {
      question:
        "Suis-je conscient d'appartenir à « al-'alamin » — l'ensemble de la création ?",
      meditation:
        "Comment cette conscience change-t-elle votre relation avec la nature et les autres êtres ?",
    },
  ],
  munajatPrompts: [
    "Ya Allah, je Te loue pour chaque souffle que je prends sans même y penser.",
    "Ya Rabb, fais-moi reconnaître Ton éducation dans chaque épreuve et chaque facilité.",
    "Ya Allah, purifie ma louange de toute hypocrisie — que je Te loue parce que Tu le mérites, pas pour ce que j'espère recevoir.",
    "Ya Rabb al-'Alamin, ouvre mes yeux sur Ta seigneurie dans le moindre détail de la création.",
  ],
  timerMinutes: 20,
  exercises: [
    {
      question:
        "Pendant 24 heures, notez chaque fois que vous ressentez de la gratitude spontanée. Relevez-vous des « hamd » inconditionnels ?",
      placeholder:
        "Vos observations sur les moments de gratitude spontanée...",
    },
    {
      question:
        "Méditez sur le mot « Rabb » — écrivez comment vous voyez Allah comme Éducateur dans les 3 domaines suivants : votre vie spirituelle, vos relations, votre travail.",
      placeholder:
        "Allah comme Rabb dans ma vie spirituelle, mes relations, mon travail...",
    },
  ],
  callouts: [
    {
      type: "info",
      title: "Hamd vs. Shukr",
      content:
        "« Hamd » est la louange verbale avec admiration, tandis que « shukr » est la gratitude pour un bienfait reçu. Le hamd est plus élevé car il loue Dieu pour ce qu'Il est, pas seulement pour ce qu'Il donne.",
    },
  ],
};

// ---- Chapter A3 — Ar-Rahman Ar-Rahim ----

const a3: Chapter = {
  id: "a3",
  number: "A3",
  title: "Ar-Rahman Ar-Rahim",
  subtitle: "Les deux miséricordes",
  part: "A",
  arabicVerse: "الرَّحْمَٰنِ الرَّحِيمِ",
  translation: "Le Tout Miséricordieux, le Très Miséricordieux.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [], // A3 uses comparisonTable instead
  comparisonTable: {
    headers: ["Aspect", "Ar-Rahman", "Ar-Rahim"],
    rows: [
      [
        "Étendue",
        "Miséricorde universelle — pour toute la création",
        "Miséricorde spéciale — pour les croyants",
      ],
      [
        "Durée",
        "Dans ce monde (dunya)",
        "Dans l'au-delà (akhirah)",
      ],
      [
        "Usage",
        "Ne s'applique qu'à Allah",
        "Peut s'appliquer aux humains (rahum)",
      ],
      [
        "Ressenti",
        "La miséricorde comme océan — vaste, enveloppante",
        "La miséricorde comme source intime — personnelle, douce",
      ],
      [
        "Analogie",
        "Le soleil qui brille sur tous",
        "La lampe qui éclaire la chambre du croyant",
      ],
    ],
  },
  mirrorQuestions: [], // the comparison table serves this purpose
  munajatPrompts: [
    "Ya Rahman, fais que Ta miséricorde vaste couvre mes péchés et mes négligences.",
    "Ya Rahim, fais-moi parmi ceux qui héritent de Ta miséricorde dans l'au-delà.",
    "Ya Allah, enseigne-moi à être rahman envers tous et rahim envers mes proches.",
    "Ya Ar-Rahman Ar-Rahim, par Ta miséricorde, ne me prive pas de Ton regard.",
  ],
  timerMinutes: 18,
  exercises: [
    {
      question:
        "Identifiez une personne envers laquelle vous avez du mal à être miséricordieux. Méditez sur la miséricorde universelle d'Ar-Rahman et écrivez ce que cette contemplation vous inspire.",
      placeholder:
        "Votre réflexion sur la miséricorde envers une personne difficile...",
    },
    {
      question:
        "Notez 5 signes de la miséricorde d'Ar-Rahman dans votre vie quotidienne (la pluie, la respiration, la santé, etc.) et 3 signes de la miséricorde d'Ar-Rahim dans votre vie spirituelle.",
      placeholder:
        "5 signes d'Ar-Rahman et 3 signes d'Ar-Rahim dans ma vie...",
    },
  ],
  callouts: [
    {
      type: "gold",
      title: "La clé du miroir",
      content:
        "Les deux miséricordes se reflètent en vous. Vous avez la capacité d'être « rahman » envers tous (compassion universelle) et « rahim » envers vos proches (tendresse spécifique). Quel équilibre trouvez-vous entre les deux ?",
    },
  ],
};

// ---- Chapter A4 — Maliki Yawm ad-Din ----

const a4: Chapter = {
  id: "a4",
  number: "A4",
  title: "Maliki Yawm ad-Din",
  subtitle: "Le Roi du Jour du Jugement",
  part: "A",
  arabicVerse: "مَالِكِ يَوْمِ الدِّينِ",
  translation: "Maître du Jour de la rétribution.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [
    {
      arabic: "مَالِكِ",
      transliteration: "Maliki",
      literalMeaning: "Le Maître / Le Roi / Le Possesseur",
      mirrorDimension:
        "Il possède toute chose absolument. Je ne possède rien en réalité — tout est un dépôt (amana).",
    },
    {
      arabic: "يَوْمِ",
      transliteration: "Yawm",
      literalMeaning: "Le Jour",
      mirrorDimension:
        "Un jour dont la durée est connue de Lui seul. « Yawm » peut signifier 50 000 ans (Sourate 70:4).",
    },
    {
      arabic: "الدِّينِ",
      transliteration: "Ad-Din",
      literalMeaning: "La rétribution / Le jugement / La religion",
      mirrorDimension:
        "Ce jour où chaque action sera pesée. « Din » vient d'une racine qui signifie « juger » et « suivre une voie ».",
    },
  ],
  mirrorQuestions: [],
  munajatPrompts: [
    "Ya Malik yawm ad-din, accorde-moi une fin de vie dans la foi et la certitude.",
    "Ya Allah, je me remets à Ton jugement — et je demande Ta miséricorde avant Ta justice.",
    "Ya Allah, rappelle-moi le Jour du Jugement quand je suis tenté par l'injustice.",
    "Ya Malik, fais que je traite Tes dépôts — ma santé, ma richesse, mes enfants — avec la conscience qu'ils T'appartiennent.",
  ],
  timerMinutes: 22,
  exercises: [
    {
      question:
        "Listez les « dépôts » (amana) qu'Allah vous a confiés (santé, richesse, talents, temps, relations). Pour chacun, écrivez comment vous pourriez mieux en être le gardien.",
      placeholder:
        "Mes dépôts et comment mieux les garder...",
    },
    {
      question:
        "Méditez sur la question : « Si le Jour du Jugement était demain, de quoi aurais-je honte ? De quoi serais-je fier ? » Soyez honnête avec vous-même.",
      placeholder:
        "Ma réflexion honnête sur le Jour du Jugement...",
    },
  ],
  callouts: [
    {
      type: "warning",
      title: "Justice et miséricorde",
      content:
        "La mention du Jour du Jugement vient juste après la miséricorde. Ce n'est pas une contradiction — c'est un équilibre. La miséricorde d'Allah ne signifie pas l'absence de justice. Et Sa justice ne signifie pas l'absence de miséricorde. Le croyant vit entre hope (raja') et fear (khawf).",
    },
  ],
};

// ---- Chapter A5 — Iyyaka Na'budu ----

const a5: Chapter = {
  id: "a5",
  number: "A5",
  title: "Iyyaka Na'budu",
  subtitle: "Toi seul nous adorons",
  part: "A",
  arabicVerse: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
  translation:
    "C'est Toi que nous adorons, et c'est Toi dont nous implorons le secours.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [], // A5 uses comparisonTable format ("Les Deux Moitiés du Verset")
  comparisonTable: {
    headers: ["Moitié", "Arabe", "Sens", "Dimension miroir"],
    rows: [
      [
        "1re moitié",
        "إِيَّاكَ نَعْبُدُ",
        "C'est Toi que nous adorons",
        "L'exclusivité de l'adoration — rien ne mérite mon adoration absolue sauf Allah",
      ],
      [
        "2e moitié",
        "وَإِيَّاكَ نَسْتَعِينُ",
        "C'est Toi dont nous cherchons l'aide",
        "L'exclusivité du secours — même pour accomplir l'adoration, j'ai besoin de Son aide",
      ],
    ],
  },
  mirrorQuestions: [],
  bulletPoints: [
    "Le « nous » (na'budu) : L'usage du pluriel nous connecte à la communauté (ummah). Même dans la prière individuelle, on se souvient qu'on ne marche pas seul.",
    "L'inversion grammaticale (iyyaka) : Normalement on dirait « na'buduka » (nous T'adorons). Mais le Coran place « iyyaka » avant le verbe pour souligner l'exclusivité — TOI, personne d'autre.",
    "L'adoration englobe tout : « Ibadah » ne se limite pas à la prière rituelle. Manger halal avec gratitude est ibadah. Être juste envers son voisin est ibadah. Chaque acte sincère est adoration.",
  ],
  munajatPrompts: [
    "Ya Allah, purifie mon adoration de toute riya (ostentation) — que je n'adore que pour Toi.",
    "Ya Allah, je suis incapable de T'adorer sans Ton aide — accorde-moi Ta tawfiq.",
    "Ya Mu'in, je cherche Ton secours dans ma prière, mon travail, mes relations, ma santé.",
    "Ya Allah, fais que chaque acte de ma journée soit une forme d'adoration sincère.",
  ],
  timerMinutes: 25,
  exercises: [
    {
      question:
        "Faites un audit de votre cœur : quels « associés » (shuraka') avez-vous placés à côté d'Allah ? (L'argent, l'opinion des autres, le confort, la carrière, etc.) Soyez courageusement honnête.",
      placeholder:
        "Mon audit honnête des associés dans mon cœur...",
    },
    {
      question:
        "Transformez une activité profane de votre journée en acte d'adoration en y apportant l'intention sincère. Décrivez l'expérience.",
      placeholder:
        "Mon expérience de transformation d'une activité en adoration...",
    },
  ],
  callouts: [
    {
      type: "info",
      title: "Le miroir profond",
      content:
        "Notez l'ordre — l'adoration vient avant le secours. On pourrait penser logiquement de demander d'abord l'aide, puis d'adorer. Mais le Coran enseigne que l'adoration elle-même est la plus grande aide. Quand vous adorez, vous recevez déjà le secours.",
    },
  ],
};

// ---- Chapter A6 — Ihdina as-Sirata ----

const a6: Chapter = {
  id: "a6",
  number: "A6",
  title: "Ihdina as-Sirata",
  subtitle: "Guide-nous",
  part: "A",
  arabicVerse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
  translation: "Guide-nous dans le chemin droit.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [
    {
      arabic: "اهْدِنَا",
      transliteration: "Ihdina",
      literalMeaning: "Guide-nous",
      mirrorDimension:
        "La guidée (hidaya) n'est pas un événement unique mais un processus continu. On la demande chaque jour, dans chaque prière.",
    },
    {
      arabic: "الصِّرَاطَ",
      transliteration: "As-Sirat",
      literalMeaning: "Le chemin / La voie",
      mirrorDimension:
        "Le mot « sirat » vient d'une racine qui signifie « avaler » — ce chemin est si étroit qu'il « avale » ceux qui le parcourent.",
    },
    {
      arabic: "الْمُسْتَقِيمَ",
      transliteration: "Al-Mustaqim",
      literalMeaning: "Le droit / Le rectiligne",
      mirrorDimension:
        "Sans déviation ni excès. L'islam est la voie du juste milieu entre les extrêmes.",
    },
  ],
  mirrorQuestions: [],
  munajatPrompts: [
    "Ya Allah, guide-moi à chaque instant — dans mes choix grands et petits.",
    "Ya Hadi, ne laisse pas mon cœur dévier après que Tu m'as guidé.",
    "Ya Allah, fais que je sois du nombre de ceux qui restent fermes sur le sirat mustaqim.",
    "Ya Allah, la guidée est entre Tes mains — je Te demande de ne jamais me priver de Ta lumière.",
  ],
  timerMinutes: 20,
  exercises: [
    {
      question:
        "Identifiez 3 « vents » de distraction dans votre vie qui vous éloignent du chemin droit. Pour chacun, proposez une stratégie concrète pour rester centré.",
      placeholder:
        "Mes 3 vents de distraction et stratégies pour rester centré...",
    },
    {
      question:
        "Méditez sur la différence entre la « guidée » (hidaya) et la « direction » (irshad). Laquelle ressentez-vous le plus besoin aujourd'hui ?",
      placeholder:
        "Ma réflexion sur hidaya vs irshad...",
    },
  ],
  callouts: [
    {
      type: "gold",
      title: "Application miroir",
      content:
        "Le chemin droit n'est pas une autoroute — c'est un fil tendu au-dessus d'un précipice. Chaque jour, le vent de la distraction, de la passion, de l'oubli essaie de vous déséquilibrer. La demande « ihdina » est la demande de celui qui sait qu'il peut tomber à tout moment.",
    },
  ],
};

// ---- Chapter A7 — Siratal Lazina ----

const a7: Chapter = {
  id: "a7",
  number: "A7",
  title: "Siratal Lazina",
  subtitle: "Le chemin des bienfaisants",
  part: "A",
  arabicVerse:
    "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
  translation:
    "Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [], // A7 uses comparisonTable ("Les Trois Groupes")
  comparisonTable: {
    headers: ["Groupe", "Arabe", "Caractéristique", "Analogie spirituelle"],
    rows: [
      [
        "Ceux qui sont comblés de faveurs",
        "أَنْعَمْتَ عَلَيْهِمْ",
        "Savent la vérité et la suivent",
        "Celui qui connaît le bon chemin et le parcourt avec constance",
      ],
      [
        "Ceux qui ont encouru la colère",
        "الْمَغْضُوبِ عَلَيْهِمْ",
        "Savent la vérité mais ne la suivent pas",
        "Celui qui connaît le bon chemin mais choisit de le quitter (action)",
      ],
      [
        "Les égarés",
        "الضَّالِّينَ",
        "Ne connaissent pas la vérité",
        "Celui qui cherche le bon chemin mais se perd (connaissance)",
      ],
    ],
  },
  mirrorQuestions: [],
  munajatPrompts: [
    "Ya Allah, fais-moi parmi ceux que Tu as comblés de Tes faveurs — la foi, la sagesse, la patience.",
    "Ya Allah, protège-moi de la colère qui vient de la connaissance sans pratique.",
    "Ya Allah, protège-moi de l'égarement qui vient de l'ignorance — illumine mon cœur.",
    "Ya Allah, je cherche refuge auprès de Toi contre d'être de ceux qui savent mais n'agissent pas.",
  ],
  timerMinutes: 25,
  exercises: [
    {
      question:
        "Relisez les 7 chapitres de la Partie A. Quel verset de la Fatiha a le plus touché votre cœur ? Pourquoi ?",
      placeholder:
        "Le verset qui a le plus touché mon cœur et pourquoi...",
    },
    {
      question:
        "Si vous deviez résumer la Fatiha en une seule phrase pour votre propre vie, ce serait quoi ?",
      placeholder:
        "Ma résumé personnel de la Fatiha en une phrase...",
    },
    {
      question:
        "Quel changement concret souhaitez-vous faire dans votre vie suite à cette méditation de la Fatiha ?",
      placeholder:
        "Le changement concret que je souhaite faire...",
    },
  ],
  callouts: [
    {
      type: "gold",
      title: "Le miroir ultime",
      content:
        "Chaque jour de votre vie, vous vous situez entre ces trois groupes. La prière n'est pas une simple récitation — c'est un positionnement conscient : « Je choisis d'être parmi ceux qui sont comblés de Tes faveurs. »",
    },
  ],
  quotes: [
    {
      text: "La Fatiha est la plus noble des sourates. Personne ne l'a révélée dans la Torah, ni dans l'Évangile, ni dans le Psautier, et elle m'a été spécifiquement accordée.",
      source: "Rapporté par Al-Bukhari",
    },
  ],
};

// ---------------------------------------------------------------------------
// Part B — Trésors du Coran
// ---------------------------------------------------------------------------

const partBDescription =
  "Au-delà de la Fatiha, le Coran regorge de versets d'une profondeur insondable. Dans cette partie, nous explorons dix trésors du Coran — des versets qui, médités avec le cœur, transforment la vision que l'on a de soi-même et du monde.";

// ---- Chapter B1 — Ayat al-Kursi ----

const b1: Chapter = {
  id: "b1",
  number: "B1",
  title: "Ayat al-Kursi",
  subtitle: "Le Verset du Trône",
  part: "B",
  arabicVerse:
    "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  translation:
    "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. A Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur. Et de Sa science, ils n'embrassent que ce qu'Il veut. Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Et Il est le Très Haut, le Très Grand.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [],
  treasuresList: [
    "L'unicité absolue : « La ilaha illa huwa » — il n'y a de divinité que Lui. C'est la déclaration la plus forte de l'unicité divine dans le Coran.",
    "La vie éternelle : « Al-Hayy » — Il est le Vivant, la Source de toute vie. Tout être vivant tire sa vie de Lui.",
    "L'indépendance absolue : « Al-Qayyum » — Celui qui subsiste par Lui-même. Tout le reste a besoin de Lui ; Lui n'a besoin de rien.",
    "L'absence de faiblesse : Ni somnolence ni sommeil — même la moindre fatigue ne Le touche pas. Sa vigilance est parfaite.",
    "L'omnipossession : « Lahu ma fis-samawati wa ma fil-ard » — tout Lui appartient. Rien n'échappe à Sa possession.",
    "L'intercession contrôlée : Personne n'intercède sans Sa permission. Même les prophètes les plus éminents ont besoin de Son autorisation.",
    "La connaissance parfaite : Il connaît le passé et le futur de toute la création. Rien n'est caché à Son regard.",
    "La volonté souveraine : Les créatures ne connaissent de Sa science que ce qu'Il veut bien leur révéler.",
    "L'immensité du Trône : Le Kursi (piédestal du Trône) déborde les cieux et la terre. Et le Trône (Arsh) est encore plus immense que le Kursi.",
    "L'absence d'effort : Garder l'univers entier ne Lui coûte aucune peine. Il est Al-'Aliyy (le Très Haut) et Al-'Azim (le Très Grand).",
  ],
  mirrorQuestions: [
    {
      question:
        "L'unicité — Y a-t-il quelque chose dans ma vie que je traite comme une divinité secondaire ?",
      meditation: "Examinez vos attachements et priorités.",
    },
    {
      question:
        "La vie éternelle — Suis-je reconnaissant pour la vie qu'Allah me donne à chaque instant ?",
      meditation: "Ressentez la gratitude pour le simple fait d'être en vie.",
    },
    {
      question:
        "L'indépendance — De qui ou de quoi est-ce que je dépends excessivement ?",
      meditation: "Identifiez vos dépendances autres qu'Allah.",
    },
    {
      question:
        "L'absence de faiblesse — Est-ce que je me repose sur Allah qui ne dort jamais, ou sur des moyens qui peuvent faillir ?",
      meditation: "Réfléchissez à votre véritable source de sécurité.",
    },
  ],
  munajatPrompts: [],
  timerMinutes: 30,
  exercises: [],
};

// ---- Chapter B2 — Ayat an-Nur ----

const b2: Chapter = {
  id: "b2",
  number: "B2",
  title: "Ayat an-Nur",
  subtitle: "Le Verset de la Lumière",
  part: "B",
  arabicVerse:
    "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُّورٌ عَلَىٰ نُورٍ يَهْدِي اللَّهُ لِنُورِهِ مَن يَشَاءُ ۚ وَيَضْرِبُ اللَّهُ الْأَمْثَالَ لِلنَّاسِ ۗ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ",
  translation:
    "Allah est la Lumière des cieux et de la terre. Sa lumière est comme une niche dans laquelle se trouve une lampe. La lampe est dans un verre. Le verre est comme un astre brillant. Elle est allumée à partir d'un arbre béni, un olivier ni oriental ni occidental. Son huile serait presque lumineuse même sans que le feu ne la touche. Lumière sur lumière. Allah guide vers Sa lumière qui Il veut. Allah frappe des paraboles pour les gens. Et Allah est Omniscient.",
  translationSource: "Traduction Hamidullah",
  wordAnalysis: [],
  metaphorTable: [
    {
      element: "La niche (mishkat)",
      metaphor: "Le cœur du croyant",
      interpretation:
        "Un espace profond et protégé où la lumière divine peut résider",
    },
    {
      element: "La lampe (misbah)",
      metaphor: "La foi (iman)",
      interpretation:
        "La source de lumière intérieure qui éclaire depuis le cœur",
    },
    {
      element: "Le verre (zujajah)",
      metaphor: "La connaissance (ilm)",
      interpretation:
        "Le savoir qui protège et amplifie la lumière de la foi",
    },
    {
      element: "L'olivier béni",
      metaphor: "La révélation (wahy)",
      interpretation:
        "L'arbre qui produit l'huile — la source pure de la guidée",
    },
    {
      element: "L'huile presque lumineuse",
      metaphor: "La fitrah (nature innée)",
      interpretation:
        "La nature humaine originelle qui est déjà orientée vers la lumière",
    },
    {
      element: "Lumière sur lumière",
      metaphor: "L'interaction entre les couches",
      interpretation:
        "La révélation éclaire la fitrah, qui éclaire le cœur, qui éclaire le monde",
    },
  ],
  mirrorQuestions: [],
  munajatPrompts: [],
  timerMinutes: 28,
  exercises: [],
  callouts: [
    {
      type: "gold",
      title: "Application miroir",
      content:
        "Chaque couche de cette métaphore existe en vous. Vous avez un cœur (la niche), de la foi (la lampe), du savoir (le verre), et une nature innée (l'huile). La question est : votre lumière est-elle protégée, entretenue, et partagée ?",
    },
  ],
};

// ---- Chapter B3-B10 (grouped) ----

const b3to10: Chapter = {
  id: "b3-b10",
  number: "B3-B10",
  title: "Huit trésors supplémentaires du Coran",
  subtitle: "B3 à B10",
  part: "B",
  arabicVerse: "",
  translation: "",
  translationSource: "",
  wordAnalysis: [],
  mirrorQuestions: [],
  munajatPrompts: [],
  timerMinutes: 60,
  exercises: [],
  extraSections: [
    {
      id: "b3",
      title: "Allah ne surcharge personne",
      arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation:
        "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
      commentary:
        "Ce verset est une promesse divine de miséricorde. Chaque épreuve que vous affrontez est mesurée selon votre capacité — pas celle de quelqu'un d'autre. Quand vous vous sentez dépassé, rappelez-vous : si Allah vous l'a envoyé, vous pouvez le porter.",
    },
    {
      id: "b4",
      title: "Ne vous laissez pas abattre",
      arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
      translation:
        "Ne vous laissez pas abattre, ne vous affligez pas alors que vous êtes les supérieurs, si vous êtes de vrais croyants.",
      commentary:
        "La supériorité dont parle ce verset n'est pas matérielle — elle est spirituelle. Le croyant est « supérieur » non par sa force, mais par sa connexion à Allah. Même dans la défaite apparente, la foi est une victoire.",
    },
    {
      id: "b5",
      title: "La souveraineté divine",
      arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ",
      translation:
        "Dis : Ô Allah, Maître de la souveraineté, Tu accordes la souveraineté à qui Tu veux et Tu la retires de qui Tu veux.",
      commentary:
        "Ce verset est une leçon d'humilité radicale. Tout pouvoir, toute richesse, toute influence vient de Lui et revient à Lui. Seule la bonne action (hasanah) demeure.",
    },
    {
      id: "b6",
      title: "Les cœurs trouvent la paix",
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      translation:
        "C'est par le rappel d'Allah que les cœurs trouvent la paix.",
      commentary:
        "La paix intérieure ne vient pas de l'absence de problèmes, mais de la présence du dhikr. Le cœur humain est agité par nature — seul le souvenir de Dieu peut le stabiliser.",
    },
    {
      id: "b7",
      title: "Chaque chose a son livre",
      arabic: "وَكُلَّ إِنسَانٍ أَلْزَمْنَاهُ طَائِرَهُ فِي عُنُقِهِ ۖ وَنُخْرِجُ لَهُ يَوْمَ الْقِيَامَةِ كِتَابًا يَلْقَاهُ مَنشُورًا",
      translation:
        "Et à chaque homme Nous avons attaché son oeuvre à son cou. Et au Jour de la Résurrection, Nous lui ferons sortir un livre qu'il trouvera ouvert.",
      commentary:
        "Chaque action est enregistrée et vous sera présentée. L'image du livre ouvert au Jour du Jugement est un rappel que rien n'est oublié — ni les bonnes ni les mauvaises actions.",
    },
    {
      id: "b8",
      title: "Ô mon Seigneur, ouvre-moi ma poitrine",
      arabic: "قَالَ رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
      translation:
        "Il dit : Ô mon Seigneur, ouvre-moi ma poitrine, et facilite ma mission, et dénoue un nœud en ma langue, afin qu'ils comprennent mes paroles.",
      commentary:
        "La prière de Moïse avant sa mission est un modèle pour tout croyant face à une tâche difficile : demander l'ouverture du cœur, la facilité, et la clarté de communication.",
    },
    {
      id: "b9",
      title: "Les plus beaux noms",
      arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
      translation:
        "C'est Lui Allah. Nulle divinité autre que Lui, Le Connaisseur de l'Invisible et du Visible. C'est Lui, le Tout Miséricordieux, le Très Miséricordieux.",
      commentary:
        "Les plus beaux noms d'Allah (Asma' ul-Husna) sont une porte vers la connaissance de Dieu. Méditer sur chaque nom est une forme de dhikr qui transforme le cœur.",
    },
    {
      id: "b10",
      title: "Al-Ikhlas : La pureté",
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
      translation:
        "Dis : Il est Allah, l'Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
      commentary:
        "Le tiers du Coran en quatre versets. Al-Ikhlas est la sourate de la pureté absolue — elle nettoie le cœur de toute association (shirk), même la plus subtile. Méditer sur ces quatre versets, c'est se purifier de l'intérieur.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Part C — Les Sept Niveaux de Lecture
// ---------------------------------------------------------------------------

const partCDescription =
  "Le Coran n'est pas un livre qu'on lit — c'est un livre qu'on vit. Les savants ont identifié sept niveaux de lecture qui mènent du déchiffrement des lettres à la transformation de l'être. Cette partie vous présente la théorie et vous guide dans l'application pratique de chaque niveau.";

const c1: Chapter = {
  id: "c1",
  number: "C1",
  title: "Les Sept Niveaux de Lecture",
  subtitle: "Théorie et Application",
  part: "C",
  arabicVerse:
    "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
  translation:
    "Dis : Il est Allah, l'Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
  translationSource: "Sourate 112 — Al-Ikhlas",
  wordAnalysis: [],
  mirrorQuestions: [],
  munajatPrompts: [],
  timerMinutes: 90,
  exercises: [
    {
      question:
        "Niveau 1 (Tilawa) : Qu'avez-vous remarqué en récitant lentement ?",
      placeholder:
        "Votre expérience de récitation lente...",
    },
    {
      question:
        "Niveau 2 (Tarjamah) : Quels mots avez-vous mieux compris ?",
      placeholder:
        "Les mots que vous avez mieux compris...",
    },
    {
      question:
        "Niveau 3 (Tadabbur) : Quelles questions le verset soulève-t-il ?",
      placeholder:
        "Les questions soulevées par le verset...",
    },
    {
      question:
        "Niveau 4 (Tafakkur) : Quelle est l'implication spirituelle ?",
      placeholder:
        "L'implication spirituelle que vous percevez...",
    },
    {
      question:
        "Niveau 5 (Tazakkur) : De quoi ce verset vous rappelle-t-il ?",
      placeholder:
        "Ce dont le verset vous rappelle...",
    },
    {
      question:
        "Niveau 6 (Tahqiq) : Êtes-vous en accord avec ce verset dans votre vie ?",
      placeholder:
        "Votre vérification honnête...",
    },
    {
      question:
        "Niveau 7 (Tajalli) : Avez-vous ressenti quelque chose de spécial ?",
      placeholder:
        "Votre expérience spirituelle, si applicable...",
    },
  ],
  comparisonTable: {
    headers: ["Niveau", "Nom", "Description", "Exemple pratique"],
    rows: [
      [
        "1",
        "Tilawa (Récitation)",
        "Lire les lettres et les mots correctement",
        "Réciter la Fatiha avec tajwid",
      ],
      [
        "2",
        "Tarjamah (Compréhension)",
        "Comprendre le sens littéral du texte",
        "Savoir que « al-hamd » signifie « la louange »",
      ],
      [
        "3",
        "Tadabbur (Réflexion)",
        "Réfléchir profondément sur le sens des versets",
        "Pourquoi « al-hamd » et non « ash-shukr » ?",
      ],
      [
        "4",
        "Tafakkur (Contemplation)",
        "Méditer sur les implications spirituelles",
        "Comment ce verset transforme ma vision du monde ?",
      ],
      [
        "5",
        "Tazakkur (Rappel)",
        "Se rappeler des vérités spirituelles à travers le texte",
        "Ce verset me rappelle que toute chose appartient à Allah",
      ],
      [
        "6",
        "Tahqiq (Vérification)",
        "Vérifier si le verset est réalisé dans sa propre vie",
        "Est-ce que je vis vraiment « iyyaka na'budu » ?",
      ],
      [
        "7",
        "Tajalli (Révélation spirituelle)",
        "Expérimenter la lumière divine à travers le verset",
        "Une illumination intérieure lors de la méditation",
      ],
    ],
  },
  extraSections: [
    // Application pratique — Les Sept Niveaux sur Al-Ikhlas
    {
      id: "c1-level1",
      title: "Niveau 1 — Tilawa (Récitation)",
      arabic: "",
      translation: "",
      commentary:
        "Pratiquez la récitation d'Al-Ikhlas en vous concentrant sur chaque lettre. La lettre « Ha » dans « Huwa » doit être prononcée avec douceur depuis la poitrine. Le « Sad » dans « As-Samad » doit être plein et articulé. Prenez 5 minutes pour réciter lentement, chaque mot étant une perle.",
    },
    {
      id: "c1-level2",
      title: "Niveau 2 — Tarjamah (Compréhension)",
      arabic: "",
      translation: "",
      commentary:
        "Comprenez le sens de chaque mot. « Huwa » (Lui) est un pronom qui pointe vers l'essence divine sans la nommer — une indication de Sa transcendance. « Ahad » (l'Unique) est un degré supérieur à « Wahid » (un) : Il est Unique en Son essence, Ses attributs et Ses actes. « As-Samad » est Celui vers qui toute la création se tourne dans le besoin.",
    },
    {
      id: "c1-level3",
      title: "Niveau 3 — Tadabbur (Réflexion)",
      arabic: "",
      translation: "",
      commentary:
        "Réfléchissez : pourquoi ce verset commence par « Dis » (Qul) ? Parce que la pureté de la foi ne se proclame pas seulement dans le cœur — elle se prononce. Pourquoi « Ahad » et non « Wahid » ? Parce que l'unicité absolue exclut toute forme de comparaison. « Wahid » pourrait impliquer l'existence d'un « deux » ; « Ahad » nie toute multiplicité.",
    },
    {
      id: "c1-level4",
      title: "Niveau 4 — Tafakkur (Contemplation)",
      arabic: "",
      translation: "",
      commentary:
        "Contemplez : si Allah est vraiment « Ahad » et « As-Samad », qu'est-ce que cela change dans ma relation avec le monde ? Si rien ne Lui est comparable, alors rien dans la création ne peut remplacer la connexion avec Lui. L'argent, les gens, le statut — tout est relatif face à L'Unique.",
    },
    {
      id: "c1-level5",
      title: "Niveau 5 — Tazakkur (Rappel)",
      arabic: "",
      translation: "",
      commentary:
        "Ce verset me rappelle que mon cœur a été créé pour se tourner vers l'Unique. Chaque fois que je me disperse entre de multiples attachements, Al-Ikhlas me rappelle de revenir à l'essentiel. C'est le verset du retour.",
    },
    {
      id: "c1-level6",
      title: "Niveau 6 — Tahqiq (Vérification)",
      arabic: "",
      translation: "",
      commentary:
        "Suis-je sincère dans mon unicité d'adoration ? Est-ce que je dis « la ilaha illa Allah » mais que mon cœur est divisé entre Allah et autre chose ? L'honnêteté au niveau 6 demande de regarder ses faiblesses en face — non pour se condamner, mais pour s'améliorer.",
    },
    {
      id: "c1-level7",
      title: "Niveau 7 — Tajalli (Révélation spirituelle)",
      arabic: "",
      translation: "",
      commentary:
        "C'est le niveau de l'expérience directe. Le tajalli peut se manifester comme une paix soudaine du cœur, des larmes involontaires, une clarté intérieure. Il ne se commande pas — il est donné par Allah à qui Il veut. Mais on le prépare par les six niveaux précédents.",
    },
  ],
  bulletPoints: [
    "Commencez par le niveau 1 : Assurez-vous de pouvoir réciter correctement. La base phonétique est essentielle. Un verset mal lu ne peut pas être profondément médité.",
    "Ne sautez pas le niveau 2 : La compréhension littérale est le socle. Vous ne pouvez pas réfléchir sur ce que vous ne comprenez pas.",
    "Patience aux niveaux 3-4 : C'est ici que la vraie méditation commence. Prenez votre temps. Un seul verset médité vaut mieux que cent versets survolés.",
    "L'honnêteté au niveau 6 : Le tahqiq demande du courage. Il faut accepter de voir les écarts entre nos idéalités et notre réalité.",
    "Le niveau 7 est un don : Le tajalli ne s'obtient pas par l'effort seul — c'est une grâce (fadl) d'Allah. Mais on prépare le terrain par les six premiers niveaux.",
  ],
  callouts: [
    {
      type: "gold",
      title: "Le miroir des sept niveaux",
      content:
        "Les niveaux sont comme les étages d'une maison. On ne peut pas atteindre le toit sans monter les escaliers. Mais chaque étage a sa propre beauté — ne cherchez pas le toit en négligeant le rez-de-chaussée.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Appendices
// ---------------------------------------------------------------------------

const appendices = {
  glossary: [
    {
      term: "Tadabbur",
      definition:
        "Méditation profonde et réflexion sur le Coran — aller au-delà de la surface du texte",
    },
    {
      term: "Tafakkur",
      definition:
        "Contemplation spirituelle — méditer sur les implications des versets dans sa propre vie",
    },
    {
      term: "Tajalli",
      definition:
        "Révélation spirituelle — l'illumination intérieure que Dieu accorde au croyant",
    },
    {
      term: "Munajat",
      definition:
        "Conversation intime avec Dieu — le dialogue secret du cœur avec son Créateur",
    },
    {
      term: "As-Sirr",
      definition:
        "Le secret du cœur — la dimension la plus intime de la conscience spirituelle",
    },
    {
      term: "Kursi",
      definition:
        "Le Piédestal — intermédiaire entre le Trône (Arsh) et la terre, siège des pieds divins",
    },
    {
      term: "Shukr",
      definition:
        "Gratitude active — utiliser les bienfaits de Dieu de la manière qu'Il agrée",
    },
    {
      term: "Tawakkul",
      definition:
        "Confiance en Dieu — s'en remettre à Allah après avoir pris les moyens nécessaires",
    },
    {
      term: "Qabdh / Bast",
      definition:
        "Contraction et expansion — les états alternés du cœur entre sécheresse et ouverture spirituelle",
    },
    {
      term: "Nur",
      definition:
        "Lumière divine — à la fois lumière de la guidance et lumière de la foi dans le cœur",
    },
    {
      term: "Fitrah",
      definition:
        "Nature innée — la disposition naturelle de l'être humain vers la reconnaissance de Dieu",
    },
    {
      term: "Ibadah",
      definition:
        "Adoration — tout acte accompli avec l'intention sincère de se rapprocher de Dieu",
    },
    {
      term: "Dhikr",
      definition:
        "Rappel — l'évocation de Dieu par le cœur, la langue ou l'action",
    },
    {
      term: "Riya",
      definition:
        "Ostentation — accomplir un acte de culte pour être vu des autres plutôt que pour Dieu",
    },
  ],
  journalTemplate: [
    "Date :",
    "Niveaux pratiqués aujourd'hui : Niveau 1 (Tilawa) □ Niveau 2 (Tarjamah) □ Niveau 3 (Tadabbur) □ Niveau 4 (Tafakkur) □ Niveau 5 (Tazakkur) □ Niveau 6 (Tahqiq) □ Niveau 7 (Tajalli) □",
    "Verset médité :",
    "Insight principal :",
    "Munajat du jour :",
    "Intention pour demain :",
  ],
  resources: [
    {
      title: "Ihya' Ulum ad-Din (La Revivification des Sciences de la Religion)",
      author: "Abu Hamid Al-Ghazali",
      description:
        "L'ouvrage majeur d'Al-Ghazali, en particulier le livre sur les secrets de la prière et du Coran.",
    },
    {
      title: "Madarij as-Salikin (Les Stations des Itinérants)",
      author: "Ibn al-Qayyim al-Jawziyya",
      description:
        "Un guide détaillé des stations spirituelles, avec de profondes réflexions sur le tadabbur.",
    },
    {
      title: "Al-Futuhat al-Makkiyya (Les Illuminations de La Mecque)",
      author: "Ibn Arabi",
      description:
        "L'œuvre monumentale du Shaykh al-Akbar, explorant les dimensions spirituelles du Coran.",
    },
    {
      title: "Tafsir al-Qur'an al-'Azim",
      author: "Ibn Kathir",
      description:
        "Un tafsir classique fondé sur la tradition prophétique, essentiel pour la compréhension littérale.",
    },
    {
      title: "At-Tahbir fi Tafsir al-Qur'an",
      author: "Al-Hakim at-Tirmidhi",
      description:
        "Un tafsir spirituel qui explore les dimensions intérieures du Coran, lié à la tradition du tadabbur.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Assemble Site Content
// ---------------------------------------------------------------------------

export const siteContent: SiteContent = {
  intro,
  parts: [
    {
      id: "part-a",
      letter: "A",
      title: "Al-Fatiha : Verset par Verset",
      description: partADescription,
      chapters: [a1, a2, a3, a4, a5, a6, a7],
    },
    {
      id: "part-b",
      letter: "B",
      title: "Trésors du Coran",
      description: partBDescription,
      chapters: [b1, b2, b3to10],
    },
    {
      id: "part-c",
      letter: "C",
      title: "Les Sept Niveaux de Lecture",
      description: partCDescription,
      chapters: [c1],
    },
  ],
  appendices,
};

// ---------------------------------------------------------------------------
// Flat array of all chapters for easy iteration
// ---------------------------------------------------------------------------

export const allChapters: Chapter[] = [
  a1, a2, a3, a4, a5, a6, a7,
  b1, b2, b3to10,
  c1,
];

// ---------------------------------------------------------------------------
// Helper: Get chapter by ID
// ---------------------------------------------------------------------------

export function getChapterById(id: string): Chapter | undefined {
  return allChapters.find((ch) => ch.id === id);
}

// ---------------------------------------------------------------------------
// Helper: Table of Contents
// ---------------------------------------------------------------------------

export interface TocEntry {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  part: string;
}

export interface TocPart {
  id: string;
  letter: string;
  title: string;
  entries: TocEntry[];
}

export interface TableOfContents {
  intro: {
    title: string;
  };
  parts: TocPart[];
  appendices: {
    title: string;
    entries: Array<{ id: string; title: string }>;
  };
}

export function getTableOfContents(): TableOfContents {
  return {
    intro: {
      title: "Introduction",
    },
    parts: siteContent.parts.map((part) => ({
      id: part.id,
      letter: part.letter,
      title: part.title,
      entries: part.chapters.map((ch) => ({
        id: ch.id,
        number: ch.number,
        title: ch.title,
        subtitle: ch.subtitle,
        part: part.letter,
      })),
    })),
    appendices: {
      title: "Annexes",
      entries: [
        { id: "glossary", title: "Glossaire Avancé" },
        { id: "journal", title: "Modèle de Journal Niveau 2" },
        { id: "resources", title: "Ressources Recommandées" },
      ],
    },
  };
}
