import type { VideoCategory, VideoLesson } from '@/types'
import { gap, listenChoose, mc } from './helpers'

export const VIDEO_CATEGORIES: VideoCategory[] = ['Grammar', 'Vocabulary', 'Pronunciation', 'Speaking', 'Everyday English']

/**
 * Built-in animated video lessons: each scene is shown on screen while the
 * narration is read aloud by the browser. To use a real video instead, add
 * `youtubeId: '...'` or `videoUrl: '/videos/file.mp4'` to a lesson.
 */
export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'v1',
    title: 'Greetings & Goodbyes',
    category: 'Everyday English',
    emoji: '👋',
    description: 'Hello, hi, good morning, how are you, see you later.',
    gradient: 'from-violet-500 to-fuchsia-500',
    scenes: [
      { heading: 'Greetings & Goodbyes', big: '👋', narration: 'Hello and welcome! In this lesson you will learn how to say hello and goodbye in English.' },
      { heading: 'Saying hello', bullets: ['Hello! — for everyone', 'Hi! — for friends (informal)', 'Good morning / afternoon / evening'], narration: 'We say hello to everyone. Hi is informal — it is for friends. We also say good morning, good afternoon and good evening.' },
      {
        heading: 'Which greeting when?',
        table: { headers: ['Time', 'Greeting'], rows: [['before 12:00', 'Good morning'], ['12:00 – 18:00', 'Good afternoon'], ['after 18:00', 'Good evening'], ['going to bed', 'Good night']] },
        narration: 'Say good morning before twelve o’clock, good afternoon after lunch and good evening after six. Good night is only for going to bed!',
      },
      { heading: 'How are you?', examples: [{ en: 'How are you?', ru: 'Как дела?' }, { en: "I'm fine, thanks. And you?", ru: 'Хорошо, спасибо. А ты?' }, { en: 'Not bad!', ru: 'Неплохо!' }], narration: "After hello we often ask: How are you? A good answer is: I'm fine, thanks. And you?" },
      { heading: 'Saying goodbye', bullets: ['Goodbye!', 'Bye! / Bye-bye!', 'See you later!', 'See you tomorrow!', 'Have a nice day!'], narration: 'To say goodbye, you can say: goodbye, bye, see you later, see you tomorrow, or have a nice day!' },
      { heading: 'Well done!', big: '🎉', narration: 'Great job! Now answer a few questions about the video.' },
    ],
    quiz: [
      mc('v1-q1', 'What do you say at 9 a.m.?', ['Good morning', 'Good evening', 'Good night'], 0),
      mc('v1-q2', '"Good night" is for…', ['meeting people in the evening', 'going to bed', 'the afternoon'], 1),
      mc('v1-q3', 'How are you? — …', ["I'm fine, thanks.", "I'm 20.", "I'm from Italy."], 0),
      mc('v1-q4', 'Which greeting is informal?', ['Good afternoon', 'Hi!', 'Good evening'], 1),
    ],
  },
  {
    id: 'v2',
    title: 'The verb to be',
    category: 'Grammar',
    emoji: '🧱',
    description: 'am, is, are — positive, negative and questions.',
    gradient: 'from-blue-500 to-indigo-600',
    scenes: [
      { heading: 'Am, is, are', big: '🧱', narration: 'In this lesson we learn the verb to be: am, is and are.' },
      { heading: 'I am', examples: [{ en: 'I am a student.' }, { en: 'I am from Russia.' }, { en: "I'm happy." }], narration: "With I, we always use am. I am a student. The short form is I'm." },
      { heading: 'He / she / it is', examples: [{ en: 'He is a doctor.' }, { en: 'She is from Spain.' }, { en: 'It is cold.' }], narration: 'With he, she and it, we use is. She is from Spain. It is cold.' },
      { heading: 'You / we / they are', examples: [{ en: 'You are my friend.' }, { en: 'We are students.' }, { en: 'They are at home.' }], narration: 'With you, we and they, we use are. We are students.' },
      {
        heading: 'Negative and questions',
        table: { headers: ['+', '−', '?'], rows: [["I'm tired.", "I'm not tired.", 'Am I late?'], ["She's at home.", "She isn't at home.", 'Is she at home?'], ["They're here.", "They aren't here.", 'Are they here?']] },
        narration: 'Add not for negatives. For questions, put am, is or are at the start of the sentence.',
      },
      { heading: 'Remember!', body: 'Russian: «Я студент». English: I AM a student.', narration: 'Remember: in English the verb is always there. I am a student — never just I student!' },
    ],
    quiz: [
      gap('v2-q1', 'She ___ a teacher.', ['am', 'is', 'are'], 'is'),
      gap('v2-q2', 'We ___ from Kazakhstan.', ['am', 'is', 'are'], 'are'),
      mc('v2-q3', 'Choose the question.', ['Are you hungry?', 'You are hungry?', 'Is you hungry?'], 0),
      mc('v2-q4', 'Which is correct?', ['I student.', 'I am a student.', 'I is a student.'], 1),
    ],
  },
  {
    id: 'v3',
    title: 'Numbers 1–100',
    category: 'Vocabulary',
    emoji: '🔢',
    description: 'Count, say prices and hear the difference between 13 and 30.',
    gradient: 'from-amber-400 to-orange-500',
    scenes: [
      { heading: 'Numbers 1–100', big: '🔢', narration: "Let's learn English numbers from one to one hundred. You need them for prices, phone numbers and age." },
      { heading: '1 – 10', body: 'one, two, three, four, five, six, seven, eight, nine, ten', narration: 'One, two, three, four, five, six, seven, eight, nine, ten.' },
      { heading: '11 – 20', body: 'eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty', narration: 'Eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.' },
      {
        heading: 'Tens',
        table: { headers: ['Number', 'Word'], rows: [['30', 'thirty'], ['40', 'forty'], ['50', 'fifty'], ['60', 'sixty'], ['70', 'seventy'], ['80', 'eighty'], ['90', 'ninety'], ['100', 'one hundred']] },
        narration: 'Thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred. Be careful: forty has no letter u!',
      },
      { heading: 'Teen or ty?', examples: [{ en: 'thirTEEN — 13' }, { en: 'THIRty — 30' }, { en: 'fifTEEN — 15' }, { en: 'FIFty — 50' }], narration: 'Listen to the stress. Thirteen, thirty. Fifteen, fifty. In teen numbers the stress is at the end.' },
      { heading: 'Other numbers', examples: [{ en: '25 — twenty-five' }, { en: '48 — forty-eight' }, { en: '99 — ninety-nine' }], narration: 'For other numbers, put the two parts together: twenty-five, forty-eight, ninety-nine.' },
    ],
    quiz: [
      listenChoose('v3-q1', 'fifteen', ['15', '50', '5'], 0, 'Listen: which number?'),
      mc('v3-q2', 'How do you write 40?', ['fourty', 'forty', 'fortee'], 1),
      listenChoose('v3-q3', 'thirty', ['13', '30', '33'], 1, 'Listen: which number?'),
      mc('v3-q4', '27 = …', ['twenty-seven', 'seventy-two', 'seventeen'], 0),
    ],
  },
  {
    id: 'v4',
    title: 'Present Simple',
    category: 'Grammar',
    emoji: '🔁',
    description: 'Talk about habits and routines: I work, she works.',
    gradient: 'from-indigo-500 to-blue-600',
    scenes: [
      { heading: 'Present Simple', big: '🔁', narration: 'Present Simple is for habits, routines and facts.' },
      { heading: 'I / you / we / they', examples: [{ en: 'I work in an office.' }, { en: 'We live in Almaty.' }, { en: 'They play tennis.' }], narration: "With I, you, we and they, the verb doesn't change: I work, we live, they play." },
      { heading: 'He / she / it + s', examples: [{ en: 'She works in a bank.' }, { en: 'He lives in London.' }, { en: 'It rains a lot.' }], narration: 'With he, she and it, add s: she works, he lives.' },
      { heading: 'Spelling', table: { headers: ['Verb', 'he / she / it'], rows: [['go', 'goes'], ['watch', 'watches'], ['study', 'studies'], ['have', 'has']] }, narration: 'Some verbs change a little: go — goes, watch — watches, study — studies, have — has.' },
      { heading: 'Negative', examples: [{ en: "I don't like coffee." }, { en: "She doesn't eat meat." }], narration: "For negatives use don't or doesn't. After doesn't, there is no s: she doesn't eat." },
      { heading: 'Questions', examples: [{ en: 'Do you like music? — Yes, I do.' }, { en: "Does he work here? — No, he doesn't." }], narration: 'Questions start with do or does. Do you like music? Yes, I do.' },
    ],
    quiz: [
      gap('v4-q1', 'He ___ in a hospital.', ['work', 'works'], 'works'),
      gap('v4-q2', '___ you speak English?', ['Do', 'Does'], 'Do'),
      mc('v4-q3', 'Choose the correct sentence.', ["She doesn't like tea.", "She don't like tea.", "She doesn't likes tea."], 0),
      gap('v4-q4', 'My sister ___ TV every evening.', ['watchs', 'watches', 'watch'], 'watches'),
    ],
  },
  {
    id: 'v5',
    title: 'The TH sound',
    category: 'Pronunciation',
    emoji: '👅',
    description: 'think, three, this, mother — practise the famous TH.',
    gradient: 'from-rose-500 to-orange-400',
    scenes: [
      { heading: 'The TH sound', big: '👅', narration: "The TH sound is difficult for many learners. Let's practise it together!" },
      { heading: 'How to make it', bullets: ['Put your tongue between your teeth', 'Blow air out gently', 'Don’t say s, f or z!'], narration: "Put your tongue between your teeth and blow air out gently. Don't say s or f." },
      { heading: 'Voiceless /θ/', examples: [{ en: 'think' }, { en: 'three' }, { en: 'thank you' }, { en: 'Thursday' }], narration: 'First, the quiet TH: think, three, thank you, Thursday.' },
      { heading: 'Voiced /ð/', examples: [{ en: 'this' }, { en: 'that' }, { en: 'mother' }, { en: 'brother' }], narration: 'Now the voiced TH, with your voice on: this, that, mother, brother.' },
      { heading: 'Compare', examples: [{ en: 'think — sink' }, { en: 'three — tree' }, { en: 'they — day' }], narration: 'Listen and compare: think, sink. Three, tree. They, day.' },
      { heading: 'Tongue twister', body: 'I think three thousand thoughts on Thursday.', narration: 'Try this one: I think three thousand thoughts on Thursday!' },
    ],
    quiz: [
      mc('v5-q1', 'Where is your tongue for TH?', ['behind your teeth', 'between your teeth', 'on your lips'], 1),
      listenChoose('v5-q2', 'three', ['three', 'tree', 'free'], 0, 'Which word did you hear?'),
      mc('v5-q3', 'Which word has the voiced /ð/ sound?', ['think', 'mother', 'three'], 1),
    ],
  },
  {
    id: 'v6',
    title: 'Ship or sheep?',
    category: 'Pronunciation',
    emoji: '🐑',
    description: 'Short /ɪ/ and long /iː/ change the meaning.',
    gradient: 'from-teal-500 to-emerald-500',
    scenes: [
      { heading: 'Ship or sheep?', big: '🚢 🐑', narration: 'In English, short and long vowels change the meaning of a word. Ship or sheep?' },
      { heading: 'Short /ɪ/', examples: [{ en: 'ship' }, { en: 'live' }, { en: 'sit' }, { en: 'it' }], narration: 'The short i: ship, live, sit, it. It is quick and relaxed.' },
      { heading: 'Long /iː/', examples: [{ en: 'sheep' }, { en: 'leave' }, { en: 'seat' }, { en: 'eat' }], narration: 'The long ee: sheep, leave, seat, eat. Smile and make it long.' },
      { heading: 'Pairs', table: { headers: ['Short /ɪ/', 'Long /iː/'], rows: [['ship', 'sheep'], ['live', 'leave'], ['sit', 'seat'], ['fill', 'feel']] }, narration: 'Listen to the pairs: ship, sheep. Live, leave. Sit, seat. Fill, feel.' },
      { heading: 'In sentences', examples: [{ en: 'I live in Paris.' }, { en: 'Please leave now.' }, { en: 'Sit in this seat.' }], narration: 'I live in Paris. Please leave now. Sit in this seat.' },
    ],
    quiz: [
      listenChoose('v6-q1', 'sheep', ['ship', 'sheep'], 1, 'Which word did you hear?'),
      listenChoose('v6-q2', 'live', ['live', 'leave'], 0, 'Which word did you hear?'),
      mc('v6-q3', 'Which word has a long sound?', ['sit', 'seat', 'it'], 1),
    ],
  },
  {
    id: 'v7',
    title: 'How to introduce yourself',
    category: 'Speaking',
    emoji: '🙋',
    description: 'Five simple sentences about you.',
    gradient: 'from-pink-500 to-rose-500',
    scenes: [
      { heading: 'Introduce yourself', big: '🙋', narration: "In this lesson you'll learn to introduce yourself in five simple sentences." },
      { heading: 'Step 1: Your name', examples: [{ en: 'My name is Alex.' }, { en: "I'm Alex." }], narration: "Start with your name: My name is Alex. Or: I'm Alex." },
      { heading: 'Step 2: Age and country', examples: [{ en: "I'm 19 years old." }, { en: "I'm from Kazakhstan." }, { en: 'I live in Astana.' }], narration: "Then say your age and where you are from: I'm nineteen years old. I'm from Kazakhstan." },
      { heading: 'Step 3: Job or study', examples: [{ en: "I'm a student." }, { en: 'I work in a bank.' }], narration: "Say what you do: I'm a student. Or: I work in a bank." },
      { heading: 'Step 4: Things you like', examples: [{ en: 'I like music and football.' }, { en: 'My hobby is drawing.' }], narration: 'Finally, talk about what you like: I like music and football.' },
      { heading: 'Your turn!', body: "My name is… I'm … years old. I'm from… I'm a… I like…", narration: "Now it's your turn! Use these five sentences and introduce yourself." },
    ],
    quiz: [
      mc('v7-q1', 'What do you say first?', ['My name is…', 'Goodbye!', 'How much is it?'], 0),
      mc('v7-q2', 'Choose the correct sentence.', ['I have 19 years.', "I'm 19 years old.", 'I 19 years old.'], 1),
      gap('v7-q3', 'I ___ in a bank.', ['work', 'works', 'am work'], 'work'),
    ],
  },
  {
    id: 'v8',
    title: 'Ordering at a café',
    category: 'Speaking',
    emoji: '☕',
    description: 'Can I have…? How much is it? Polite phrases.',
    gradient: 'from-amber-500 to-rose-500',
    scenes: [
      { heading: 'At the café', big: '☕', narration: "Let's learn how to order food and drinks in a café." },
      { heading: 'Ordering', examples: [{ en: 'Can I have a coffee, please?' }, { en: "I'd like a cheese sandwich, please." }], narration: "Use can I have, or I'd like — and always say please!" },
      { heading: 'The waiter asks', examples: [{ en: 'What can I get you?' }, { en: 'Anything else?' }, { en: 'Small or large?' }], narration: 'The waiter may ask: What can I get you? Anything else? Small or large?' },
      { heading: 'Paying', examples: [{ en: 'How much is it?' }, { en: "That's four pounds fifty." }, { en: 'Can I pay by card?' }], narration: 'To pay, ask: How much is it? Can I pay by card?' },
      { heading: 'Polite words', bullets: ['please', 'thank you', 'excuse me', 'Here you are.'], narration: 'Remember the polite words: please, thank you, excuse me, here you are.' },
    ],
    quiz: [
      mc('v8-q1', 'Which is polite?', ['Give me coffee.', 'Can I have a coffee, please?', 'Coffee now.'], 1),
      mc('v8-q2', 'The waiter says "Anything else?". You don’t want more. You say…', ['No, thank you.', 'Yes, I am.', 'Here you are.'], 0),
      mc('v8-q3', 'How do you ask about the price?', ['How many is it?', 'How much is it?', 'What is price?'], 1),
    ],
  },
  {
    id: 'v9',
    title: 'Family words',
    category: 'Vocabulary',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Mum, dad, grandparents, aunt, uncle and cousin.',
    gradient: 'from-emerald-500 to-teal-600',
    scenes: [
      { heading: 'My family', big: '👨‍👩‍👧‍👦', narration: "Let's learn family words." },
      { heading: 'Parents', examples: [{ en: 'mother — mum', ru: 'мама' }, { en: 'father — dad', ru: 'папа' }, { en: 'parents', ru: 'родители' }], narration: 'Mother, or mum. Father, or dad. Together they are your parents.' },
      { heading: 'Children', examples: [{ en: 'son', ru: 'сын' }, { en: 'daughter', ru: 'дочь' }, { en: 'brother', ru: 'брат' }, { en: 'sister', ru: 'сестра' }], narration: 'Son and daughter. Brother and sister.' },
      { heading: 'Grandparents', examples: [{ en: 'grandmother — grandma', ru: 'бабушка' }, { en: 'grandfather — grandpa', ru: 'дедушка' }], narration: 'Grandmother, or grandma. Grandfather, or grandpa.' },
      { heading: 'Other relatives', examples: [{ en: 'aunt', ru: 'тётя' }, { en: 'uncle', ru: 'дядя' }, { en: 'cousin', ru: 'двоюродный брат / сестра' }], narration: 'Aunt, uncle and cousin.' },
      { heading: 'Talk about your family', examples: [{ en: 'I have one brother and two sisters.' }, { en: "My mum's name is Sara." }], narration: "Now you can say: I have one brother and two sisters. My mum's name is Sara." },
    ],
    quiz: [
      mc('v9-q1', "Your mother's mother is your…", ['aunt', 'grandmother', 'sister'], 1),
      mc('v9-q2', "Your father's brother is your…", ['uncle', 'cousin', 'son'], 0),
      mc('v9-q3', '"Daughter" means…', ['сын', 'дочь', 'тётя'], 1),
      mc('v9-q4', 'Mother + father = …', ['parents', 'children', 'cousins'], 0),
    ],
  },
  {
    id: 'v10',
    title: 'Asking for directions',
    category: 'Everyday English',
    emoji: '🗺️',
    description: 'Excuse me, where is…? Turn left, go straight on.',
    gradient: 'from-sky-500 to-indigo-500',
    scenes: [
      { heading: 'Asking for directions', big: '🗺️', narration: "Lost in a new city? Let's learn how to ask for directions." },
      { heading: 'Asking', examples: [{ en: 'Excuse me, where is the station?' }, { en: 'Is there a bank near here?' }, { en: 'How do I get to the museum?' }], narration: 'Start with excuse me. Then ask: Where is the station? Is there a bank near here?' },
      { heading: 'Directions', examples: [{ en: 'Go straight on. ⬆️' }, { en: 'Turn left. ⬅️' }, { en: 'Turn right. ➡️' }, { en: "It's on the corner." }], narration: "Listen: go straight on, turn left, turn right. It's on the corner." },
      { heading: 'Places', examples: [{ en: "It's next to the bank." }, { en: "It's opposite the park." }, { en: "It's between the café and the shop." }], narration: "It's next to the bank. It's opposite the park. It's between the café and the shop." },
      { heading: 'Saying thank you', examples: [{ en: 'Thank you very much!' }, { en: "You're welcome." }], narration: "Always say thank you! And the answer is: you're welcome." },
    ],
    quiz: [
      mc('v10-q1', 'How do you start politely?', ['Hey you!', 'Excuse me,', 'Listen!'], 1),
      mc('v10-q2', '⬅️ means…', ['turn left', 'turn right', 'go straight on'], 0),
      mc('v10-q3', 'Thank you! — …', ["You're welcome.", 'Excuse me.', "I'm sorry."], 0),
    ],
  },
  {
    id: 'v11',
    title: 'There is / There are',
    category: 'Grammar',
    emoji: '🏠',
    description: 'Describe a room, a house or a city.',
    gradient: 'from-cyan-500 to-blue-500',
    scenes: [
      { heading: 'There is / There are', big: '🏠', narration: "Let's learn how to describe a room or a city with there is and there are." },
      { heading: 'There is + one thing', examples: [{ en: 'There is a bed in my room.' }, { en: "There's a park near my house." }], narration: 'For one thing, say there is. There is a bed in my room.' },
      { heading: 'There are + many', examples: [{ en: 'There are two windows.' }, { en: 'There are some books on the shelf.' }], narration: 'For two or more things, say there are. There are two windows.' },
      { heading: 'Negative', examples: [{ en: "There isn't a TV." }, { en: "There aren't any shops." }], narration: "For negatives: there isn't, there aren't." },
      { heading: 'Questions', examples: [{ en: 'Is there a bathroom? — Yes, there is.' }, { en: "Are there any cafés? — No, there aren't." }], narration: "Questions: is there? are there? Yes, there is. No, there aren't." },
    ],
    quiz: [
      gap('v11-q1', '___ a sofa in the living room.', ['There is', 'There are'], 'There is'),
      gap('v11-q2', '___ three bedrooms.', ['There is', 'There are'], 'There are'),
      mc('v11-q3', 'Is there a garden? — …', ['Yes, there is.', 'Yes, it is.', 'Yes, there are.'], 0),
    ],
  },
  {
    id: 'v12',
    title: "Can and can't",
    category: 'Grammar',
    emoji: '💪',
    description: 'Talk about abilities and ask for permission.',
    gradient: 'from-lime-500 to-emerald-600',
    scenes: [
      { heading: "Can and can't", big: '💪', narration: 'We use can for things we are able to do.' },
      { heading: 'Positive', examples: [{ en: 'I can swim.' }, { en: 'She can play the piano.' }], narration: 'I can swim. She can play the piano. There is no s after can!' },
      { heading: 'Negative', examples: [{ en: "I can't drive." }, { en: "Penguins can't fly." }], narration: "The negative is can't. I can't drive. Penguins can't fly." },
      { heading: 'Questions', examples: [{ en: 'Can you dance? — Yes, I can.' }, { en: "Can he cook? — No, he can't." }], narration: "Questions: Can you dance? Yes, I can. No, I can't." },
      { heading: 'Requests', examples: [{ en: 'Can I open the window?' }, { en: 'Can you help me, please?' }], narration: 'We also use can to ask for things: Can you help me, please?' },
    ],
    quiz: [
      mc('v12-q1', 'Which is correct?', ['He can sings.', 'He can sing.', 'He cans sing.'], 1),
      gap('v12-q2', 'Fish ___ fly.', ['can', "can't"], "can't"),
      mc('v12-q3', 'Can you swim? — …', ['Yes, I can.', 'Yes, I do.', 'Yes, I am.'], 0),
    ],
  },
  {
    id: 'v13',
    title: 'Past Simple',
    category: 'Grammar',
    emoji: '⌛',
    description: 'Yesterday, last week: worked, went, was.',
    gradient: 'from-purple-500 to-indigo-600',
    scenes: [
      { heading: 'Past Simple', big: '⌛', narration: 'Past Simple is for finished actions: yesterday, last week, last year.' },
      { heading: 'Regular verbs + ed', examples: [{ en: 'I worked yesterday.' }, { en: 'We played football.' }, { en: 'She watched a film.' }], narration: 'Most verbs add e d: worked, played, watched.' },
      { heading: 'Irregular verbs', table: { headers: ['Verb', 'Past'], rows: [['go', 'went'], ['have', 'had'], ['see', 'saw'], ['eat', 'ate'], ['buy', 'bought']] }, narration: 'Some verbs are irregular: go, went. Have, had. See, saw. Eat, ate. Buy, bought.' },
      { heading: 'was / were', examples: [{ en: 'I was tired.' }, { en: 'They were at home.' }], narration: 'The past of be is was and were. I was tired. They were at home.' },
      { heading: 'Negative and questions', examples: [{ en: "I didn't go out." }, { en: 'Did you like it? — Yes, I did.' }], narration: "Make negatives with didn't and questions with did. The verb stays simple: I didn't go." },
    ],
    quiz: [
      gap('v13-q1', 'Yesterday I ___ to the park.', ['go', 'went', 'goed'], 'went'),
      gap('v13-q2', 'We ___ at home last night.', ['was', 'were'], 'were'),
      mc('v13-q3', 'Choose the correct question.', ['Did you see it?', 'Did you saw it?', 'You did see it?'], 0),
      mc('v13-q4', 'The past of "buy" is…', ['buyed', 'bought', 'boughted'], 1),
    ],
  },
]

export function getVideo(id: string) {
  return VIDEO_LESSONS.find((v) => v.id === id)
}

/** Rough duration of the narration (≈ 130 words per minute + pauses). */
export function videoMinutes(v: VideoLesson): number {
  const words = v.scenes.reduce((n, s) => n + s.narration.split(/\s+/).length, 0)
  return Math.max(1, Math.round(words / 130 + v.scenes.length * 0.1))
}
