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
      chapters: "C1 à C7",
      duration: "~2h30",
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
  munajatPrompts: [
    "Ya Allah, Tu es Al-Hayy Al-Qayyum — fais que ma confiance en Toi remplace ma dépendance envers les créatures.",
    "Ya Allah, ni somnolence ni sommeil ne Te saisissent — veille sur mon cœur quand moi je m'endors.",
    "Ya 'Aliyy Ya 'Azim, Ton Trône déborde les cieux et la terre — comment pourrais-je douter de Ta puissance dans ma vie ?",
    "Ya Allah, Ta connaissance embrasse mon passé et mon futur — remets-moi entre Tes mains, car Tu sais ce que j'ignore.",
  ],
  timerMinutes: 30,
  exercises: [
    {
      question:
        "Prenez chaque trésor de la liste (les 10 points) et méditez-le pendant 2 minutes. Notez pour chacun : quelle émotion ou pensée surgit ? Quel lien avec votre vie ?",
      placeholder:
        "Mes réflexions sur chaque trésor d'Ayat al-Kursi...",
    },
    {
      question:
        "Écrivez une prière personnelle (munajat) en utilisant les noms Al-Hayy (Le Vivant) et Al-Qayyum (Le Subsistant). Exprimez votre confiance et votre abandon à Sa souveraineté.",
      placeholder:
        "Ma prière de confiance en Al-Hayy Al-Qayyum...",
    },
    {
      question:
        "Pendant 24 heures, chaque fois que vous ressentez de l'anxiété ou de l'insécurité, récitez intérieurement « Al-Hayyu Al-Qayyum ». Notez les moments où ce dhikr a apaisé votre cœur.",
      placeholder:
        "Mon journal de dhikr Al-Hayy Al-Qayyum sur 24h...",
    },
  ],
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
  mirrorQuestions: [
    {
      question:
        "Quelle est la lumière dans mon cœur ? Est-elle vive, vacillante ou éteinte ?",
      meditation:
        "Examinez l'état de votre foi comme on examine la flamme d'une lampe — qu'est-ce qui la nourrit, qu'est-ce qui l'éteint ?",
    },
    {
      question:
        "Protège-je la niche de mon cœur des vents de la distraction ?",
      meditation:
        "La niche (mishkat) est un espace protégé. Quelles distractions laissent entrer le vent et menacent votre lumière intérieure ?",
    },
    {
      question:
        "Comment la fitrah — ma nature innée — se manifeste-t-elle dans ma vie quotidienne ?",
      meditation:
        "L'huile presque lumineuse sans feu : votre nature est déjà orientée vers Dieu. Comment l'écoutez-vous ou l'étouffez-vous ?",
    },
    {
      question:
        "Ma contemplation du Coran change-t-elle concrètement mon comportement ?",
      meditation:
        "Lumière sur lumière : la révélation éclaire la fitrah qui éclaire le cœur qui éclaire le monde. Votre contemplation produit-elle de la lumière visible ?",
    },
  ],
  munajatPrompts: [
    "Ya Nur, illumine les recoins obscurs de mon cœur que je refuse de voir.",
    "Ya Allah, fais que mon cœur soit une niche digne de Ta lumière — protège-la des vents de la distraction.",
    "Ya Allah, ravive ma fitrah, cette huile presque lumineuse que Tu as placée en moi — fais que Ton feu la touche.",
    "Ya Allah, accorde-moi la lumière sur la lumière — que Ta révélation éclaire ma nature, que ma nature éclaire mes actes.",
  ],
  timerMinutes: 28,
  exercises: [
    {
      question:
        "Dessinez ou décrivez la niche de votre cœur : qu'y a-t-il à l'intérieur ? La lampe est-elle allumée ? Le verre est-il propre ou voilé ? L'huile est-elle abondante ou rare ? Soyez honnête et symbolique.",
      placeholder:
        "Description de la niche de mon cœur...",
    },
    {
      question:
        "Pendant 24 heures, pratiquez le tafakkur (contemplation) : à chaque moment de la journée, demandez-vous « Où est la lumière d'Allah dans cette situation ? ». Notez vos observations.",
      placeholder:
        "Mon journal de tafakkur sur 24h...",
    },
    {
      question:
        "Choisissez une métaphore du verset (niche, lampe, verre, olivier, huile) et appliquez-la concrètement à votre vie. Par exemple : « Comment puis-je devenir un olivier béni pour les autres ? »",
      placeholder:
        "Application concrète d'une métaphore d'Ayat an-Nur...",
    },
  ],
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
  "Le Coran n'est pas un livre qu'on lit — c'est un livre qu'on vit. Les savants ont identifié sept niveaux de lecture qui mènent du déchiffrement des lettres à la transformation de l'être. Chacun de ces sept chapitres explore un niveau en profondeur, avec un verset-ancrage, une analyse linguistique, des questions miroir et des exercices pratiques. La progression est essentielle : chaque niveau prépare le suivant.";

// ---- Chapter C1 — Tilawa (Récitation) ----

const c1: Chapter = {
  id: "c1",
  number: "C1",
  title: "Tilawa",
  subtitle: "Récitation — La lettre comme lumière",
  part: "C",
  arabicVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  translation:
    "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers.",
  translationSource: "Traduction Hamidullah — Sourate 1, versets 1-2",
  wordAnalysis: [
    {
      arabic: "تِلَاوَةٌ",
      transliteration: "Tilawa",
      literalMeaning: "Récitation / Lecture suivie",
      mirrorDimension:
        "La tilawa n'est pas une simple lecture — c'est un acte de suivi, comme on suit les pas d'un guide. Je suis les lettres du Coran comme on suit un chemin.",
    },
    {
      arabic: "بِسْمِ",
      transliteration: "Bismi",
      literalMeaning: "Avec le nom",
      mirrorDimension:
        "Chaque lettre que je prononce commence par un acte d'association avec le Divin. Ma langue est l'instrument, mais le nom est la mélodie.",
    },
    {
      arabic: "الرَّحْمَٰنِ",
      transliteration: "Ar-Rahman",
      literalMeaning: "Le Tout Miséricordieux",
      mirrorDimension:
        "La miséricorde qui enveloppe la récitation — chaque lettre récitée est enveloppée de la miséricorde divine.",
    },
    {
      arabic: "الْحَمْدُ",
      transliteration: "Al-Hamd",
      literalMeaning: "La louange",
      mirrorDimension:
        "La récitation commence par la louange — le souffle du récitant est lui-même un acte de gratitude envers Celui qui a donné la parole.",
    },
    {
      arabic: "رَبِّ",
      transliteration: "Rabb",
      literalMeaning: "Seigneur / Éducateur",
      mirrorDimension:
        "Le Rabb est Celui qui éduque par étapes — la récitation est la première étape de cette éducation spirituelle.",
    },
  ],
  coherencePoints: [
    "La tilawa est le socle de tout : sans récitation correcte, il n'y a pas de compréhension possible. La lettre est le véhicule de la lumière.",
    "Le tajwid n'est pas un ornement — c'est une obligation spirituelle. Chaque règle de prononciation préserve le sens. Un « dhad » confondu avec un « dad » peut inverser le sens d'un verset.",
    "La Fatiha comme verset-ancrage : c'est la sourate que chaque musulman récite au moins 17 fois par jour. La méditer au niveau de la tilawa, c'est redécouvrir ce qu'on croit connaître.",
  ],
  mirrorQuestions: [
    {
      question:
        "Quand je récite le Coran, suis-je conscient de chaque lettre, ou ma langue court-elle par habitude ?",
      meditation:
        "Ralentissez. Prenez une seule page et récitez-la comme si c'était la première fois. Que remarquez-vous ?",
    },
    {
      question:
        "Est-ce que je corrige ma récitation quand je commets une erreur, ou je continue comme si de rien n'était ?",
      meditation:
        "La correction (islah) de la récitation est un acte d'humilité. Revenir en arrière pour corriger une lettre, c'est reconnaître que la Parole mérite mieux que notre négligence.",
    },
    {
      question:
        "Quel lien ressens-je entre la beauté sonore de la récitation et l'état de mon cœur ?",
      meditation:
        "Le Prophète ﷺ disait : « Embellissez le Coran par vos voix. » La beauté n'est pas un luxe — c'est une nécessité spirituelle.",
    },
    {
      question:
        "Ai-je déjà pleuré en récitant le Coran ? Si non, pourquoi ?",
      meditation:
        "Les larmes du récitant ne sont pas de la tristesse — elles sont le signe que le cœur a été touché par la lumière des lettres.",
    },
  ],
  munajatPrompts: [
    "Ya Allah, fais que chaque lettre que je récite soit une lumière qui entre dans mon cœur.",
    "Ya Rabb, enseigne-moi la récitation correcte de Ton Livre — pas pour que les gens m'admirent, mais pour que Ta Parole soit honorée sur ma langue.",
    "Ya Rahman, ouvre mes oreilles à la beauté de Ta récitation, et fais que j'entende au-delà des sons.",
    "Ya Allah, transforme ma récitation mécanique en récitation vivante — que chaque souffle soit une prière.",
  ],
  timerMinutes: 20,
  exercises: [
    {
      question:
        "Prenez les deux premiers versets d'Al-Fatiha et récitez-les 7 fois lentement, en prêtant attention à chaque lettre, chaque voyelle, chaque prolongation. Notez ce que vous ressentez à la 7e répétition par rapport à la 1re.",
      placeholder:
        "Votre expérience de récitation lente et consciente des 7 répétitions...",
    },
    {
      question:
        "Enregistrez votre récitation d'Al-Fatiha, puis écoutez-la. Identifiez 3 points d'amélioration dans votre tajwid. Comment cette écoute vous fait-elle réaliser l'importance de la précision ?",
      placeholder:
        "Mes 3 points d'amélioration et ma réflexion sur la précision...",
    },
    {
      question:
        "Choisissez une règle de tajwid que vous négligez souvent (par exemple, la prolongation des mudud ou l'assimilation) et pratiquez-la consciemment pendant une semaine. Décrivez le changement dans votre récitation.",
      placeholder:
        "La règle de tajwid que j'ai pratiquée et le changement ressenti...",
    },
  ],
  bulletPoints: [
    "La tilawa est un acte d'adoration ('ibadah) : Réciter le Coran est en soi une adoration, même sans comprendre le sens. La résonance des lettres arabes porte une baraka que la traduction ne peut transmettre.",
    "Le tajwid protège le sens : Chaque règle de tajwid existe pour préserver le sens révélé. La confusion entre lettres proches (dal/dhad, sin/sad) peut altérer le message divin.",
    "La lenteur est la clé : Le Coran a été révélé sur 23 ans. Vouloir le lire en vitesse, c'est manquer l'essentiel. La tilawa méditative (tartil) est le mode de récitation le plus méritoire.",
    "La voix embellit : « Zayyinu al-Qur'an bi aswatikum » — le Prophète ﷺ nous encourage à embellir le Coran par nos voix. La beauté n'est pas superficielle — elle révèle la beauté du contenu.",
  ],
  callouts: [
    {
      type: "gold",
      title: "La lettre comme acte spirituel",
      content:
        "Ibn Mas'ud disait : « Celui qui veut savoir s'il aime Allah, qu'il évalue son attachement au Coran. » La tilawa est le thermomètre de l'amour divin. Si votre récitation est mécanique, c'est que le cœur est endormi. Réveillez-le par la lenteur.",
    },
    {
      type: "info",
      title: "Tartil vs. Tadwur",
      content:
        "Le « tartil » est la récitation lente et mesurée, recommandée par le Coran lui-même : « Wa rattili al-Qur'ana tartila » (Sourate 73:4). Le « tadwur » est la récitation rapide pour terminer le Coran. Les savants recommandent le tartil pour la méditation, et le tadwur pour la révision.",
    },
  ],
  quotes: [
    {
      text: "Celui qui récite le Coran avec habileté sera avec les nobles anges enregistreurs, et celui qui le récite avec difficulté en trébuchant aura une double récompense.",
      source: "Rapporté par Al-Bukhari et Muslim",
    },
  ],
};

// ---- Chapter C2 — Tarjamah (Compréhension) ----

const c2: Chapter = {
  id: "c2",
  number: "C2",
  title: "Tarjamah",
  subtitle: "Compréhension — Le sens caché dans les mots",
  part: "C",
  arabicVerse: "الْحَمْدُ لِلَّهِ الَّذِي لَمْ يَتَّخِذْ وَلَدًا وَلَمْ يَكُن لَّهُ شَرِيكٌ فِي الْمُلْكِ وَلَمْ يَكُن لَّهُ وَلِيٌّ مِّنَ الذُّلِ وَكَبِّرْهُ تَكْبِيرًا",
  translation:
    "Louange à Allah qui ne S'est pas attribué d'enfant, qui n'a pas d'associé en la royauté et qui n'a pas besoin d'un allié pour Le protéger de l'humiliation. Et proclame Sa grandeur magnifiquement.",
  translationSource: "Traduction Hamidullah — Sourate 17, verset 111",
  wordAnalysis: [
    {
      arabic: "تَرْجَمَةٌ",
      transliteration: "Tarjamah",
      literalMeaning: "Traduction / Interprétation",
      mirrorDimension:
        "La tarjamah n'est pas qu'un passage d'une langue à une autre — c'est un passage de l'ignorance à la compréhension. Traduire, c'est faire traverser le sens.",
    },
    {
      arabic: "وَلَدًا",
      transliteration: "Walad",
      literalMeaning: "Enfant / Fils",
      mirrorDimension:
        "Allah nie avoir un enfant — Il est au-dessus de la filiation qui implique le besoin et la dépendance. L'enfant a besoin du parent ; Allah n'a besoin de rien.",
    },
    {
      arabic: "شَرِيكٌ",
      transliteration: "Sharik",
      literalMeaning: "Associé / Partenaire",
      mirrorDimension:
        "L'association (shirk) est le péché ultime car elle nie l'unicité. Comprendre ce mot, c'est comprendre que rien ne partage la souveraineté divine.",
    },
    {
      arabic: "الذُّلِ",
      transliteration: "Adh-Dhull",
      literalMeaning: "L'humiliation / L'abaissement",
      mirrorDimension:
        "Allah n'a pas besoin d'allié pour Le protéger de l'humiliation — Il est Al-'Aziz (Le Puissant). L'humiliation ne peut L'atteindre.",
    },
    {
      arabic: "تَكْبِيرًا",
      transliteration: "Takbira",
      literalMeaning: "Proclamation de grandeur",
      mirrorDimension:
        "Après avoir nié toute imperfection, le verset commande de proclamer Sa grandeur — la compréhension mène naturellement à la glorification.",
    },
  ],
  coherencePoints: [
    "La tarjamah est le pont entre la récitation et la réflexion : sans compréhension littérale, la méditation reste vague. Le sens précis des mots est le fondement de tout approfondissement.",
    "Ce verset de la sourate Al-Isra est une synthèse de l'unicité divine : pas d'enfant (négation de la filiation), pas d'associé (négation du pouvoir partagé), pas de protecteur contre l'humiliation (négation de la faiblesse). Trois négations qui purifient la conception de Dieu.",
    "Le verset se termine par un commandement : « kabbirhu takbira » — proclame Sa grandeur. La compréhension n'est pas un exercice intellectuel : elle doit mener à l'action du cœur.",
  ],
  mirrorQuestions: [
    {
      question:
        "Quand je lis le Coran en traduction, est-ce que je m'arrête sur chaque mot ou est-ce que je lis comme un roman ?",
      meditation:
        "La différence entre lire et étudier est la différence entre traverser un jardin et s'y arrêter. Prenez un verset et examinez chaque mot comme une pierre précieuse.",
    },
    {
      question:
        "Y a-t-il des mots du Coran que je comprends mal ou que j'ai jamais vraiment cherché à comprendre ?",
      meditation:
        "Identifiez 3 mots que vous récitez sans en connaître le sens exact. Cherchez leur traduction. Comment cette connaissance change-t-elle votre récitation ?",
    },
    {
      question:
        "La compréhension du verset change-t-elle mon comportement, ou reste-t-elle théorique ?",
      meditation:
        "Comprendre que Dieu n'a pas d'associé dans Sa souveraineté implique-t-il que je Lui associe quelque chose dans ma vie pratique ?",
    },
  ],
  munajatPrompts: [
    "Ya Allah, ouvre mon intelligence à la compréhension de Ton Livre — pas pour accumuler du savoir, mais pour Te connaître.",
    "Ya Allah, fais que chaque mot que je comprenne devienne une graine de transformation dans mon cœur.",
    "Ya Waduud, enseigne-moi à lire Ta Parole non pas avec les yeux seulement, mais avec l'âme.",
    "Ya Allah, préserve-moi de la compréhension aride — celle qui remplit l'esprit mais vide le cœur.",
  ],
  timerMinutes: 20,
  exercises: [
    {
      question:
        "Prenez le verset d'ancrage (Sourate 17:111) et analysez chaque mot individuellement. Pour chaque mot, écrivez : (a) le sens littéral, (b) ce que ce mot nie ou affirme sur Allah, (c) l'impact sur votre conception de Dieu.",
      placeholder:
        "Mon analyse mot par mot du verset d'ancrage...",
    },
    {
      question:
        "Choisissez un verset que vous récitez souvent sans comprendre (par exemple dans la prière). Cherchez sa traduction, ses nuances, et écrivez comment cette compréhension nouvelle change votre expérience de la prière.",
      placeholder:
        "Le verset que j'ai redécouvert et comment sa compréhension transforme ma prière...",
    },
    {
      question:
        "Comparez les traductions d'un même verset dans au moins deux traductions françaises. Quelles différences remarquez-vous ? Comment chaque traduction oriente-t-elle la compréhension ?",
      placeholder:
        "Mes observations sur les différences entre traductions...",
    },
  ],
  bulletPoints: [
    "La tarjamah est un devoir : Le Prophète ﷺ a dit : « Lisez le Coran en arabe et en traduction. » La compréhension n'est pas un luxe — c'est une obligation minimale pour chaque croyant.",
    "Les mots ont des racines : En arabe, chaque mot vient d'une racine (jisr) de 3 lettres qui porte un champ sémantique. Comprendre la racine, c'est voir tout l'horizon du mot.",
    "La traduction est une interprétation : Toute traduction est déjà une lecture. C'est pourquoi il faut revenir au texte arabe autant que possible, et comparer les traductions.",
  ],
  callouts: [
    {
      type: "warning",
      title: "Le piège de la compréhension superficielle",
      content:
        "Comprendre le sens littéral d'un verset n'est pas en saisir toute la profondeur. Le Coran a un sens extérieur (zahir) et un sens intérieur (batin). La tarjamah vous donne le zahir — ne vous arrêtez pas là. Les niveaux suivants vous mèneront au batin.",
    },
    {
      type: "gold",
      title: "Le miroir linguistique",
      content:
        "Chaque mot du Coran a été choisi parmi des synonymes possibles. Pourquoi « hamd » et non « shukr » ? Pourquoi « ahad » et non « wahid » ? La différence entre synonymes en arabe n'est pas stylistique — elle est ontologique. Chaque mot révèle une dimension de la réalité divine.",
    },
  ],
  quotes: [
    {
      text: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
      source: "Rapporté par Al-Bukhari",
    },
  ],
};

// ---- Chapter C3 — Tadabbur (Réflexion) ----

const c3: Chapter = {
  id: "c3",
  number: "C3",
  title: "Tadabbur",
  subtitle: "Réflexion — Questionner le texte sacré",
  part: "C",
  arabicVerse: "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ أَمْ عَلَىٰ قُلُوبٍ أَقْفَالُهَا",
  translation:
    "Ne méditent-ils pas sur le Coran ? Ou bien y a-t-il des cadenas sur leurs cœurs ?",
  translationSource: "Traduction Hamidullah — Sourate 47, verset 24",
  wordAnalysis: [
    {
      arabic: "يَتَدَبَّرُونَ",
      transliteration: "Yatababbarun",
      literalMeaning: "Méditer / Examiner en profondeur",
      mirrorDimension:
        "Le tadabbur vient de « dubr » (l'arrière / la conséquence). Méditer, c'est regarder au-delà de l'apparent — chercher les conséquences et les profondeurs du texte.",
    },
    {
      arabic: "أَقْفَالٌ",
      transliteration: "Aqfal",
      literalMeaning: "Cadenas / Serrures",
      mirrorDimension:
        "Le cœur peut être verrouillé — pas par Dieu, mais par notre propre négligence. Le cadenas, c'est l'habitude, la paresse spirituelle, et l'attachement au superficiel.",
    },
    {
      arabic: "قُلُوبٍ",
      transliteration: "Qulub",
      literalMeaning: "Cœurs",
      mirrorDimension:
        "Le cœur (qalb) est appelé ainsi parce qu'il « se retourne » (taqallub) constamment. Le tadabbur est ce qui stabilise le cœur en le fixant sur la vérité.",
    },
    {
      arabic: "أَفَلَا",
      transliteration: "Afa la",
      literalMeaning: "Ne… donc pas ? (Question rhétorique)",
      mirrorDimension:
        "La question rhétorique est un appel à la conscience : « Ne vas-tu donc pas réfléchir ? » C'est un rappel que la réflexion est un devoir, pas un choix.",
    },
  ],
  coherencePoints: [
    "Le Coran nous interpelle directement : ce verset n'est pas une description — c'est un défi. « Ne méditent-ils pas ? » sous-entend : ils devraient le faire.",
    "Le contraste est saisissant : d'un côté, le tadabbur (ouverture), de l'autre, les cadenas (fermeture). Il n'y a pas de terrain neutre — soit le cœur est ouvert à la réflexion, soit il est verrouillé.",
    "Le tadabbur commence par des questions : Qui parle ? À qui ? Pourquoi ? Qu'est-ce qui est nié ? Qu'est-ce qui est affirmé ? Chaque question ouvre une porte dans le texte.",
  ],
  mirrorQuestions: [
    {
      question:
        "Quels cadenas y a-t-il sur mon cœur qui m'empêchent de méditer profondément ?",
      meditation:
        "Identifiez vos « cadenas » : la précipitation, la distraction, le doute, la routine, la peur de ce que la réflexion pourrait révéler.",
    },
    {
      question:
        "Est-ce que je pose des questions au Coran quand je le lis, ou est-ce que je le lis passivement ?",
      meditation:
        "La prochaine fois que vous lisez un verset, posez-lui 3 questions. Attendez la réponse du cœur, pas de l'intellect.",
    },
    {
      question:
        "Quand ai-je ressenti pour la dernière fois qu'un verset me « parlait directement » ?",
      meditation:
        "Le tadabbur transforme la lecture en dialogue. Le Coran n'est pas un texte mort — il est vivant (hayy). Chaque lecture peut être une nouvelle rencontre.",
    },
    {
      question:
        "Quel verset me résiste le plus — celui que j'évite de méditer parce qu'il est inconfortable ?",
      meditation:
        "Le verset qui nous dérange est souvent celui dont nous avons le plus besoin. L'inconfort spirituel est un signe que le cœur est en train de s'ouvrir.",
    },
  ],
  munajatPrompts: [
    "Ya Allah, brise les cadenas de mon cœur — ceux que j'ai moi-même posés par ma négligence et mon oublie.",
    "Ya Fattah (L'Ouvreur), ouvre mon cœur au tadabbur de Ton Livre, comme Tu as ouvert le cœur de Ton Prophète ﷺ.",
    "Ya Allah, fais que chaque question que je pose à Ton Livre reçoive une réponse — par une lumière dans mon cœur, par un signe dans ma vie.",
    "Ya Latif, enseigne-moi la patience du tadabbur — que je ne me précipite pas vers la conclusion avant d'avoir goûté à la profondeur.",
  ],
  timerMinutes: 22,
  exercises: [
    {
      question:
        "Prenez le verset d'ancrage (Sourate 47:24) et posez-lui 7 questions. Pour chaque question, écrivez la réponse qui vous vient du cœur, pas de l'intellect.",
      placeholder:
        "Mes 7 questions au verset et les réponses du cœur...",
    },
    {
      question:
        "Identifiez votre « cadenas » principal — ce qui vous empêche de méditer profondément. Décrivez-le, puis écrivez une intention concrète pour le déverrouiller cette semaine.",
      placeholder:
        "Mon cadenas principal et mon intention pour le déverrouiller...",
    },
    {
      question:
        "Prenez un verset que vous avez déjà étudié aux niveaux 1 et 2. Relisez-le en mode tadabbur : qu'y a-t-il de nouveau que vous n'aviez pas vu aux niveaux précédents ?",
      placeholder:
        "Ce que le tadabbur a révélé que la tilawa et la tarjamah n'avaient pas montré...",
    },
  ],
  callouts: [
    {
      type: "gold",
      title: "Le tadabbur est un devoir",
      content:
        "Le Coran blâme ceux qui ne méditent pas : « Ne méditent-ils pas sur le Coran ? » (47:24), « Un Livre que Nous avons fait descendre sur toi, béni, pour qu'ils méditent sur ses versets » (38:29). Le tadabbur n'est pas réservé aux savants — c'est une obligation pour chaque croyant.",
    },
    {
      type: "info",
      title: "La méthode des questions",
      content:
        "Al-Ghazali recommandait de lire chaque verset en se posant : Qui parle ? À qui ? De quoi ? Pourquoi ? Comment ? Les réponses à ces questions forment le socle du tadabbur. C'est la méthode du tafsir par le questionnement (tafsir bi al-ma'thur).",
    },
  ],
  comparisonTable: {
    headers: ["Aspect", "Tilawa (Niveau 1)", "Tarjamah (Niveau 2)", "Tadabbur (Niveau 3)"],
    rows: [
      [
        "Action",
        "Réciter les lettres",
        "Comprendre les mots",
        "Questionner le sens",
      ],
      [
        "Posture",
        "La langue agit",
        "L'intellect reçoit",
        "Le cœur cherche",
      ],
      [
        "Question clé",
        "Comment prononcer ?",
        "Que signifie ce mot ?",
        "Pourquoi ce mot et pas un autre ?",
      ],
      [
        "Analogie",
        "Lire la partition",
        "Comprendre les notes",
        "Entendre la musique entre les notes",
      ],
    ],
  },
};

// ---- Chapter C4 — Tafakkur (Contemplation) ----

const c4: Chapter = {
  id: "c4",
  number: "C4",
  title: "Tafakkur",
  subtitle: "Contemplation — Voir au-delà du visible",
  part: "C",
  arabicVerse:
    "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ",
  translation:
    "Allah est la Lumière des cieux et de la terre. Sa lumière est comme une niche dans laquelle se trouve une lampe.",
  translationSource: "Traduction Hamidullah — Sourate 24, verset 35 (début)",
  wordAnalysis: [
    {
      arabic: "تَفَكُّرٌ",
      transliteration: "Tafakkur",
      literalMeaning: "Contemplation / Méditation profonde",
      mirrorDimension:
        "Le tafakkur vient de « fikr » (la pensée) avec l'intensif « ta » — c'est une pensée qui va et vient, qui tourne autour du sens comme l'abeille autour de la fleur.",
    },
    {
      arabic: "نُورُ",
      transliteration: "Nur",
      literalMeaning: "Lumière",
      mirrorDimension:
        "La lumière n'est pas une chose — c'est ce qui rend toute chose visible. Allah est la condition de possibilité de toute perception, matérielle et spirituelle.",
    },
    {
      arabic: "مِشْكَاةٍ",
      transliteration: "Mishkat",
      literalMeaning: "Niche / Cavité dans le mur",
      mirrorDimension:
        "La niche protège et concentre la lumière. Le cœur du croyant est cette niche — un espace intime où la lumière divine peut résider sans être dispersée.",
    },
    {
      arabic: "مِصْبَاحٍ",
      transliteration: "Misbah",
      literalMeaning: "Lampe / Source de lumière",
      mirrorDimension:
        "La lampe dans la niche, c'est la foi qui brille dans le cœur protégé. Sans la niche (le cœur), la lampe est exposée aux vents. Sans la lampe (la foi), la niche est vide.",
    },
  ],
  coherencePoints: [
    "Le tafakkur prolonge le tadabbur : là où le tadabbur pose des questions, le tafakkur contemple les implications spirituelles. Le tadabbur demande « pourquoi ? », le tafakkur demande « et alors ? ».",
    "Ayat an-Nur est le verset parfait pour le tafakkur car il est lui-même une métaphore de la contemplation : chaque couche de la métaphore (niche, lampe, verre, olivier) correspond à une couche de notre être spirituel.",
    "La contemplation transforme la vision : après le tafakkur, on ne voit plus le monde de la même manière. Chaque chose visible devient un signe (aya) qui renvoie à l'Invisible.",
  ],
  mirrorQuestions: [
    {
      question:
        "Quand je contemple la création, est-ce que je vois la Lumière derrière les formes ?",
      meditation:
        "Regardez un arbre, le ciel, l'eau — et demandez-vous : quelle est la source de la beauté que je perçois ? La forme ou la Lumière qui la traverse ?",
    },
    {
      question:
        "Ma niche (cœur) est-elle protégée ou exposée aux vents de la distraction ?",
      meditation:
        "Identifiez les vents qui éteignent votre lampe : les réseaux sociaux, les conversations futiles, l'anxiété. Comment construire des murs autour de votre niche ?",
    },
    {
      question:
        "Qu'est-ce que l'huile « presque lumineuse » (fitrah) dans ma propre vie ?",
      meditation:
        "Avant même la révélation, y a-t-il en vous une inclination naturelle vers la vérité, la beauté, la justice ? C'est votre fitrah — l'huile qui n'attend que l'étincelle.",
    },
    {
      question:
        "Le tafakkur change-t-il mon comportement concret, ou reste-t-il dans le domaine de la pensée ?",
      meditation:
        "La contemplation authentique transforme l'action. Si vous contemplez que Dieu est Lumière, cela doit changer la façon dont vous marchez dans l'obscurité du monde.",
    },
  ],
  munajatPrompts: [
    "Ya Nur (Lumière), illumine les recoins obscurs de mon cœur — ceux que je cache même à moi-même.",
    "Ya Allah, fais que ma contemplation ne soit pas un exercice intellectuel, mais une véritable rencontre avec Ta lumière.",
    "Ya Fattah, ouvre les yeux de mon cœur pour que je voie Tes signes dans chaque détail de la création.",
    "Ya Allah, transforme ma vision du monde — que chaque chose visible me ramène à Toi, l'Invisible.",
  ],
  timerMinutes: 25,
  exercises: [
    {
      question:
        "Contemplez Ayat an-Nur en silence pendant 10 minutes. Puis dessinez ou décrivez la « niche » de votre propre cœur : qu'y a-t-il dedans ? Est-ce que la lampe brille ? L'huile est-elle pure ?",
      placeholder:
        "Description de la niche de mon cœur et l'état de sa lumière...",
    },
    {
      question:
        "Pendant 24 heures, pratiquez le tafakkur sur la création : chaque chose belle que vous voyez, dites intérieurement « Subhan Allah » et cherchez le signe qui renvoie au Créateur. Notez vos 3 plus fortes impressions.",
      placeholder:
        "Mes 3 impressions les plus fortes de tafakkur sur la création...",
    },
    {
      question:
        "Prenez une métaphore du Coran (la niche, le olivier, la lumière) et écrivez comment elle s'applique à une situation concrète de votre vie actuelle.",
      placeholder:
        "Application concrète de la métaphore coranique à ma vie...",
    },
  ],
  metaphorTable: [
    {
      element: "La niche (mishkat)",
      metaphor: "Le cœur protégé",
      interpretation:
        "Le cœur qui préserve sa lumière des vents de la distraction et de l'oubli",
    },
    {
      element: "La lampe (misbah)",
      metaphor: "La foi contemplative",
      interpretation:
        "Non pas la foi qui croit sans voir, mais celle qui voit à travers la contemplation",
    },
    {
      element: "Le verre (zujajah)",
      metaphor: "L'intelligence transparente",
      interpretation:
        "Un intellect pur qui laisse passer la lumière sans la déformer",
    },
  ],
  callouts: [
    {
      type: "gold",
      title: "Une heure de tafakkur vaut mieux que 60 ans d'adoration",
      content:
        "Le Prophète ﷺ a dit : « Une heure de contemplation (tafakkur) vaut mieux que soixante ans d'adoration. » Cette parole souligne que la qualité de la présence intérieure est plus précieuse que la quantité d'actes extérieurs.",
    },
    {
      type: "warning",
      title: "Le danger de la contemplation sans ancrage",
      content:
        "Le tafakkur doit rester ancré dans le Coran et la Sunna. Sans cet ancrage, la contemplation peut dériver vers l'imagination ou l'illusion. Revenez toujours au texte révélé comme boussole.",
    },
  ],
};

// ---- Chapter C5 — Tazakkur (Rappel) ----

const c5: Chapter = {
  id: "c5",
  number: "C5",
  title: "Tazakkur",
  subtitle: "Rappel — Le dhikr qui réveille le cœur",
  part: "C",
  arabicVerse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
  translation:
    "C'est par le rappel d'Allah que les cœurs trouvent la paix.",
  translationSource: "Traduction Hamidullah — Sourate 13, verset 28",
  wordAnalysis: [
    {
      arabic: "تَذَكُّرٌ",
      transliteration: "Tazakkur",
      literalMeaning: "Rappel / Souvenir actif",
      mirrorDimension:
        "Le tazakkur n'est pas un simple souvenir — c'est un réveil. Se rappeler Dieu, c'est se réveiller de l'oubli (ghafla) qui endort le cœur.",
    },
    {
      arabic: "ذِكْرِ",
      transliteration: "Dhikr",
      literalMeaning: "Rappel / Évocation / Mention",
      mirrorDimension:
        "Le dhikr est à la fois l'acte de se rappeler et ce dont on se rappelle. Le Coran lui-même est appelé « Dhikr » — il est à la fois le rappel et l'objet du rappel.",
    },
    {
      arabic: "تَطْمَئِنُّ",
      transliteration: "Tatma'innu",
      literalMeaning: "Trouvent la paix / Se tranquillisent",
      mirrorDimension:
        "La tranquillité (tuma'ninah) n'est pas l'absence de problèmes — c'est la présence de Dieu dans le cœur au milieu des tempêtes.",
    },
    {
      arabic: "الْقُلُوبُ",
      transliteration: "Al-Qulub",
      literalMeaning: "Les cœurs",
      mirrorDimension:
        "Le pluriel est significatif : la paix du dhikr n'est pas individuelle — elle se partage et se multiplie dans la communauté des croyants.",
    },
  ],
  coherencePoints: [
    "Le tazakkur est le cœur battant de la spiritualité islamique : la plupart des actes d'adoration (prières, jeûne, pélérinage) sont des formes de dhikr — des rappels organisés de la présence divine.",
    "La promesse du verset est absolue : « C'est PAR le rappel d'Allah que les cœurs trouvent la paix. » Pas par la richesse, pas par le pouvoir, pas par les relations — uniquement par le dhikr.",
    "Le tazakkur est le niveau qui relie la compréhension à l'action : après avoir réfléchi (tadabbur) et contemplé (tafakkur), le croyant se rappelle (tazakkur) ce qu'il a compris et l'intègre dans sa vie quotidienne.",
  ],
  mirrorQuestions: [
    {
      question:
        "Quel est le dhikr qui apaise le plus mon cœur — la prière formelle, le dhikr silencieux, ou la lecture du Coran ?",
      meditation:
        "Chaque cœur a sa « porte » préférée vers la paix. Identifiez la vôtre et engagez-vous à la pratiquer davantage.",
    },
    {
      question:
        "Combien de temps puis-je rester sans me rappeler d'Allah avant que mon cœur ne s'agite ?",
      meditation:
        "Testez-vous : au prochain moment de stress, prenez 3 respirations en disant « Subhan Allah, Al-Hamdulillah, Allahu Akbar ». Observez le changement.",
    },
    {
      question:
        "Est-ce que mon dhikr est mécanique ou conscient ?",
      meditation:
        "Le dhikr mécanique a sa valeur, mais le dhikur conscient transforme. La différence est la même qu'entre murmurer « je t'aime » et le dire en regardant dans les yeux.",
    },
    {
      question:
        "Qu'ai-je oublié de Dieu aujourd'hui ? Qu'est-ce que le tazakkur me rappelle ?",
      meditation:
        "L'oubli (nisyan) est la maladie du cœur. Le tazakkur est le remède. Chaque rappel est une guérison.",
    },
  ],
  munajatPrompts: [
    "Ya Dhakir (Celui qui rappelle), rappelle-moi Ta présence quand je T'oublie — et je T'oublie si souvent.",
    "Ya Allah, fais que mon dhikr ne soit pas un murmure mécanique, mais un cri du cœur qui a soif de Toi.",
    "Ya Allah, accorde-moi la tuma'ninah — cette paix profonde que seul Ton rappel peut donner.",
    "Ya Mudhakkir (Celui qui fait se rappeler), fais que chaque événement de ma vie soit un rappel de Toi.",
  ],
  timerMinutes: 18,
  exercises: [
    {
      question:
        "Pratiquez le dhikr silencieux pendant 15 minutes : asseyez-vous dans le calme, fermez les yeux, et répétez intérieurement « La ilaha illa Allah » avec chaque expiration. Notez votre état avant et après.",
      placeholder:
        "Mon état avant et après 15 minutes de dhikr silencieux...",
    },
    {
      question:
        "Pendant une journée, chaque fois que vous ressentez de l'anxiété ou de l'agitation, arrêtez-vous et dites « Hasbuna Allah wa ni'ma al-wakil » (Allah nous suffit et quel excellent protecteur). Notez les moments où le dhikr a calmé votre cœur.",
      placeholder:
        "Les moments où le dhikr a calmé mon cœur aujourd'hui...",
    },
    {
      question:
        "Créez un « agenda de dhikr » : associez un dhikr à chaque activité quotidienne (au réveil, avant de manger, en conduisant, avant de dormir). Pratiquez-le pendant une semaine et décrivez le changement.",
      placeholder:
        "Mon agenda de dhikr et l'impact après une semaine...",
    },
  ],
  bulletPoints: [
    "Le dhikr est la respiration du cœur : Comme les poumons ont besoin d'oxygène, le cœur a besoin du dhikr. Sans dhikr, le cœur s'étouffe spirituellement.",
    "Les formes de dhikr sont infinies : La prière formelle est le dhikr suprême, mais chaque évocation de Dieu — par la langue, le cœur ou l'action — est du dhikr.",
    "Le dhikr collectif a une puissance spéciale : Le Prophète ﷺ a dit que les anges entourent les cercles de dhikr. La présence d'autres croyants amplifie la lumière du rappel.",
    "La constance vaut mieux que la quantité : Mieux vaut 5 minutes de dhikr sincère chaque jour qu'une heure exceptionnelle une fois par mois.",
  ],
  callouts: [
    {
      type: "gold",
      title: "Le dhikr comme remède universel",
      content:
        "Ibn al-Qayyim disait : « Le dhikr est la pharmacie du cœur. » Chaque forme de dhikr soigne une maladie spirituelle : « Subhan Allah » soigne l'orgueil, « Al-Hamdulillah » soigne l'ingratitude, « Allahu Akbar » soigne l'attachement au monde, « La ilaha illa Allah » soigne l'association.",
    },
    {
      type: "info",
      title: "La différence entre dhikr et tazakkur",
      content:
        "Le dhikr est l'acte d'évoquer Dieu. Le tazakkur est le niveau de lecture où le Coran lui-même devient un rappel. Le Coran est appelé « Dhikr » car sa lecture est le rappel suprême — chaque verset est une clé qui ouvre la porte de la présence divine.",
    },
  ],
  quotes: [
    {
      text: "Les gens du Paradis ne regretteront rien autant qu'une heure passée sans dhikr d'Allah.",
      source: "Rapporté par At-Tabarani",
    },
  ],
};

// ---- Chapter C6 — Tahqiq (Vérification) ----

const c6: Chapter = {
  id: "c6",
  number: "C6",
  title: "Tahqiq",
  subtitle: "Vérification — L'honnêteté radicale envers soi-même",
  part: "C",
  arabicVerse: "يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ ۝ كَبُرَ مَقْتًا عِندَ اللَّهِ أَن تَقُولُوا مَا لَا تَفْعَلُوا",
  translation:
    "Ô vous qui avez cru, pourquoi dites-vous ce que vous ne faites pas ? C'est chose très détestable auprès d'Allah que vous disiez ce que vous ne faites pas.",
  translationSource: "Traduction Hamidullah — Sourate 61, versets 2-3",
  wordAnalysis: [
    {
      arabic: "تَحْقِيقٌ",
      transliteration: "Tahqiq",
      literalMeaning: "Vérification / Réalisation / Authentification",
      mirrorDimension:
        "Le tahqiq vient de « haqqa » (être vrai/véritable). C'est le niveau où l'on vérifie si la vérité que l'on connaît est devenue vérité que l'on vit.",
    },
    {
      arabic: "لِمَ تَقُولُونَ",
      transliteration: "Lima taqulun",
      literalMeaning: "Pourquoi dites-vous ?",
      mirrorDimension:
        "La question divine est un miroir : « Pourquoi dis-tu ce que tu ne fais pas ? » Chaque croyant doit se regarder dans ce miroir sans détourner le regard.",
    },
    {
      arabic: "مَقْتًا",
      transliteration: "Maqtan",
      literalMeaning: "Détestation / Haine",
      mirrorDimension:
        "Le mot est fort — Allah déteste (maqt) que l'on dise ce qu'on ne fait pas. L'hypocrisie spirituelle est pire que l'ignorance car elle corrompt la sincérité.",
    },
    {
      arabic: "تَفْعَلُوا",
      transliteration: "Taf'aluh",
      literalMeaning: "Vous faites / Vous réalisez",
      mirrorDimension:
        "L'écart entre la parole et l'action est la mesure de notre sincérité (ikhlas). Le tahqiq est le niveau de l'alignement : faire ce que l'on dit, dire ce que l'on fait.",
    },
  ],
  coherencePoints: [
    "Le tahqiq est le niveau le plus inconfortable : il exige une honnêteté radicale envers soi-même. Pas de complaisance, pas d'auto-illusion. Le miroir du tahqiq ne flatte personne.",
    "Le verset d'ancrage (Sourate 61:2-3) est un réveil : Allah ne condamne pas celui qui ne fait pas — Il condamne celui qui dit sans faire. L'écart entre la parole et l'action est le péché spirituel le plus subtil.",
    "Le tahqiq est le pont entre la connaissance et la réalisation : les cinq premiers niveaux sont des étapes de compréhension. Le tahqiq demande : cette compréhension a-t-elle changé votre vie ? Si non, que vaut-elle ?",
  ],
  mirrorQuestions: [
    {
      question:
        "Quelles vérités du Coran connais-je mais ne mets-je pas en pratique ?",
      meditation:
        "Soyez spécifique. « Je sais que le dhikr apaise le cœur mais je ne le pratique pas. » « Je sais que la patience est une vertu mais je me mets en colère. » Nommez au moins 3 vérités que vous ne vivez pas.",
    },
    {
      question:
        "Y a-t-il un écart entre ma vie publique (ce que les autres voient) et ma vie privée (ce que Dieu voit) ?",
      meditation:
        "Le tahqiq demande : êtes-vous le même dans le noir que dans la lumière ? Si non, où est la fracture ?",
    },
    {
      question:
        "Si je devais comparaître devant Allah aujourd'hui, de quelle incohérence aurais-je honte ?",
      meditation:
        "Cette question n'est pas pour vous culpabiliser, mais pour vous éveiller. La honte spirituelle (haya') est une vertu — elle est le début de l'alignement.",
    },
    {
      question:
        "Quelle est la résistance intérieure qui m'empêche de passer du dire au faire ?",
      meditation:
        "La résistance a toujours un nom : la peur, la paresse, l'attachement au confort, l'orgueil. Identifiez-la avec précision.",
    },
  ],
  munajatPrompts: [
    "Ya Allah, montre-moi mes contradictions — pas pour me détruire, mais pour me guérir.",
    "Ya Haqq (Le Vrai), fais que ma vie devienne une vérification de ce que ma langue professe.",
    "Ya Allah, je cherche refuge auprès de Toi contre le savoir qui ne bénéficie pas, le cœur qui ne s'humilie pas, et l'âme qui ne se satisfait pas.",
    "Ya Musabbib al-Asbab, donne-moi la force de passer de l'intention à l'action, de la parole à la réalisation.",
  ],
  timerMinutes: 20,
  exercises: [
    {
      question:
        "Faites un audit sincère : listez 5 enseignements du Coran que vous connaissez mais ne mettez pas en pratique. Pour chacun, identifiez la résistance spécifique et écrivez une action concrète pour cette semaine.",
      placeholder:
        "Mon audit de 5 enseignements non pratiqués avec résistances et actions...",
    },
    {
      question:
        "Prenez le verset « LIMA taqulun ma la taf'alun » et écrivez une lettre honnête à vous-même : « Je dis que… mais je fais… » Répétez pour 3 aspects de votre vie. Que ressentez-vous ?",
      placeholder:
        "Ma lettre honnête : je dis que… mais je fais…",
    },
    {
      question:
        "Choisissez UNE vérité coranique que vous allez vérifier (tahqiq) cette semaine — la mettre en pratique concrètement chaque jour. Décrivez votre expérience à la fin de la semaine.",
      placeholder:
        "La vérité que j'ai vérifiée cette semaine et mon expérience...",
    },
  ],
  comparisonTable: {
    headers: ["Aspect", "Niveaux 1-3 (Connaître)", "Niveaux 4-5 (Ressentir)", "Niveau 6 (Vérifier)"],
    rows: [
      [
        "Posture",
        "L'intellect reçoit",
        "Le cœur ressent",
        "La volonté s'aligne",
      ],
      [
        "Question",
        "Que dit le Coran ?",
        "Que me dit le Coran ?",
        "Est-ce que je vis ce que le Coran dit ?",
      ],
      [
        "Danger",
        "L'illusion de savoir",
        "L'illusion de ressentir",
        "L'illusion d'être aligné",
      ],
      [
        "Vertu",
        "La science ('ilm)",
        "La saveur (dhawq)",
        "La réalisation (tahqiq)",
      ],
    ],
  },
  callouts: [
    {
      type: "warning",
      title: "Le tahqiq n'est pas la culpabilisation",
      content:
        "L'honnêteté du tahqiq n'est pas un tribunal qui condamne — c'est un médecin qui diagnostique. Le but n'est pas de se punir, mais de se guérir. La culpabilité mène au désespoir ; la vérification mène au changement.",
    },
    {
      type: "gold",
      title: "Le miroir du tahqiq",
      content:
        "Le tahqiq est comme se regarder dans un miroir sans filtre : on voit chaque ride, chaque tache, chaque imperfection. Mais ce miroir est aussi la promesse que ce qu'on voit, on peut le transformer — avec l'aide d'Allah.",
    },
  ],
  quotes: [
    {
      text: "Le sage est celui qui se connaît lui-même et qui œuvre pour ce qui vient après la mort. L'incapable est celui qui se laisse mener par ses passions et qui espère des choses irréalistes d'Allah.",
      source: "Rapporté par At-Tirmidhi",
    },
  ],
};

// ---- Chapter C7 — Tajalli (Révélation spirituelle) ----

const c7: Chapter = {
  id: "c7",
  number: "C7",
  title: "Tajalli",
  subtitle: "Révélation spirituelle — La lumière qui se dévoile",
  part: "C",
  arabicVerse: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
  translation:
    "Dis : Il est Allah, l'Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.",
  translationSource: "Traduction Hamidullah — Sourate 112, Al-Ikhlas",
  wordAnalysis: [
    {
      arabic: "تَجَلِّي",
      transliteration: "Tajalli",
      literalMeaning: "Manifestation / Dévoilement / Apparition",
      mirrorDimension:
        "Le tajalli est le dévoilement d'une réalité spirituelle qui était voilée. Ce n'est pas l'esprit qui invente — c'est la lumière qui se révèle quand le voile est levé.",
    },
    {
      arabic: "أَحَدٌ",
      transliteration: "Ahad",
      literalMeaning: "L'Unique / L'Un",
      mirrorDimension:
        "« Ahad » est au-delà du « un » numérique — c'est l'unicité qui exclut toute multiplicité. Le tajalli d'Al-Ahad est l'expérience où plus rien d'autre n'existe que Lui.",
    },
    {
      arabic: "الصَّمَدُ",
      transliteration: "As-Samad",
      literalMeaning: "Le Seul à être imploré / L'Indépendant",
      mirrorDimension:
        "Au niveau du tajalli, on comprend « As-Samad » non par l'intellect mais par l'expérience : quand tout s'effondre, Il reste. Il est le seul Refuge qui ne s'effondre jamais.",
    },
    {
      arabic: "كُفُوًا",
      transliteration: "Kufuwan",
      literalMeaning: "Égal / Semblable / Comparables",
      mirrorDimension:
        "L'expérience du tajalli confirme : rien dans la création n'est comparable au Créateur. Chaque tentative de comparaison est un voile qui se lève.",
    },
  ],
  coherencePoints: [
    "Le tajalli est le sommet des sept niveaux : c'est le niveau où le croyant passe de la connaissance sur Dieu à la connaissance par Dieu. La connaissance devient expérience.",
    "Al-Ikhlas est la sourate du tajalli par excellence : en 4 versets, elle résume l'unicité absolue. Méditée au niveau 7, chaque verset devient une porte d'illumination.",
    "Le tajalli est un don (fadl), pas un droit : on ne l'obtient pas par l'effort seul. Mais on le prépare en nettoyant le cœur par les six premiers niveaux. Le cœur purifié est comme un miroir sans tache — il reflète la lumière divine.",
  ],
  mirrorQuestions: [
    {
      question:
        "Ai-je déjà vécu un moment de clarté spirituelle soudaine — où une vérité du Coran est devenue une expérience vécue ?",
      meditation:
        "Ce moment n'est pas le produit du hasard. C'est un tajalli — un dévoilement. Remerciez Allah pour ce don et demandez-Lui de le renouveler.",
    },
    {
      question:
        "Qu'est-ce qui voile mon cœur et empêche le tajalli ?",
      meditation:
        "Les voiles sont nombreux : les péchés, l'attachement au monde, l'orgueil intellectuel, la négligence. Chaque voile levé est une lumière qui entre.",
    },
    {
      question:
        "Suis-je prêt à recevoir le tajalli, ou est-ce que je cherche seulement à comprendre ?",
      meditation:
        "La compréhension est le bateau, le tajalli est le rivage. Êtes-vous prêt à descendre du bateau ? Cela demande du lâcher-prise.",
    },
    {
      question:
        "Comment le tajalli changerait-il ma vie si je le vivais chaque jour ?",
      meditation:
        "Celui qui vit dans le tajalli ne voit plus le monde de la même manière. Chaque chose est un signe, chaque moment est une rencontre, chaque souffle est une prière.",
    },
  ],
  munajatPrompts: [
    "Ya Allah, dévoile-moi une lumière de Ton Livre que je n'ai jamais vue — même si elle me transforme.",
    "Ya Wajid (Celui qui trouve), fais que je Te trouve dans les replis de ma méditation, quand mon cœur est silencieux.",
    "Ya Allah, lève les voiles entre moi et Ta Parole — les voiles de mon ego, de mes passions, de mon orgueil.",
    "Ya Tajalli, manifeste-Ta beauté dans mon cœur — non pas pour que je m'attribue cette lumière, mais pour que je Te la rende en gratitude.",
  ],
  timerMinutes: 25,
  exercises: [
    {
      question:
        "Récitez Al-Ikhlas au niveau 7 : après chaque verset, arrêtez-vous et attendez dans le silence. Que vous dit le cœur entre les versets ? Notez chaque impression, même fugace.",
      placeholder:
        "Mes impressions entre les versets d'Al-Ikhlas au niveau 7...",
    },
    {
      question:
        "Choisissez un moment de la journée (aube ou nuit) pour une méditation silencieuse de 20 minutes. Pas de texte, pas de dhikr verbal — juste l'attente silencieuse de la lumière. Décrivez votre expérience.",
      placeholder:
        "Mon expérience de méditation silencieuse en attente du tajalli...",
    },
    {
      question:
        "Résumez votre voyage à travers les 7 niveaux de lecture : quel est le niveau où vous vous sentez le plus en phase aujourd'hui ? Lequel vous demande le plus de travail ? Écrivez un plan personnel de progression spirituelle.",
      placeholder:
        "Mon bilan des 7 niveaux et mon plan de progression spirituelle...",
    },
  ],
  bulletPoints: [
    "Le tajalli ne se force pas : Il est comme l'aube — on ne peut pas la précipiter, mais on peut se préparer à la recevoir. La préparation, ce sont les six premiers niveaux.",
    "Les formes du tajalli sont variées : Une paix soudaine, des larmes sans raison apparente, une compréhension intuitive d'un verset, un amour qui inonde le cœur — tous sont des manifestations du tajalli.",
    "Le danger de la prétention : Prétendre avoir atteint le tajalli est pire que de ne l'avoir pas atteint. L'orgueil spirituel est le voile le plus épais. La véritable lumière rend humble.",
    "Le tajalli est le commencement, pas la fin : L'illumination n'est pas la destination — c'est le début d'une nouvelle étape du voyage. Après le tajalli, le croyant doit revenir au niveau 1 avec de nouveaux yeux.",
  ],
  callouts: [
    {
      type: "gold",
      title: "Le miroir sans tache",
      content:
        "Al-Ghazali comparait le cœur à un miroir : quand il est purifié de toute rouille (les péchés, les attachements, l'ego), il reflète la lumière divine comme un miroir reflète le soleil. Le tajalli, c'est ce moment où le miroir est assez pur pour refléter la vérité. Mais attention : le miroir ne produit pas la lumière — il la reçoit.",
    },
    {
      type: "warning",
      title: "Le tajalli n'est pas l'objectif",
      content:
        "Chercher le tajalli pour lui-même est une forme subtile d'ego spirituel. Le but de la méditation coranique n'est pas l'expérience mystique — c'est la proximité avec Allah (qurb). Le tajalli est un sous-produit de cette proximité, pas son but. Cherchez le Proche, pas l'expérience.",
    },
  ],
  quotes: [
    {
      text: "Si les voiles étaient levés, cela n'ajouterait rien à ce qui m'est déjà manifesté.",
      source: "Attribué au Prophète ﷺ (hadith qudsi)",
    },
    {
      text: "La connaissance de Dieu n'est pas une acquisition de l'intellect par l'étude — c'est une lumière qu'Allah dépose dans le cœur de celui qu'Il veut parmi Ses serviteurs.",
      source: "Al-Harith al-Muhasibi",
    },
  ],
  comparisonTable: {
    headers: ["Niveau", "Nom", "Acte", "Fruit", "Obstacle"],
    rows: [
      [
        "1",
        "Tilawa",
        "Réciter",
        "La lettre comme lumière",
        "La négligence (alfa)",
      ],
      [
        "2",
        "Tarjamah",
        "Comprendre",
        "Le sens comme guide",
        "La superficialité",
      ],
      [
        "3",
        "Tadabbur",
        "Questionner",
        "La profondeur comme trésor",
        "Les cadenas du cœur",
      ],
      [
        "4",
        "Tafakkur",
        "Contempler",
        "La vision intérieure",
        "L'imagination sans ancrage",
      ],
      [
        "5",
        "Tazakkur",
        "Se rappeler",
        "La paix du cœur (tuma'ninah)",
        "L'oubli (ghafla)",
      ],
      [
        "6",
        "Tahqiq",
        "Vérifier",
        "L'alignement parole-acte",
        "L'hypocrisie subtile",
      ],
      [
        "7",
        "Tajalli",
        "Recevoir",
        "L'illumination (fadl)",
        "L'orgueil spirituel",
      ],
    ],
  },
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
    {
      term: "Tilawa",
      definition:
        "Récitation suivie du Coran — lire en suivant chaque lettre avec précision et présence",
    },
    {
      term: "Tarjamah",
      definition:
        "Traduction et compréhension — faire traverser le sens d'une langue à une autre",
    },
    {
      term: "Tahqiq",
      definition:
        "Vérification et réalisation — aligner sa vie avec ce que l'on sait être vrai",
    },
    {
      term: "Tazakkur",
      definition:
        "Rappel actif — se réveiller de l'oubli par l'évocation consciente de Dieu",
    },
    {
      term: "Tuma'ninah",
      definition:
        "Tranquillité du cœur — la paix profonde que seul le dhikr peut donner",
    },
    {
      term: "Ghafla",
      definition:
        "Inadvertance et oubli — l'état du cœur endormi, inconscient de la présence divine",
    },
    {
      term: "Ihsan",
      definition:
        "L'excellence spirituelle — adorer Dieu comme si tu Le voyais, car Lui te voit",
    },
    {
      term: "Tawba",
      definition:
        "Le retour vers Dieu — se repentir sincèrement et revenir sur le chemin droit",
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
      chapters: [c1, c2, c3, c4, c5, c6, c7],
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
  c1, c2, c3, c4, c5, c6, c7,
];

// ---------------------------------------------------------------------------
// Helper: Get chapter by ID
// ---------------------------------------------------------------------------

export function getChapterById(id: string): Chapter | undefined {
  const lowerId = id.toLowerCase();
  return allChapters.find((ch) => ch.id.toLowerCase() === lowerId);
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
