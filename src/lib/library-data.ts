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
    items: ["the-stranger", "kafka-on-the-shore", "the-midnight-library", "arrival", "interstellar", "perfect-days", "the-time-machine"]
  },
  {
    id: "solitude",
    title: "Stories of Solitude",
    description: "Reflections on isolation, alienation, and finding peace in being alone.",
    items: ["the-stranger", "siddhartha", "the-midnight-library", "the-catcher-in-the-rye", "perfect-days", "time-in-a-bottle"]
  },
  {
    id: "tech-society",
    title: "Technology & Design",
    description: "Essays and projects exploring software, abstraction, and simple architectures.",
    items: ["steve-jobs", "zero-to-one-notes-on-startups-or-how-to-build-the-future", "the-checklist-manifesto-how-to-get-things-right", "cs50-harvard"]
  },
  {
    id: "literature-culture",
    title: "Indian Landscapes & Art",
    description: "Stories and rhythms rooted in the Indian sub-continent, its history, and ecology.",
    items: ["the-glass-palace", "godan", "gaban", "duniya-jise-kehte-hain", "midnights-children", "the-white-tiger"]
  }
];

// ─── STATIC ARCHIVE ITEMS ──────────────────────────────────────────────
// Cross-tagged with conceptual theme tags for associative grouping.

export const staticArchiveItems: ArchiveItem[] = [
  // ── Books ──────────────────────────────────────────────────────────
  {
    id: "the-midnight-library",
    title: "The Midnight Library",
    creator: "Matt Haig",
    type: "book",
    tags: ["Memory", "Literature", "Solitude"],
    year: "2020"
  },
  {
    id: "runaway-vagabond",
    title: "Runaway Vagabond",
    creator: "Sriza Ghosh",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2019"
  },
  {
    id: "21-lessons-for-the-21st-century",
    title: "21 Lessons for the 21st Century",
    creator: "Yuval Noah Harari",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "2018"
  },
  {
    id: "pyjamas-are-forgiving-paperback-twinkle-khanna",
    title: "Pyjamas are Forgiving [Paperback] TWINKLE KHANNA",
    creator: "Twinkle Khanna",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2018"
  },
  {
    id: "factfulness-ten-reasons-were-wrong-about-the-world-and-why-things-are-better-than-you-think",
    title: "Factfulness: Ten Reasons We're Wrong About the World – and Why Things Are Better Than You Think",
    creator: "Hans Rosling",
    type: "book",
    tags: ["Literature"],
    year: "2018"
  },
  {
    id: "origin",
    title: "Origin",
    creator: "Dan    Brown",
    type: "book",
    tags: ["Literature"],
    year: "2017"
  },
  {
    id: "leonardo-da-vinci",
    title: "Leonardo da Vinci",
    creator: "Walter Isaacson",
    type: "book",
    tags: ["History", "Technology", "Civilization", "Systems"],
    year: "2017"
  },
  {
    id: "duniya-jise-kehte-hain",
    title: "Duniya Jise Kehte Hain",
    creator: "Nida Fazil",
    type: "book",
    tags: ["Indian Literature", "Literature", "Philosophy", "Poetry"],
    year: "2016"
  },
  {
    id: "when-breath-becomes-air",
    title: "When Breath Becomes Air",
    creator: "Paul Kalanithi",
    type: "book",
    tags: ["Literature"],
    year: "2016"
  },
  {
    id: "one-indian-girl",
    title: "One Indian Girl",
    creator: "Chetan Bhagat",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2016"
  },
  {
    id: "harry-potter-and-the-cursed-child-parts-one-and-two",
    title: "Harry Potter and the Cursed Child: Parts One and Two",
    creator: "J.K. Rowling",
    type: "book",
    tags: ["Literature"],
    year: "2016"
  },
  {
    id: "death-under-the-deodars",
    title: "Death Under the Deodars",
    creator: "Ruskin Bond",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2016"
  },
  {
    id: "the-legend-of-lakshmi-prasad",
    title: "The Legend of Lakshmi Prasad",
    creator: "Twinkle Khanna",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2016"
  },
  {
    id: "the-productivity-project-accomplishing-more-by-managing-your-time-attention-and-energy",
    title: "The Productivity Project: Accomplishing More by Managing Your Time, Attention, and Energy",
    creator: "Chris   Bailey",
    type: "book",
    tags: ["Memory", "Technology", "Systems", "Solitude"],
    year: "2016"
  },
  {
    id: "the-subtle-art-of-not-giving-a-fck-a-counterintuitive-approach-to-living-a-good-life",
    title: "The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach to Living a Good Life",
    creator: "Mark Manson",
    type: "book",
    tags: ["Literature"],
    year: "2016"
  },
  {
    id: "old-school",
    title: "Old School",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2015"
  },
  {
    id: "the-long-haul",
    title: "The Long Haul",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2014"
  },
  {
    id: "playing-it-my-way-my-autobiography",
    title: "Playing It My Way: My Autobiography",
    creator: "Sachin Tendulkar",
    type: "book",
    tags: ["Literature"],
    year: "2014"
  },
  {
    id: "zero-to-one-notes-on-startups-or-how-to-build-the-future",
    title: "Zero to One: Notes on Startups, or How to Build the Future",
    creator: "Peter Thiel",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "2014"
  },
  {
    id: "the-rosie-project",
    title: "The Rosie Project",
    creator: "Graeme Simsion",
    type: "book",
    tags: ["Literature"],
    year: "2013"
  },
  {
    id: "inferno",
    title: "Inferno",
    creator: "Dan    Brown",
    type: "book",
    tags: ["Literature"],
    year: "2013"
  },
  {
    id: "the-humans",
    title: "The Humans",
    creator: "Matt Haig",
    type: "book",
    tags: ["Literature"],
    year: "2013"
  },
  {
    id: "best-kept-secret",
    title: "Best Kept Secret",
    creator: "Jeffrey Archer",
    type: "book",
    tags: ["Literature"],
    year: "2013"
  },
  {
    id: "hard-luck",
    title: "Hard Luck",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2013"
  },
  {
    id: "winter-of-the-world",
    title: "Winter of the World",
    creator: "Ken Follett",
    type: "book",
    tags: ["History", "Civilization", "Literature"],
    year: "2012"
  },
  {
    id: "the-third-wheel",
    title: "The Third Wheel",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2012"
  },
  {
    id: "the-magic-of-reality-how-we-know-whats-really-true",
    title: "The Magic of Reality: How We Know What's Really True",
    creator: "Richard Dawkins",
    type: "book",
    tags: ["Literature"],
    year: "2011"
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    creator: "Walter Isaacson",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "2011"
  },
  {
    id: "cabin-fever",
    title: "Cabin Fever",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2011"
  },
  {
    id: "mr-olivers-diary-feb-15-2010-bond-ruskin",
    title: "Mr Oliver's Diary [Feb 15, 2010] Bond, Ruskin",
    creator: "Ruskin Bond",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2010"
  },
  {
    id: "the-ugly-truth",
    title: "The Ugly Truth",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2010"
  },
  {
    id: "the-help",
    title: "The Help",
    creator: "Kathryn Stockett",
    type: "book",
    tags: ["Literature"],
    year: "2009"
  },
  {
    id: "the-checklist-manifesto-how-to-get-things-right",
    title: "The Checklist Manifesto: How To Get Things Right",
    creator: "Atul Gawande",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "2009"
  },
  {
    id: "the-last-straw",
    title: "The Last Straw",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2009"
  },
  {
    id: "dog-days",
    title: "Dog Days",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2009"
  },
  {
    id: "paper-towns",
    title: "Paper Towns",
    creator: "John  Green",
    type: "book",
    tags: ["Literature"],
    year: "2008"
  },
  {
    id: "the-white-tiger",
    title: "The White Tiger",
    creator: "Aravind Adiga",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2008"
  },
  {
    id: "outliers-the-story-of-success",
    title: "Outliers: The Story of Success",
    creator: "Malcolm Gladwell",
    type: "book",
    tags: ["Literature"],
    year: "2008"
  },
  {
    id: "rodrick-rules",
    title: "Rodrick Rules",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2008"
  },
  {
    id: "imagining-india-the-idea-of-a-renewed-nation",
    title: "Imagining India: The Idea of a Renewed Nation",
    creator: "Nandan Nilekani",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2008"
  },
  {
    id: "warren-buffett-and-the-interpretation-of-financial-statements",
    title: "Warren Buffett and the Interpretation of Financial Statements",
    creator: "Mary Buffett",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "2008"
  },
  {
    id: "einstein",
    title: "Einstein",
    creator: "Walter Isaacson",
    type: "book",
    tags: ["History", "Technology", "Civilization", "Systems"],
    year: "2007"
  },
  {
    id: "diary-of-a-wimpy-kid",
    title: "Diary of a Wimpy Kid",
    creator: "Jeff Kinney",
    type: "book",
    tags: ["Literature"],
    year: "2007"
  },
  {
    id: "fall-of-giants",
    title: "FALL OF GIANTS",
    creator: "Ken Follett",
    type: "book",
    tags: ["History", "Civilization", "Literature"],
    year: "2005"
  },
  {
    id: "the-book-thief",
    title: "The Book Thief",
    creator: "Markus Zusak",
    type: "book",
    tags: ["Literature"],
    year: "2005"
  },
  {
    id: "the-girl-with-the-dragon-tattoo",
    title: "The Girl With the Dragon Tattoo",
    creator: "Stieg Larsson",
    type: "book",
    tags: ["Literature"],
    year: "2005"
  },
  {
    id: "blink-the-power-of-thinking-without-thinking",
    title: "Blink: The Power of Thinking Without Thinking",
    creator: "Malcolm Gladwell",
    type: "book",
    tags: ["Literature"],
    year: "2005"
  },
  {
    id: "freakonomics-a-rogue-economist-explores-the-hidden-side-of-everything",
    title: "Freakonomics: A Rogue Economist Explores the Hidden Side of Everything",
    creator: "Steven D. Levitt",
    type: "book",
    tags: ["Literature"],
    year: "2005"
  },
  {
    id: "the-da-vinci-code",
    title: "The Da Vinci Code",
    creator: "Dan    Brown",
    type: "book",
    tags: ["History", "Civilization", "Literature"],
    year: "2003"
  },
  {
    id: "the-namesake",
    title: "The Namesake",
    creator: "Jhumpa Lahiri",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2003"
  },
  {
    id: "the-time-travelers-wife",
    title: "The Time Traveler's Wife",
    creator: "Audrey Niffenegger",
    type: "book",
    tags: ["Memory", "Literature", "Solitude"],
    year: "2003"
  },
  {
    id: "the-curious-incident-of-the-dog-in-the-night-time",
    title: "The Curious Incident of the Dog in the Night-Time",
    creator: "Mark Haddon",
    type: "book",
    tags: ["Memory", "Literature", "Solitude"],
    year: "2003"
  },
  {
    id: "the-kite-runner",
    title: "The Kite Runner",
    creator: "Khaled Hosseini",
    type: "book",
    tags: ["Literature"],
    year: "2003"
  },
  {
    id: "kafka-on-the-shore",
    title: "Kafka on the Shore",
    creator: "Haruki Murakami",
    type: "book",
    tags: ["Literature"],
    year: "2002"
  },
  {
    id: "fooled-by-randomness-the-hidden-role-of-chance-in-life-and-in-the-markets",
    title: "Fooled by Randomness: The Hidden Role of Chance in Life and in the Markets",
    creator: "Nassim Nicholas Taleb",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "2001"
  },
  {
    id: "good-to-great-why-some-companies-make-the-leap-and-others-dont",
    title: "Good to Great: Why Some Companies Make the Leap... and Others Don't",
    creator: "Jim Collins",
    type: "book",
    tags: ["Literature"],
    year: "2001"
  },
  {
    id: "the-glass-palace",
    title: "The Glass Palace",
    creator: "Amitav Ghosh",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2000"
  },
  {
    id: "kitne-pakistan",
    title: "कितने पाकिस्तान",
    creator: "Kamleshwar",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "2000"
  },
  {
    id: "india-unbound-from-independence-to-the-global-information-age",
    title: "India Unbound: From Independence to the Global Information Age",
    creator: "Gurcharan Das",
    type: "book",
    tags: ["Indian Literature", "Technology", "Systems"],
    year: "2000"
  },
  {
    id: "harry-potter-and-the-goblet-of-fire",
    title: "Harry Potter and the Goblet of Fire",
    creator: "J.K. Rowling",
    type: "book",
    tags: ["Literature"],
    year: "2000"
  },
  {
    id: "angels-demons",
    title: "Angels & Demons",
    creator: "Dan    Brown",
    type: "book",
    tags: ["Literature"],
    year: "2000"
  },
  {
    id: "harry-potter-and-the-prisoner-of-azkaban",
    title: "Harry Potter and the Prisoner of Azkaban",
    creator: "J.K. Rowling",
    type: "book",
    tags: ["Literature"],
    year: "1999"
  },
  {
    id: "interpreter-of-maladies",
    title: "Interpreter of Maladies",
    creator: "Jhumpa Lahiri",
    type: "book",
    tags: ["Indian Literature", "History", "Civilization", "Literature"],
    year: "1999"
  },
  {
    id: "rich-dad-poor-dad-what-the-rich-teach-their-kids-about-moneythat-the-poor-and-middle-class-do-not",
    title: "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money—That the Poor and Middle Class Do Not!",
    creator: "Robert T. Kiyosaki",
    type: "book",
    tags: ["Literature"],
    year: "1997"
  },
  {
    id: "the-poet",
    title: "The Poet",
    creator: "Michael    Connelly",
    type: "book",
    tags: ["Poetry", "Literature"],
    year: "1996"
  },
  {
    id: "learn-to-earn-a-beginners-guide-to-the-basics-of-investing-and-business",
    title: "Learn to Earn: A Beginner's Guide to the Basics of Investing and Business",
    creator: "Peter Lynch",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "1996"
  },
  {
    id: "built-to-last-successful-habits-of-visionary-companies",
    title: "Built to Last: Successful Habits of Visionary Companies",
    creator: "Jim Collins",
    type: "book",
    tags: ["Literature"],
    year: "1994"
  },
  {
    id: "the-7-habits-of-highly-effective-people-powerful-lessons-in-personal-change",
    title: "The 7 Habits of Highly Effective People: Powerful Lessons in Personal Change",
    creator: "Stephen R. Covey",
    type: "book",
    tags: ["Literature"],
    year: "1989"
  },
  {
    id: "the-long-dark-tea-time-of-the-soul",
    title: "The Long Dark Tea-Time of the Soul",
    creator: "Douglas Adams",
    type: "book",
    tags: ["Memory", "Literature", "Solitude"],
    year: "1988"
  },
  {
    id: "the-alchemist",
    title: "The Alchemist",
    creator: "Paulo Coelho",
    type: "book",
    tags: ["Philosophy", "Literature"],
    year: "1988"
  },
  {
    id: "enders-game",
    title: "Ender's Game",
    creator: "Orson Scott Card",
    type: "book",
    tags: ["Literature"],
    year: "1985"
  },
  {
    id: "midnights-children",
    title: "Midnight's Children",
    creator: "Salman Rushdie",
    type: "book",
    tags: ["Indian Literature", "Memory", "Literature", "Solitude"],
    year: "1981"
  },
  {
    id: "the-restaurant-at-the-end-of-the-universe",
    title: "The Restaurant at the End of the Universe",
    creator: "Douglas Adams",
    type: "book",
    tags: ["Poetry", "Literature"],
    year: "1980"
  },
  {
    id: "the-hitchhikers-guide-to-the-galaxy",
    title: "The Hitchhiker’s Guide to the Galaxy",
    creator: "Douglas Adams",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "1979"
  },
  {
    id: "shgun",
    title: "Shōgun",
    creator: "James Clavell",
    type: "book",
    tags: ["Literature"],
    year: "1975"
  },
  {
    id: "eagle-in-the-sky",
    title: "Eagle in the Sky",
    creator: "Wilbur Smith",
    type: "book",
    tags: ["Literature"],
    year: "1974"
  },
  {
    id: "the-power-of-your-subconscious-mind",
    title: "The Power of Your Subconscious Mind",
    creator: "Joseph Murphy",
    type: "book",
    tags: ["Literature"],
    year: "1963",
    note: "A great books if you are low on positivity. It can get all your positivity back."
  },
  {
    id: "to-kill-a-mockingbird",
    title: "To Kill a Mockingbird",
    creator: "Harper Lee",
    type: "book",
    tags: ["Literature"],
    year: "1960"
  },
  {
    id: "the-financial-expert",
    title: "The Financial Expert",
    creator: "R.K. Narayan",
    type: "book",
    tags: ["Technology", "Systems"],
    year: "1951"
  },
  {
    id: "the-catcher-in-the-rye",
    title: "The Catcher in the Rye",
    creator: "J.D. Salinger",
    type: "book",
    tags: ["Literature"],
    year: "1951"
  },
  {
    id: "the-lion-the-witch-and-the-wardrobe",
    title: "The Lion, the Witch and the Wardrobe",
    creator: "C.S. Lewis",
    type: "book",
    tags: ["Literature"],
    year: "1950"
  },
  {
    id: "crooked-house",
    title: "Crooked House",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1949"
  },
  {
    id: "1984",
    title: "1984",
    creator: "George Orwell",
    type: "book",
    tags: ["Literature"],
    year: "1948"
  },
  {
    id: "animal-farm",
    title: "Animal Farm",
    creator: "George Orwell",
    type: "book",
    tags: ["Literature"],
    year: "1945"
  },
  {
    id: "the-little-prince",
    title: "The Little Prince",
    creator: "Antoine de Saint-Exupéry",
    type: "book",
    tags: ["Literature"],
    year: "1943"
  },
  {
    id: "the-stranger",
    title: "The Stranger",
    creator: "Albert Camus",
    type: "book",
    tags: ["Philosophy", "Memory", "Existentialism", "Solitude", "Literature"],
    year: "1942"
  },
  {
    id: "five-little-pigs",
    title: "Five Little Pigs",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1942"
  },
  {
    id: "and-then-there-were-none",
    title: "And Then There Were None",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1939"
  },
  {
    id: "godan",
    title: "गोदान [Godan]",
    creator: "Munshi Premchand",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "1936"
  },
  {
    id: "the-abc-murders",
    title: "The A.B.C. Murders",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1936"
  },
  {
    id: "how-to-win-friends-influence-people",
    title: "How to Win Friends & Influence People",
    creator: "Dale Carnegie",
    type: "book",
    tags: ["Literature"],
    year: "1936"
  },
  {
    id: "murder-on-the-orient-express",
    title: "Murder on the Orient Express",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1934"
  },
  {
    id: "gaban",
    title: "गबन",
    creator: "Munshi Premchand",
    type: "book",
    tags: ["Indian Literature", "Literature"],
    year: "1931"
  },
  {
    id: "the-murder-of-roger-ackroyd",
    title: "The Murder of Roger Ackroyd",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1926"
  },
  {
    id: "the-richest-man-in-babylon",
    title: "The Richest Man in Babylon",
    creator: "George S. Clason",
    type: "book",
    tags: ["Literature"],
    year: "1926"
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    creator: "F. Scott Fitzgerald",
    type: "book",
    tags: ["Literature"],
    year: "1925"
  },
  {
    id: "siddhartha",
    title: "Siddhartha",
    creator: "Hermann Hesse",
    type: "book",
    tags: ["Philosophy", "Literature"],
    year: "1922"
  },
  {
    id: "the-mysterious-affair-at-styles",
    title: "The Mysterious Affair at Styles",
    creator: "Agatha Christie",
    type: "book",
    tags: ["Literature"],
    year: "1920"
  },
  {
    id: "the-metamorphosis",
    title: "The Metamorphosis",
    creator: "Franz Kafka",
    type: "book",
    tags: ["Philosophy", "Existentialism", "Literature"],
    year: "1915"
  },
  {
    id: "the-time-machine",
    title: "The Time Machine",
    creator: "H.G. Wells",
    type: "book",
    tags: ["Memory", "Literature", "Solitude"],
    year: "1895"
  },

  // ── Films ──────────────────────────────────────────────────────────
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
    id: "coherence",
    title: "Coherence",
    creator: "James Ward Byrkit",
    type: "film",
    tags: ["Cinema", "Dreams"],
    year: "2013",
    note: "A mind-bending sci-fi thriller exploring parallel universes and human dynamics during a comet flyby."
  },
  {
    id: "arrival",
    title: "Arrival",
    creator: "Denis Villeneuve",
    type: "film",
    tags: ["Cinema", "Memory", "Silence"],
    year: "2016",
    note: "A sublime exploration of language, time, and how we choose to live when we know the end from the beginning."
  },
  {
    id: "the-man-from-earth",
    title: "The Man from Earth",
    creator: "Richard Schenkman",
    type: "film",
    tags: ["Cinema", "Silence", "Solitude"],
    year: "2007",
    note: "An intellectual dialogue about history, faith, and existence, set entirely in a single room."
  },
  {
    id: "interstellar",
    title: "Interstellar",
    creator: "Christopher Nolan",
    type: "film",
    tags: ["Cinema", "Memory", "Solitude"],
    year: "2014",
    note: "An epic journey through space and time, grounded in a father's promise and love's dimensional persistence."
  },
  {
    id: "shutter-island",
    title: "Shutter Island",
    creator: "Martin Scorsese",
    type: "film",
    tags: ["Cinema", "Dreams", "Memory"],
    year: "2010",
    note: "A dark, atmospheric psychological puzzle examining grief, guilt, and the walls the mind builds to survive."
  },
  {
    id: "swades",
    title: "Swades",
    creator: "Ashutosh Gowariker",
    type: "film",
    tags: ["Cinema", "Routine", "Solitude"],
    year: "2004",
    note: "A heartwarming, grounded story of identity, home, and returning to one's roots."
  },
  {
    id: "udaan",
    title: "Udaan",
    creator: "Vikramaditya Motwane",
    type: "film",
    tags: ["Cinema", "Creativity", "Solitude"],
    year: "2010",
    note: "A poignant coming-of-age story about freedom, poetry, and escaping oppressive constraints."
  },
  {
    id: "incendies",
    title: "Incendies",
    creator: "Denis Villeneuve",
    type: "film",
    tags: ["Cinema", "Memory", "Silence"],
    year: "2010",
    note: "A devastating, powerful masterpiece tracking family secrets, trauma, and reconciliation across borders."
  },

  // ── Music ──────────────────────────────────────────────────────────
  {
    id: "time-in-a-bottle",
    title: "Time in a Bottle",
    creator: "Jim Croce",
    type: "music",
    tags: ["Music", "Late Night", "Solitude"],
    year: "1973",
    note: "A melancholic acoustic classic reflecting on time, love, and keeping moments forever."
  },
  {
    id: "husna",
    title: "Husna",
    creator: "Piyush Mishra",
    type: "music",
    tags: ["Music", "Late Night", "Solitude"],
    year: "2008",
    note: "A soulful, poetic lament speaking across borders, partition, and lost connection."
  },

  // ── Essays ─────────────────────────────────────────────────────────
  {
    id: "history-ancient-philosophy",
    title: "History of Ancient Philosophy (Full Course)",
    creator: "Adam Rosenfield",
    type: "essay",
    tags: ["Philosophy", "History"],
    link: "https://www.youtube.com/playlist?list=PLSvsx8116eZjRuC0qaZ5UEhybCsYpA-1j",
    year: "2020",
    note: "A comprehensive video lecture series covering the foundations of Western philosophical thought."
  },
  {
    id: "cs50-harvard",
    title: "CS50 Introduction to Computer Science",
    creator: "David J. Malan (Harvard University)",
    type: "essay",
    tags: ["Technology", "Systems"],
    link: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
    year: "2026",
    note: "An entry-level course that teaches how to think algorithmically and solve problems efficiently."
  },
  {
    id: "do-schools-kill-creativity",
    title: "Do Schools Kill Creativity? (TED Lecture)",
    creator: "Sir Ken Robinson",
    type: "essay",
    tags: ["Philosophy", "Creativity"],
    link: "https://youtu.be/iG9CE55wbtY?si=Nj1dUs7SLUnyqy26",
    year: "2006",
    note: "The legendary TED talk advocating for an education system that nurtures creativity rather than undermining it."
  }
];

export function sortBooks(books: ArchiveItem[]): ArchiveItem[] {
  const getPriorityRank = (item: ArchiveItem) => {
    const title = item.title.toLowerCase();
    const id = item.id.toLowerCase();
    if (title.includes("the stranger") || id === "the-stranger" || id === "stranger") return 0;
    if (title.includes("gaban") || id === "gaban") return 1;
    if (title.includes("godan") || id === "godan") return 2;
    if (title.includes("magic of reality") || id === "the-magic-of-reality" || id === "magic-of-reality") return 3;
    return -1;
  };

  const isLowPriority = (item: ArchiveItem) => {
    const creator = item.creator.toLowerCase();
    const tags = item.tags.map(t => t.toLowerCase());
    const title = item.title.toLowerCase();
    
    const isChetanBhagat = creator.includes("chetan bhagat");
    const isRomance = tags.includes("romance") || title.includes("romance") || tags.includes("love story");
    return isChetanBhagat || isRomance;
  };

  return [...books].sort((a, b) => {
    const aRank = getPriorityRank(a);
    const bRank = getPriorityRank(b);
    
    if (aRank !== -1 && bRank !== -1) return aRank - bRank;
    if (aRank !== -1) return -1;
    if (bRank !== -1) return 1;

    const aLow = isLowPriority(a);
    const bLow = isLowPriority(b);
    if (aLow && !bLow) return 1;
    if (!aLow && bLow) return -1;
    
    return 0; // preserve original relative order
  });
}
