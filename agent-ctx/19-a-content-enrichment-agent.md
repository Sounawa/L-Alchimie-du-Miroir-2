# Task 19-a: Content Enrichment Agent

## Work Record

### Task
Enrich Part C by splitting single C1 chapter into 7 separate chapters (C1-C7)

### Changes Made

#### File: `/home/z/my-project/src/data/chapters.ts`

**Replaced** the single `c1` chapter ("Les Sept Niveaux de Lecture — Théorie et Application") with 7 separate rich chapters:

| Chapter | Title | Subtitle | Arabic Verse Source | Timer |
|---------|-------|----------|-------------------|-------|
| C1 | Tilawa | Récitation — La lettre comme lumière | Al-Fatiha 1:1-2 | 20 min |
| C2 | Tarjamah | Compréhension — Le sens caché dans les mots | Al-Isra 17:111 | 20 min |
| C3 | Tadabbur | Réflexion — Questionner le texte sacré | Muhammad 47:24 | 22 min |
| C4 | Tafakkur | Contemplation — Voir au-delà du visible | An-Nur 24:35 | 25 min |
| C5 | Tazakkur | Rappel — Le dhikr qui réveille le cœur | Ar-Ra'd 13:28 | 18 min |
| C6 | Tahqiq | Vérification — L'honnêteté radicale envers soi-même | As-Saff 61:2-3 | 20 min |
| C7 | Tajalli | Révélation spirituelle — La lumière qui se dévoile | Al-Ikhlas 112 | 25 min |

**Each chapter includes:**
- 4-5 wordAnalysis entries (Arabic with diacritics, transliteration, literal meaning, mirror dimension)
- 3-4 mirrorQuestions with meditation prompts
- 4 munajatPrompts
- 2-3 exercises with placeholders
- 1-2 callouts (gold/info/warning)
- 3 coherencePoints
- Additional fields: bulletPoints, comparisonTable, metaphorTable, quotes where appropriate

**Other updates:**
- Updated `partCDescription` to reflect enriched content
- Updated `siteContent.parts[2].chapters` from `[c1]` to `[c1, c2, c3, c4, c5, c6, c7]`
- Updated `allChapters` array to include c1-c7
- Updated `intro.structure` Partie C: chapters "C1 à C7", duration "~2h30"
- Fixed syntax error: missing colon in `literalMeaning` field for c7 ("Kufuwan")

### Verification
- `bun run lint` passes clean
- Dev server compiles successfully (HTTP 200)
- Total chapter count increased from 11 to 17
