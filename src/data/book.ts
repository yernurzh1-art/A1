import type { Exercise } from '@/types'
import { mc, tf } from './helpers'

export type Backdrop = 'sea' | 'shop' | 'key' | 'lighthouse' | 'night' | 'storm' | 'title'

export interface TrailerScene {
  backdrop: Backdrop
  text: string
  narration: string
}

export interface BookChapter {
  id: string
  number: number
  title: string
  emoji: string
  paragraphs: string[]
  glossary: Record<string, string>
  questions: Exercise[]
}

export interface Book {
  title: string
  tagline: string
  author: string
  level: string
  genre: string
  logline: string
  description: string
  setting: string
  characters: { name: string; role: string; emoji: string; description: string }[]
  trailer: TrailerScene[]
  vocabulary: { en: string; ru: string; emoji: string; ipa: string }[]
  afterWatching: { id: string; question: string; options?: string[]; answer?: number; sample?: string }[]
  chapters: BookChapter[]
}

/** An original short story written for A1 learners. */
export const BOOK: Book = {
  title: 'The Lighthouse Key',
  tagline: 'One key. One night. One secret.',
  author: 'Stepwise Originals',
  level: 'A1 · Beginner',
  genre: 'Mystery',
  logline: 'A summer job. An old bookshop. A key with no door.',
  description:
    'Lily comes to the small town of Port Bell for a summer job in an old bookshop. One day she finds a small gold key inside a very old book. On the key there is a picture of a lighthouse. Nobody visits the old lighthouse… so why is there a light in its window every night?',
  setting: 'Port Bell — a small, quiet town by the sea in the south-west of England.',
  characters: [
    { name: 'Lily Moore', role: 'Main character', emoji: '👩‍🎓', description: 'A 19-year-old student from London. Curious, brave and kind.' },
    { name: 'Mr Finch', role: 'Bookshop owner', emoji: '👴', description: 'An old man with white hair and blue eyes. He has a secret.' },
    { name: 'Max', role: 'The dog', emoji: '🐕', description: 'Mr Finch’s big brown dog. He always knows the way.' },
    { name: 'Sam', role: 'Fisherman', emoji: '🎣', description: 'A young fisherman. He thinks there is a ghost in the lighthouse.' },
  ],
  trailer: [
    { backdrop: 'sea', text: 'Port Bell. A small town by the sea.', narration: 'Port Bell. A small, quiet town by the sea.' },
    { backdrop: 'shop', text: 'Lily has a new summer job…', narration: 'Lily has a new summer job in an old bookshop.' },
    { backdrop: 'key', text: '…and an old book has a secret.', narration: 'One day, she opens a very old book… and finds a key.' },
    { backdrop: 'lighthouse', text: 'Nobody goes to the old lighthouse.', narration: 'Nobody goes to the old lighthouse. Nobody.' },
    { backdrop: 'night', text: 'So why is there a light in the window?', narration: 'So why is there a light in the window every night?' },
    { backdrop: 'storm', text: 'One key. One night. One secret.', narration: 'One key. One night. One secret.' },
    { backdrop: 'title', text: 'THE LIGHTHOUSE KEY', narration: 'The Lighthouse Key. Start reading now.' },
  ],
  vocabulary: [
    { en: 'lighthouse', ru: 'маяк', emoji: '🌊', ipa: '/ˈlaɪthaʊs/' },
    { en: 'key', ru: 'ключ', emoji: '🔑', ipa: '/kiː/' },
    { en: 'bookshop', ru: 'книжный магазин', emoji: '📚', ipa: '/ˈbʊkʃɒp/' },
    { en: 'secret', ru: 'секрет, тайна', emoji: '🤫', ipa: '/ˈsiːkrət/' },
    { en: 'light', ru: 'свет', emoji: '💡', ipa: '/laɪt/' },
    { en: 'storm', ru: 'шторм, буря', emoji: '⛈️', ipa: '/stɔːm/' },
    { en: 'town', ru: 'городок', emoji: '🏘️', ipa: '/taʊn/' },
    { en: 'brave', ru: 'смелый', emoji: '🦁', ipa: '/breɪv/' },
    { en: 'find (found)', ru: 'находить (нашёл)', emoji: '🔍', ipa: '/faɪnd/' },
    { en: 'nobody', ru: 'никто', emoji: '🚫', ipa: '/ˈnəʊbədi/' },
  ],
  afterWatching: [
    { id: 'bt-1', question: 'Who is the main character?', options: ['Lily', 'Mr Finch', 'Max'], answer: 0 },
    { id: 'bt-2', question: 'Where does the story happen?', options: ['in a big city', 'in a small town by the sea', 'in the mountains'], answer: 1 },
    { id: 'bt-3', question: 'What does Lily find?', options: ['a map', 'a key', 'a letter'], answer: 1 },
    { id: 'bt-4', question: 'What do you think happens next?', sample: 'I think Lily goes to the lighthouse at night with Max and finds a secret room.' },
  ],
  chapters: [
    {
      id: 'ch1',
      number: 1,
      title: 'A Summer Job',
      emoji: '📚',
      paragraphs: [
        'Lily Moore is nineteen years old. She is a student in London. In summer, she goes to Port Bell, a small town by the sea. She has a new job there in an old bookshop.',
        'The bookshop is on Harbour Street. It is small and dark, and there are books everywhere — on the shelves, on the tables and on the floor. The owner is Mr Finch. He is old, with white hair and kind blue eyes. He has a big brown dog. His name is Max.',
        "'Welcome to Port Bell, Lily,' says Mr Finch. 'Your room is upstairs. You can start work tomorrow at nine.' Lily looks out of the window. She can see the sea and, on the rocks, a tall white lighthouse.",
        "'Is that lighthouse open?' she asks. Mr Finch's face changes. 'No,' he says quietly. 'Nobody goes there. Nobody.'",
      ],
      glossary: { owner: 'владелец', shelves: 'полки', floor: 'пол', kind: 'добрый', upstairs: 'наверху', rocks: 'скалы', tall: 'высокий', quietly: 'тихо', everywhere: 'везде', changes: 'меняется' },
      questions: [
        mc('ch1-1', 'How old is Lily?', ['nineteen', 'twenty', 'eighteen'], 0),
        mc('ch1-2', 'Where is the bookshop?', ['on Harbour Street', 'on Park Road', 'on the rocks'], 0),
        tf('ch1-3', "Max is Mr Finch's cat.", false, 'Max is a big brown dog.'),
        mc('ch1-4', 'What can Lily see from the window?', ['a castle', 'the sea and a lighthouse', 'a big city'], 1),
      ],
    },
    {
      id: 'ch2',
      number: 2,
      title: 'The Old Book',
      emoji: '🔑',
      paragraphs: [
        'Lily loves her new job. Every morning she opens the shop, makes coffee for Mr Finch and puts new books on the shelves. Max always sleeps under the table.',
        "One rainy afternoon, Lily finds a very old book on the top shelf. It is big and heavy, with a green cover. The title is 'Stories of the Sea'. She opens it and something falls on the floor. It is a small gold key!",
        "On the key there is a picture of a lighthouse and a number: 1975. 'How strange,' says Lily. She wants to ask Mr Finch, but he isn't in the shop. Max looks at the key and then he looks at the door. He barks.",
        "Lily puts the key in her pocket. 'OK, Max,' she says. 'Tomorrow we can go for a walk… to the lighthouse.'",
      ],
      glossary: { 'top shelf': 'верхняя полка', heavy: 'тяжёлый', cover: 'обложка', title: 'название', falls: 'падает', gold: 'золотой', strange: 'странный', barks: 'лает', pocket: 'карман' },
      questions: [
        mc('ch2-1', 'Where does Lily find the book?', ['on the floor', 'on the top shelf', 'under the table'], 1),
        mc('ch2-2', 'What falls out of the book?', ['a letter', 'a photo', 'a gold key'], 2),
        tf('ch2-3', 'There is a number on the key: 1975.', true),
        mc('ch2-4', 'Where is Mr Finch?', ['in the shop', "He isn't in the shop.", 'at the lighthouse'], 1),
      ],
    },
    {
      id: 'ch3',
      number: 3,
      title: 'The Lighthouse',
      emoji: '🌊',
      paragraphs: [
        "The next morning is sunny. Lily and Max walk along the beach to the rocks. There Lily meets a young fisherman. His name is Sam. 'Are you going to the lighthouse?' he asks. 'Be careful. People say there is a ghost there!' Lily laughs. 'I don't believe in ghosts.'",
        'The lighthouse is very old. The door is blue, but the paint is old. There is a lock on the door. Lily takes the key out of her pocket. Her hands are cold. She puts the key in the lock and turns it. Click! The door opens.',
        "Inside, there are a lot of stairs. Lily and Max go up, up, up. At the top there is a small room with a table, a chair and a big lamp. On the table there is a photo of a young man and a woman — and a letter. The letter says: 'For Edward. I am waiting for you. Love, Rose. 1975.'",
      ],
      glossary: { along: 'вдоль', beach: 'пляж', fisherman: 'рыбак', 'be careful': 'будь осторожна', ghost: 'привидение', believe: 'верить', lock: 'замок (дверной)', turns: 'поворачивает', stairs: 'лестница', waiting: 'жду' },
      questions: [
        mc('ch3-1', 'Who does Lily meet on the beach?', ['Mr Finch', 'a fisherman, Sam', 'a ghost'], 1),
        tf('ch3-2', 'Lily believes in ghosts.', false, "She says: 'I don't believe in ghosts.'"),
        mc('ch3-3', 'What colour is the door?', ['blue', 'red', 'white'], 0),
        mc('ch3-4', 'What is on the table?', ['a key and a map', 'a photo and a letter', 'books'], 1),
      ],
    },
    {
      id: 'ch4',
      number: 4,
      title: 'The Secret',
      emoji: '💌',
      paragraphs: [
        "Lily runs back to the bookshop with the photo and the letter. Mr Finch is there. When he sees the photo, he sits down. His eyes are full of tears. 'That is me,' he says. 'My first name is Edward. And this is Rose.'",
        "'Rose was my girlfriend,' he says. 'In 1975, I went to London for work. She waited for me at the lighthouse every night, with the lamp on. But I didn't come back in time. Rose moved away, and I never found her.' 'And the light in the window?' asks Lily. Mr Finch smiles a little. 'Every night I go there and turn on the lamp. For Rose. Maybe one day she can see it.'",
        "Lily has an idea. That evening she writes a post on the internet with the photo: 'Do you know Rose? She lived in Port Bell in 1975.' Two days later, there is an answer. 'Rose is my grandmother,' writes a girl. 'She lives in Bristol. And she still has a lighthouse key… just like yours.'",
      ],
      glossary: { tears: 'слёзы', girlfriend: 'девушка (подруга)', waited: 'ждала', 'in time': 'вовремя', 'moved away': 'уехала', 'turn on': 'включать', maybe: 'может быть', idea: 'идея', still: 'всё ещё', 'just like': 'точно как' },
      questions: [
        mc('ch4-1', "What is Mr Finch's first name?", ['Edward', 'Sam', 'David'], 0),
        mc('ch4-2', 'Who is Rose?', ["Mr Finch's sister", "Mr Finch's girlfriend in 1975", "Lily's mother"], 1),
        tf('ch4-3', 'Mr Finch turns on the lamp every night.', true),
        mc('ch4-4', 'Where does Rose live now?', ['in London', 'in Port Bell', 'in Bristol'], 2),
      ],
    },
  ],
}
