export interface ArchiveItem {
  id: string;
  title: string;
  creator: string;
  type: "book" | "film" | "music" | "essay";
  tags: string[];
  year?: string;
  note?: string;
  link?: string;
  image?: string;
}

export interface ShelfConfig {
  id: string;
  title: string;
  description: string;
  filter: (item: ArchiveItem) => boolean;
}

export interface PreviewShelfConfig extends ShelfConfig {
  href: string;
}

// ─── PREVIEW SHELVES (main /library page) ──────────────────────────────
// Each links to its dedicated deep archive page.

export const PREVIEW_SHELVES: PreviewShelfConfig[] = [
  {
    id: "literature",
    title: "Literature & Fiction",
    description: "Novels, stories, and the worlds they leave behind.",
    href: "/library/books",
    filter: (item) => item.type === "book",
  },
  {
    id: "cinema",
    title: "Cinema",
    description: "Films that changed how I see.",
    href: "/library/cinema",
    filter: (item) => item.type === "film",
  },
  {
    id: "music",
    title: "Music",
    description: "What plays when the room goes quiet.",
    href: "/library/music",
    filter: (item) => item.type === "music",
  },
  {
    id: "essays",
    title: "Essays & Ideas",
    description: "Arguments, provocations, and lasting clarity.",
    href: "/library/essays",
    filter: (item) => item.type === "essay",
  },
];

// ─── ARCHIVE SHELVES (deep archive pages) ──────────────────────────────
// Conceptual groupings per medium, organized by intellectual theme.

export const BOOK_SHELVES: ShelfConfig[] = [
  {
    id: "existentialism",
    title: "Existentialism & Identity",
    description: "On meaning, mortality, and what it means to exist.",
    filter: (item) => item.type === "book" && item.tags.some(t => ["Existentialism", "Identity", "Philosophy"].includes(t)),
  },
  {
    id: "civilization",
    title: "Civilization & History",
    description: "The long arc of human enterprise, conquest, and memory.",
    filter: (item) => item.type === "book" && item.tags.some(t => ["History", "Civilization"].includes(t)),
  },
  {
    id: "systems-tech",
    title: "Systems & Technology",
    description: "Software, abstraction, information, and design.",
    filter: (item) => item.type === "book" && item.tags.some(t => ["Technology", "Design", "Systems"].includes(t)),
  },
  {
    id: "indian-lit",
    title: "Indian Literature",
    description: "Stories rooted in the subcontinent, its landscape, and ecology.",
    filter: (item) => item.type === "book" && item.tags.some(t => ["Indian Literature"].includes(t)),
  },
  {
    id: "poetry-letters",
    title: "Poetry & Letters",
    description: "Verse, correspondence, and the intimate written word.",
    filter: (item) => item.type === "book" && item.tags.some(t => ["Poetry"].includes(t)),
  },
  {
    id: "literature-fiction",
    title: "Literature & Fiction",
    description: "Novels and stories that reshape how you see the world.",
    filter: (item) => item.type === "book" && item.tags.some(t => ["Literature"].includes(t)),
  },
];

export const CINEMA_SHELVES: ShelfConfig[] = [
  {
    id: "memory-loneliness",
    title: "Memory & Loneliness",
    description: "Films that linger in the space between presence and absence.",
    filter: (item) => item.type === "film" && item.tags.some(t => ["Memory", "Solitude", "Loneliness"].includes(t)),
  },
  {
    id: "routine-silence",
    title: "Human Routine & Silence",
    description: "The beauty of repetition, stillness, and the everyday.",
    filter: (item) => item.type === "film" && item.tags.some(t => ["Routine", "Silence"].includes(t)),
  },
  {
    id: "dreams-creation",
    title: "Dreams & Creative Block",
    description: "On the act of creation and the chaos inside the artist.",
    filter: (item) => item.type === "film" && item.tags.some(t => ["Dreams", "Creativity"].includes(t)),
  },
];

export const MUSIC_SHELVES: ShelfConfig[] = [
  {
    id: "writing-focus",
    title: "Writing & Focus",
    description: "Soundscapes for deep work and quiet concentration.",
    filter: (item) => item.type === "music" && item.tags.some(t => ["Writing", "Focus", "Ambient"].includes(t)),
  },
  {
    id: "late-night",
    title: "Late Night & Solitude",
    description: "What plays when the room grows cold and the city sleeps.",
    filter: (item) => item.type === "music" && item.tags.some(t => ["Late Night", "Solitude"].includes(t)),
  },
  {
    id: "classical-reverence",
    title: "Classical Reverence",
    description: "Compositions that have survived centuries for good reason.",
    filter: (item) => item.type === "music" && item.tags.some(t => ["Classical"].includes(t)),
  },
];

export const ESSAY_SHELVES: ShelfConfig[] = [
  {
    id: "tech-systems",
    title: "Technology & Systems",
    description: "On software, open source, and the architecture of complexity.",
    filter: (item) => item.type === "essay" && item.tags.some(t => ["Technology", "Systems"].includes(t)),
  },
  {
    id: "philosophy-language",
    title: "Philosophy & Language",
    description: "On thought, authorship, and the precision of words.",
    filter: (item) => item.type === "essay" && item.tags.some(t => ["Philosophy", "Literature"].includes(t)),
  },
];

// ─── CURATED COLLECTIONS (cross-medium thematic) ───────────────────────

export const curatedCollections = [
  {
    id: "memory-time",
    title: "On Memory & Time",
    description: "Works that grapple with nostalgia, the passing of hours, and what we leave behind.",
    items: ["stranger", "norwegian-wood", "stalker", "perfect-days", "blue-notebooks", "12"]
  },
  {
    id: "solitude",
    title: "Stories of Solitude",
    description: "Reflections on isolation, alienation, and finding peace in being alone.",
    items: ["stranger", "norwegian-wood", "letters-poet", "perfect-days", "12", "kind-of-blue"]
  },
  {
    id: "tech-society",
    title: "Technology & Design",
    description: "Essays and projects exploring software, abstraction, and simple architectures.",
    items: ["keep-simple", "godel-escher-bach", "politics-language"]
  },
  {
    id: "literature-culture",
    title: "Indian Landscapes & Art",
    description: "Stories and rhythms rooted in the Indian sub-continent, its history, and ecology.",
    items: ["hungry-tide", "kind-of-blue", "politics-language"]
  }
];

// ─── STATIC ARCHIVE ITEMS ──────────────────────────────────────────────
// Cross-tagged with conceptual theme tags for associative grouping.

export const staticArchiveItems: ArchiveItem[] = [
  // ── Books ──────────────────────────────────────────────────────────
  {
    id: "norwegian-wood",
    title: "Norwegian Wood",
    creator: "Haruki Murakami",
    type: "book",
    tags: ["Literature", "Memory", "Solitude"],
    year: "1987",
    note: "Still thinking about time, memory, and rain."
  },
  {
    id: "letters-poet",
    title: "Letters to a Young Poet",
    creator: "Rainer Maria Rilke",
    type: "book",
    tags: ["Poetry", "Philosophy", "Solitude"],
    year: "1929",
    note: "A reminder of what it means to look inward and embrace solitude."
  },
  {
    id: "death-ivan",
    title: "The Death of Ivan Ilyich",
    creator: "Leo Tolstoy",
    type: "book",
    tags: ["Philosophy", "Literature", "Existentialism"],
    year: "1886",
    note: "Read during a particularly quiet winter."
  },
  {
    id: "godel-escher-bach",
    title: "Gödel, Escher, Bach",
    creator: "Douglas Hofstadter",
    type: "book",
    tags: ["Technology", "Philosophy", "Systems"],
    year: "1979",
    note: "A labyrinth of loops, code, and logical paradoxes."
  },
  {
    id: "zen-motorcycle",
    title: "Zen and the Art of Motorcycle Maintenance",
    creator: "Robert M. Pirsig",
    type: "book",
    tags: ["Philosophy", "Technology", "Identity"],
    year: "1974",
    note: "An inquiry into Quality and the separation of the romantic and the rational."
  },
  {
    id: "the-odyssey",
    title: "The Odyssey",
    creator: "Homer",
    type: "book",
    tags: ["Literature", "Civilization", "History"],
    year: "800 BCE",
    note: "The timeless archetype of wandering and return."
  },
  {
    id: "moby-dick",
    title: "Moby Dick",
    creator: "Herman Melville",
    type: "book",
    tags: ["Literature", "Existentialism"],
    year: "1851",
    note: "An ocean of obsession, whaling lore, and metaphysical dread."
  },
  {
    id: "tufte-visual",
    title: "The Visual Display of Quantitative Information",
    creator: "Edward Tufte",
    type: "book",
    tags: ["Technology", "Design", "Systems"],
    year: "1983",
    note: "A bible on clarity, data ink ratios, and honest graphics."
  },
  {
    id: "capital-vol1",
    title: "Capital, Volume 1",
    creator: "Karl Marx",
    type: "book",
    tags: ["Philosophy", "History", "Civilization"],
    year: "1867",
    note: "A monumental critique of political economy and commodification."
  },
  {
    id: "meditations-aurelius",
    title: "Meditations",
    creator: "Marcus Aurelius",
    type: "book",
    tags: ["Philosophy", "Existentialism", "Identity"],
    year: "180 CE",
    note: "Stoic reflections of an emperor writing on campaign."
  },

  // ── Films ──────────────────────────────────────────────────────────
  {
    id: "stalker",
    title: "Stalker",
    creator: "Andrei Tarkovsky",
    type: "film",
    tags: ["Cinema", "Philosophy", "Memory", "Silence"],
    year: "1979",
    note: "A slow-burning search for desire and belief in a wet, green wasteland."
  },
  {
    id: "mood-love",
    title: "In the Mood for Love",
    creator: "Wong Kar-wai",
    type: "film",
    tags: ["Cinema", "Memory", "Loneliness", "Solitude"],
    year: "2000",
    note: "A masterclass in restraint, color, and quiet longing."
  },
  {
    id: "perfect-days",
    title: "Perfect Days",
    creator: "Wim Wenders",
    type: "film",
    tags: ["Cinema", "Routine", "Silence", "Solitude"],
    year: "2023",
    note: "The beauty of everyday repetition and finding peace in simple habits."
  },
  {
    id: "mirror-tarkovsky",
    title: "Mirror",
    creator: "Andrei Tarkovsky",
    type: "film",
    tags: ["Cinema", "Memory", "Dreams", "Poetry"],
    year: "1975",
    note: "Memory woven as film, sliding across wind, mirrors, and childhood fields."
  },
  {
    id: "yi-yi",
    title: "Yi Yi",
    creator: "Edward Yang",
    type: "film",
    tags: ["Cinema", "Routine", "Memory", "Solitude"],
    year: "2000",
    note: "A gentle, all-encompassing view of Taiwanese family life."
  },
  {
    id: "8-half",
    title: "8½",
    creator: "Federico Fellini",
    type: "film",
    tags: ["Cinema", "Dreams", "Creativity"],
    year: "1963",
    note: "A chaotic, dreamlike portrait of creative block and memory."
  },

  // ── Music ──────────────────────────────────────────────────────────
  {
    id: "blue-notebooks",
    title: "The Blue Notebooks",
    creator: "Max Richter",
    type: "music",
    tags: ["Music", "Writing", "Late Night", "Solitude"],
    year: "2004",
    note: "Writing companion for rain-soaked afternoons."
  },
  {
    id: "glassworks",
    title: "Glassworks",
    creator: "Philip Glass",
    type: "music",
    tags: ["Music", "Focus", "Writing", "Classical"],
    year: "1982",
    note: "Hypnotic, repetitive structures that align the mind."
  },
  {
    id: "12",
    title: "12",
    creator: "Ryuichi Sakamoto",
    type: "music",
    tags: ["Music", "Late Night", "Solitude"],
    year: "2023",
    note: "A fragile, quiet recording of existence."
  },
  {
    id: "kind-of-blue",
    title: "Kind of Blue",
    creator: "Miles Davis",
    type: "music",
    tags: ["Music", "Late Night", "Classical"],
    year: "1959",
    note: "Late nights, when the room grows cold."
  },
  {
    id: "music-airports",
    title: "Ambient 1: Music for Airports",
    creator: "Brian Eno",
    type: "music",
    tags: ["Music", "Ambient", "Focus", "Writing"],
    year: "1978",
    note: "A foundational text in ambient sound design, intended to induce calm."
  },
  {
    id: "gymnopedies-satie",
    title: "Gymnopédies & Gnossiennes",
    creator: "Erik Satie",
    type: "music",
    tags: ["Music", "Classical", "Solitude"],
    year: "1888",
    note: "Sparsely populated piano compositions, echoing empty rooms."
  },

  // ── Essays ─────────────────────────────────────────────────────────
  {
    id: "death-author",
    title: "The Death of the Author",
    creator: "Roland Barthes",
    type: "essay",
    tags: ["Philosophy", "Literature"],
    year: "1967",
    note: "On the separation of the creator and the text."
  },
  {
    id: "politics-language",
    title: "Politics and the English Language",
    creator: "George Orwell",
    type: "essay",
    tags: ["Literature", "Philosophy"],
    year: "1946",
    note: "An evergreen warning against lazy thought and prefabricated language."
  },
  {
    id: "keep-simple",
    title: "Keep It Simple",
    creator: "Alan Kay",
    type: "essay",
    tags: ["Technology", "Systems"],
    year: "1989",
    note: "Architectural wisdom applied to software and thought design."
  },
  {
    id: "cathedral-bazaar",
    title: "The Cathedral and the Bazaar",
    creator: "Eric S. Raymond",
    type: "essay",
    tags: ["Technology", "Systems"],
    year: "1997",
    note: "Contrasting top-down planning with decentralized peer review."
  },
  {
    id: "usefulness-useless",
    title: "The Usefulness of Useless Knowledge",
    creator: "Abraham Flexner",
    type: "essay",
    tags: ["Philosophy", "History"],
    year: "1939",
    note: "A powerful defense of curiosity-driven basic research over target goals."
  }
];
