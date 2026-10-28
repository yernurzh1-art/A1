import type { DialogLine, Exercise, FinalSection, SpeakingItem, WritingTask } from '@/types'
import { gap, listenChoose, match, mc, tf } from './helpers'

export const FINAL_SECTIONS: { key: FinalSection; label: string; emoji: string; description: string }[] = [
  { key: 'grammar', label: 'Grammar', emoji: '🧩', description: '10 questions on all A1 grammar' },
  { key: 'vocabulary', label: 'Vocabulary', emoji: '📚', description: '10 questions on A1 words' },
  { key: 'reading', label: 'Reading', emoji: '📖', description: 'A short text and 5 questions' },
  { key: 'listening', label: 'Listening', emoji: '🎧', description: 'A dialogue and 5 questions' },
  { key: 'writing', label: 'Writing', emoji: '✍️', description: 'A short email (40+ words)' },
  { key: 'speaking', label: 'Speaking', emoji: '🎤', description: '3 questions — answer aloud' },
]

export const PASS_SCORE = 60

export const FINAL_GRAMMAR: Exercise[] = [
  gap('ft-g1', 'My parents ___ teachers.', ['is', 'am', 'are'], 'are'),
  gap('ft-g2', 'She ___ two brothers.', ['have', 'has'], 'has'),
  gap('ft-g3', 'Tom ___ in a bank.', ['work', 'works', 'working'], 'works'),
  gap('ft-g4', '___ a cinema near my house.', ['There is', 'There are'], 'There is'),
  mc('ft-g5', 'Choose the correct sentence.', ['She can swims.', 'She can swim.', 'She cans swim.'], 1),
  gap('ft-g6', 'Look! It ___ raining.', ['is', 'are', 'does'], 'is'),
  gap('ft-g7', 'Last weekend we ___ to the sea.', ['go', 'went', 'goes'], 'went'),
  gap('ft-g8', 'I have ___ orange and a banana.', ['a', 'an', 'the'], 'an'),
  gap('ft-g9', 'My birthday is ___ Friday.', ['on', 'in', 'at'], 'on'),
  mc('ft-g10', 'Choose the correct question.', ['Where do you live?', 'Where you live?', 'Where does you live?'], 0),
]

export const FINAL_VOCABULARY: Exercise[] = [
  mc('ft-v1', 'What is this?', ['kitchen', 'umbrella', 'jacket'], 1, undefined, { emoji: '☂️', prompt: 'Choose the right word' }),
  mc('ft-v2', 'Your father’s mother is your…', ['aunt', 'grandmother', 'daughter'], 1),
  mc('ft-v3', '«Завтрак» in English is…', ['dinner', 'lunch', 'breakfast'], 2),
  listenChoose('ft-v4', 'Thursday', ['Tuesday', 'Thursday', 'Saturday'], 1, 'Listen and choose the word'),
  mc('ft-v5', 'Where do you buy food?', ['at the supermarket', 'at the hospital', 'at the museum'], 0),
  match('ft-v6', [['🐶', 'dog'], ['🚲', 'bike'], ['🍞', 'bread'], ['👗', 'dress']], 'Match the pictures with the words'),
  mc('ft-v7', 'It’s ❄️ and the temperature is −10°C. It’s very…', ['hot', 'cold', 'sunny'], 1),
  mc('ft-v8', 'The opposite of "old" (for things) is…', ['new', 'big', 'tall'], 0),
  gap('ft-v9', 'I ___ my teeth every morning.', ['brush', 'wash', 'make'], 'brush'),
  mc('ft-v10', 'A person who works in a hospital and helps sick people is a…', ['pilot', 'doctor', 'farmer'], 1),
]

export const FINAL_READING = {
  title: "Daniel's life",
  paragraphs: [
    'My name is Daniel. I am 32 years old and I am a doctor. I live in a flat in Glasgow, Scotland, with my wife Clara and our two children.',
    'Every day I get up at half past six and go to work by tram. Clara is a teacher. In the evening we cook dinner together.',
    'At the weekend we often go to the mountains. Last summer we went to Italy. It was hot and sunny, and the children loved the food!',
  ],
  exercises: [
    tf('ft-r1', 'Daniel is a teacher.', false, 'Daniel is a doctor. Clara is a teacher.'),
    mc('ft-r2', 'How does Daniel go to work?', ['by car', 'by tram', 'on foot'], 1),
    mc('ft-r3', 'How many children do they have?', ['one', 'two', 'three'], 1),
    tf('ft-r4', 'They often go to the mountains at the weekend.', true),
    mc('ft-r5', 'Where did they go last summer?', ['Spain', 'Scotland', 'Italy'], 2),
  ] as Exercise[],
}

export const FINAL_LISTENING: { title: string; lines: DialogLine[]; exercises: Exercise[] } = {
  title: 'At the hotel',
  lines: [
    { speaker: 'Receptionist', text: 'Good evening! Welcome to the Sea View Hotel.' },
    { speaker: 'Olga', text: 'Good evening. I have a reservation. My name is Olga Petrova.' },
    { speaker: 'Receptionist', text: 'Let me see… Yes, a single room for three nights.' },
    { speaker: 'Olga', text: "That's right." },
    { speaker: 'Receptionist', text: 'Your room is number two one four, on the second floor. Here is your key.' },
    { speaker: 'Olga', text: 'Thank you. What time is breakfast?' },
    { speaker: 'Receptionist', text: 'Breakfast is from seven to ten in the restaurant.' },
    { speaker: 'Olga', text: 'Great. Is there Wi-Fi in the room?' },
    { speaker: 'Receptionist', text: 'Yes, there is. The password is on the card.' },
    { speaker: 'Olga', text: 'Perfect. Thank you very much!' },
  ],
  exercises: [
    mc('ft-l1', 'How many nights is Olga staying?', ['two', 'three', 'four'], 1),
    mc('ft-l2', 'What is her room number?', ['204', '214', '240'], 1),
    gap('ft-l3', 'Breakfast is from seven to ___.', ['nine', 'ten', 'eleven'], 'ten', undefined, 'Fill in the missing word'),
    tf('ft-l4', 'There is no Wi-Fi in the room.', false, 'Yes, there is Wi-Fi.'),
    mc('ft-l5', 'Where is the Wi-Fi password?', ['on the card', 'on the door', 'in the restaurant'], 0),
  ],
}

export const FINAL_WRITING: WritingTask = {
  id: 'ft-w',
  title: 'An email to a new pen friend',
  emoji: '✉️',
  prompt: 'Write an email to a new pen friend (40+ words). Introduce yourself, your family, your day and your hobbies. Tell them one thing you did last weekend.',
  promptRu: 'Напиши письмо новому другу по переписке (40+ слов): о себе, семье, своём дне и хобби. Расскажи, что ты делал(а) в прошлые выходные.',
  minWords: 40,
  minSentences: 6,
  hints: ['Hi …!', 'My name is… I am…', 'I live in… with my…', 'Every day I…', 'In my free time I…', 'Last weekend I…'],
  checks: [
    { label: 'Introduce yourself', pattern: "\\b(my name is|i'?m|i am)\\b" },
    { label: 'Talk about your family', pattern: '\\b(mother|father|parents|sister|brother|family|wife|husband|son|daughter|mum|dad)\\b' },
    { label: 'Present Simple (I live / I work…)', pattern: '\\bi (live|work|study|get up|go|like|love|have)\\b' },
    { label: 'Past Simple (last weekend I went…)', pattern: '\\b(went|visited|was|were|had|saw|watched|played|cooked|stayed|met)\\b' },
  ],
  keywords: ['name', 'live', 'family', 'work', 'study', 'like', 'free time', 'weekend'],
  example:
    'Hi Emma! My name is Aigerim and I am 21 years old. I live in Almaty with my parents and my younger sister. I am a student. Every day I get up at seven and go to university by bus. In my free time I read books and play volleyball. Last weekend I visited my grandmother and we cooked a big dinner. Write soon!',
}

export const FINAL_SPEAKING: SpeakingItem[] = [
  { prompt: 'Introduce yourself: your name, age, city and job.', keywords: [['name', 'i am', "i'm"], ['live', 'from'], ['student', 'work', 'job', 'years']], minWords: 12, sample: "My name is Alex. I'm 19 years old. I live in Astana and I'm a student." },
  { prompt: 'Describe your home.', keywords: [['live', 'flat', 'house', 'home'], ['there is', 'there are', 'room', 'kitchen', 'bedroom']], minWords: 10, sample: 'I live in a flat. There are two bedrooms, a kitchen and a living room.' },
  { prompt: 'What did you do last weekend?', keywords: [['went', 'visited', 'watched', 'played', 'was', 'were', 'had', 'cooked', 'met', 'stayed', 'saw']], minWords: 8, sample: 'Last weekend I visited my friends. We watched a film and had pizza.' },
]
