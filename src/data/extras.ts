/** Pronunciation practice: minimal pairs and tricky sounds. */
export const PRONUNCIATION_SETS: {
  id: string
  title: string
  sound: string
  emoji: string
  tip: string
  tipRu: string
  pairs: [string, string][]
}[] = [
  {
    id: 'th',
    title: 'TH or S / T?',
    sound: '/θ/ – /s/',
    emoji: '👅',
    tip: 'Put your tongue between your teeth for TH.',
    tipRu: 'Для TH кончик языка между зубами.',
    pairs: [['think', 'sink'], ['three', 'tree'], ['thank', 'tank'], ['mouth', 'mouse']],
  },
  {
    id: 'ship-sheep',
    title: 'Short or long i',
    sound: '/ɪ/ – /iː/',
    emoji: '🐑',
    tip: 'Short /ɪ/ is quick and relaxed. Long /iː/ — smile and make it long.',
    tipRu: 'Короткий /ɪ/ — быстро и расслабленно. Долгий /iː/ — улыбнись и тяни.',
    pairs: [['ship', 'sheep'], ['live', 'leave'], ['sit', 'seat'], ['fill', 'feel']],
  },
  {
    id: 'v-w',
    title: 'V or W?',
    sound: '/v/ – /w/',
    emoji: '👄',
    tip: 'V: top teeth touch your lower lip. W: round your lips, no teeth.',
    tipRu: 'V — верхние зубы касаются нижней губы. W — губы трубочкой, без зубов.',
    pairs: [['vest', 'west'], ['vine', 'wine'], ['very', 'wary'], ['van', 'one']],
  },
  {
    id: 'ae-e',
    title: 'Cat or bed?',
    sound: '/æ/ – /e/',
    emoji: '🐱',
    tip: 'For /æ/ open your mouth wide, like a big smile.',
    tipRu: 'Для /æ/ широко открой рот, как в улыбке.',
    pairs: [['bad', 'bed'], ['man', 'men'], ['pan', 'pen'], ['sat', 'set']],
  },
  {
    id: 'h',
    title: 'H or no H?',
    sound: '/h/',
    emoji: '💨',
    tip: 'English H is just a soft breath — not a hard Russian «Х».',
    tipRu: 'Английский H — лёгкий выдох, не твёрдое русское «Х».',
    pairs: [['hat', 'at'], ['hear', 'ear'], ['hair', 'air'], ['heat', 'eat']],
  },
]

/** Demo league for the leaderboard (the learner is added with their real weekly XP). */
export const LEAGUE_PLAYERS: { name: string; avatar: string; xp: number; country: string }[] = [
  { name: 'Sofia', avatar: '🦄', xp: 640, country: '🇪🇸' },
  { name: 'Arman', avatar: '🦁', xp: 585, country: '🇰🇿' },
  { name: 'Mei', avatar: '🐼', xp: 520, country: '🇨🇳' },
  { name: 'Lucas', avatar: '🐯', xp: 455, country: '🇧🇷' },
  { name: 'Olga', avatar: '🦋', xp: 410, country: '🇷🇺' },
  { name: 'Yuki', avatar: '🐰', xp: 350, country: '🇯🇵' },
  { name: 'Ahmed', avatar: '🦅', xp: 295, country: '🇪🇬' },
  { name: 'Emma', avatar: '🐨', xp: 240, country: '🇩🇪' },
  { name: 'Marco', avatar: '🐺', xp: 180, country: '🇮🇹' },
  { name: 'Aliya', avatar: '🦊', xp: 120, country: '🇰🇿' },
  { name: 'Jonas', avatar: '🐻', xp: 75, country: '🇸🇪' },
  { name: 'Priya', avatar: '🐝', xp: 30, country: '🇮🇳' },
]

export const AVATARS = ['🦊', '🐼', '🦁', '🐯', '🐨', '🐰', '🦄', '🐸', '🐙', '🦉', '🐧', '🐳', '🌻', '🚀', '🎧', '⚡']
