import type { GrammarTopic } from '@/types'
import { build, gap, mc, tf, typeIn } from './helpers'

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  /* 1 ------------------------------------------------------------- */
  {
    id: 'subject-pronouns',
    title: 'Subject pronouns',
    titleRu: 'Личные местоимения',
    emoji: '👤',
    summary: 'I, you, he, she, it, we, they — words that replace names.',
    explanation: [
      'A pronoun replaces a name: Anna → she, Tom → he.',
      'I is always written with a capital letter.',
      'Use it for things and animals: the book → it.',
      'You is the same for one person and for many people.',
    ],
    explanationRu: [
      'Местоимение заменяет имя: Anna → she (она), Tom → he (он).',
      '«I» (я) всегда пишется с большой буквы — даже в середине предложения.',
      '«It» используем для предметов и животных: the phone → it.',
      '«You» — это и «ты», и «вы».',
    ],
    tables: [
      {
        headers: ['Pronoun', 'Русский', 'Example'],
        rows: [
          ['I', 'я', 'I am Alex.'],
          ['you', 'ты / вы', 'You are my friend.'],
          ['he', 'он', 'He is a doctor.'],
          ['she', 'она', 'She is from Italy.'],
          ['it', 'оно (вещь, животное)', 'It is a cat.'],
          ['we', 'мы', 'We are students.'],
          ['they', 'они', 'They are at home.'],
        ],
      },
    ],
    examples: [
      { en: 'Tom is my brother. He is ten.', ru: 'Том — мой брат. Ему десять.' },
      { en: 'This is my phone. It is new.', ru: 'Это мой телефон. Он новый.' },
      { en: 'Anna and I are friends. We are students.', ru: 'Анна и я — друзья. Мы студенты.' },
      { en: 'Where are your parents? They are at work.', ru: 'Где твои родители? Они на работе.' },
    ],
    mistakes: [
      { wrong: 'i am a student.', right: 'I am a student.' },
      { wrong: 'My mother she is a teacher.', right: 'My mother is a teacher.' },
      { wrong: 'The book is good. He is interesting.', right: 'The book is good. It is interesting.' },
    ],
    practice: [
      gap('g-sp-p1', 'Tom is my friend. ___ is from London.', ['He', 'She', 'It'], 'He', 'Tom is a man → he.'),
      gap('g-sp-p2', 'Anna is a doctor. ___ works in a hospital.', ['He', 'She', 'They'], 'She', 'Anna is a woman → she.'),
      gap('g-sp-p3', 'My phone is new. ___ is black.', ['He', 'It', 'We'], 'It', 'Things → it.'),
      gap('g-sp-p4', 'Ben and I are friends. ___ are students.', ['We', 'They', 'You'], 'We', 'Ben and I = we.'),
      gap('g-sp-p5', 'Lisa and Mark are at home. ___ are happy.', ['We', 'They', 'He'], 'They', 'Lisa and Mark = they.'),
      mc('g-sp-p6', 'Which word is ALWAYS written with a capital letter?', ['I', 'you', 'we', 'they'], 0, '"I" is always capital: I am, I like, I live.'),
    ],
    test: [
      mc('g-sp-t1', 'The cat is hungry. ___ wants fish.', ['It', 'He', 'They'], 0, 'Animals → it (or he/she for your own pet).'),
      gap('g-sp-t2', 'My parents are teachers. ___ work at a school.', ['They', 'We', 'She'], 'They', 'My parents = they.'),
      mc('g-sp-t3', 'Replace the name: "Maria is from Spain."', ['She is from Spain.', 'He is from Spain.', 'It is from Spain.'], 0, 'Maria → she.'),
      mc('g-sp-t4', 'My brother and I = ?', ['we', 'they', 'you'], 0, '… and I = we.'),
      tf('g-sp-t5', '"You" can mean one person or many people.', true, 'You = ты and вы.'),
    ],
  },

  /* 2 ------------------------------------------------------------- */
  {
    id: 'verb-to-be',
    title: 'Verb to be: am / is / are',
    titleRu: 'Глагол to be',
    emoji: '🧱',
    summary: 'am, is, are — the most important verb in English.',
    explanation: [
      'I → am. He / she / it → is. You / we / they → are.',
      "Short forms: I'm, you're, he's, she's, it's, we're, they're.",
      "Negative: add not → I'm not, he isn't, they aren't.",
      'Question: put the verb first → Are you a student? Is she from Italy?',
    ],
    explanationRu: [
      'В русском «быть» в настоящем времени пропускается: «Я студент». В английском глагол нужен всегда: I am a student.',
      'I → am; he / she / it → is; you / we / they → are.',
      'Отрицание: добавляем not (I am not, she is not / isn’t).',
      'Вопрос: ставим am / is / are в начало (Are you…? Is he…?).',
    ],
    tables: [
      {
        caption: 'Positive',
        headers: ['Subject', 'to be', 'Short form', 'Example'],
        rows: [
          ['I', 'am', "I'm", "I'm a student."],
          ['he / she / it', 'is', "he's / she's / it's", "She's from Italy."],
          ['you / we / they', 'are', "you're / we're / they're", "We're friends."],
        ],
      },
      {
        caption: 'Negative and questions',
        headers: ['Negative', 'Question', 'Short answer'],
        rows: [
          ["I'm not tired.", 'Am I late?', 'Yes, you are. / No, you aren’t.'],
          ["She isn't at home.", 'Is she a doctor?', 'Yes, she is. / No, she isn’t.'],
          ["They aren't students.", 'Are they from Spain?', 'Yes, they are. / No, they aren’t.'],
        ],
      },
    ],
    examples: [
      { en: 'I am a student.', ru: 'Я студент.' },
      { en: 'She is from Italy.', ru: 'Она из Италии.' },
      { en: 'We are not tired.', ru: 'Мы не устали.' },
      { en: 'Are you hungry?', ru: 'Ты голоден?' },
      { en: 'Is it cold today?', ru: 'Сегодня холодно?' },
    ],
    mistakes: [
      { wrong: 'I is a student.', right: 'I am a student.' },
      { wrong: 'She are my friend.', right: 'She is my friend.' },
      { wrong: 'I student.', right: 'I am a student.' },
      { wrong: 'You is late.', right: 'You are late.' },
    ],
    practice: [
      gap('g-be-p1', 'I ___ a student.', ['am', 'is', 'are'], 'am', 'I → am.'),
      gap('g-be-p2', 'She ___ from Italy.', ['am', 'is', 'are'], 'is', 'She → is.'),
      gap('g-be-p3', 'We ___ friends.', ['am', 'is', 'are'], 'are', 'We → are.'),
      gap('g-be-p4', 'It ___ cold today.', ['am', 'is', 'are'], 'is', 'It → is.'),
      gap('g-be-p5', 'They ___ not at home.', ['am', 'is', 'are'], 'are', 'They → are.'),
      build('g-be-p6', 'Are you a student?', 'Ты студент?', 'Questions start with am / is / are.'),
      mc('g-be-p7', 'Choose the correct negative: "He is a teacher."', ["He isn't a teacher.", "He aren't a teacher.", 'He not is a teacher.'], 0, 'He is → he is not → he isn’t.'),
    ],
    test: [
      gap('g-be-t1', 'My name ___ Anna.', ['am', 'is', 'are'], 'is', 'My name = it → is.'),
      gap('g-be-t2', 'You ___ my best friend.', ['am', 'is', 'are'], 'are', 'You → are.'),
      mc('g-be-t3', 'Which is correct?', ["I'm 20 years old.", 'I have 20 years.', 'I is 20 years old.'], 0, 'Age uses "be" in English: I am 20 (years old).'),
      gap('g-be-t4', '___ he a doctor? — Yes, he is.', ['Is', 'Are', 'Am'], 'Is', 'He → is. In questions it goes first.'),
      tf('g-be-t5', '"They is happy" is correct.', false, 'They → are: They are happy.'),
    ],
  },

  /* 3 ------------------------------------------------------------- */
  {
    id: 'possessive-adjectives',
    title: 'Possessive adjectives',
    titleRu: 'Притяжательные местоимения',
    emoji: '🏷️',
    summary: 'my, your, his, her, its, our, their — whose is it?',
    explanation: [
      'They show who something belongs to: my book, her bag.',
      'They come before a noun: my name, your phone.',
      'They never change: my brother, my brothers.',
      'his = a man, her = a woman, its = a thing or an animal.',
    ],
    explanationRu: [
      'Отвечают на вопрос «чей?»: my book — моя книга.',
      'Стоят перед существительным и не меняются по родам и числам: my sister, my sisters.',
      'his — его (о мужчине), her — её (о женщине), its — его / её (о предмете или животном).',
      'Не путай: its (его) и it’s (= it is).',
    ],
    tables: [
      {
        headers: ['Pronoun', 'Possessive', 'Русский', 'Example'],
        rows: [
          ['I', 'my', 'мой', 'My name is Alex.'],
          ['you', 'your', 'твой / ваш', "What's your name?"],
          ['he', 'his', 'его', 'His car is red.'],
          ['she', 'her', 'её', 'Her bag is new.'],
          ['it', 'its', 'его / её (вещь)', 'The dog is in its bed.'],
          ['we', 'our', 'наш', 'Our house is big.'],
          ['they', 'their', 'их', 'Their children are at school.'],
        ],
      },
    ],
    examples: [
      { en: 'My name is Anna.', ru: 'Меня зовут Анна.' },
      { en: 'What is your phone number?', ru: 'Какой у тебя номер телефона?' },
      { en: 'This is Tom. His sister is a nurse.', ru: 'Это Том. Его сестра — медсестра.' },
      { en: 'We love our teacher.', ru: 'Мы любим нашего учителя.' },
      { en: 'They live with their parents.', ru: 'Они живут со своими родителями.' },
    ],
    mistakes: [
      { wrong: 'She is my sister. His name is Kate.', right: 'She is my sister. Her name is Kate.' },
      { wrong: 'What is you name?', right: 'What is your name?' },
      { wrong: 'Is this they car?', right: 'Is this their car?' },
    ],
    practice: [
      gap('g-pa-p1', 'I am Alex. ___ name is Alex.', ['My', 'Your', 'His'], 'My', 'I → my.'),
      gap('g-pa-p2', 'This is Kate. ___ brother is a pilot.', ['Her', 'His', 'Its'], 'Her', 'Kate is a woman → her.'),
      gap('g-pa-p3', 'This is Ben. ___ sister is twelve.', ['His', 'Her', 'Their'], 'His', 'Ben is a man → his.'),
      gap('g-pa-p4', 'We live in Rome. ___ flat is small.', ['Our', 'Their', 'Your'], 'Our', 'We → our.'),
      gap('g-pa-p5', 'What is ___ name? — My name is Lena.', ['your', 'you', "you're"], 'your', 'you → your.'),
      gap('g-pa-p6', 'The children are with ___ teacher.', ['their', 'they', 'there'], 'their', 'they → their.'),
    ],
    test: [
      mc('g-pa-t1', 'Mr Brown has a car. ___ car is blue.', ['His', 'Her', 'Its'], 0, 'Mr Brown → his.'),
      gap('g-pa-t2', 'Anna and Tom have a dog. ___ dog is white.', ['Their', 'Our', 'His'], 'Their', 'Anna and Tom = they → their.'),
      mc('g-pa-t3', 'The cat is eating. ___ food is in the bowl.', ['Its', "It's", 'His'], 0, "its = possessive; it's = it is."),
      gap('g-pa-t4', 'I love ___ family.', ['my', 'me', 'I'], 'my', 'I → my.'),
      tf('g-pa-t5', '"Her" is used for a woman: Maria and her mother.', true),
    ],
  },

  /* 4 ------------------------------------------------------------- */
  {
    id: 'articles',
    title: 'Articles: a / an / the',
    titleRu: 'Артикли',
    emoji: '📰',
    summary: 'a / an = one of many; the = a specific thing.',
    explanation: [
      'Use a before a consonant sound: a cat, a book, a university.',
      'Use an before a vowel sound (a, e, i, o, u): an apple, an egg, an hour.',
      'Use the when we know which one: the sun, the door of my room.',
      'No article for things in general: I like cats. I drink milk.',
    ],
    explanationRu: [
      'В русском артиклей нет, а в английском они очень важны.',
      'a / an — «какой-то, один из»: I have a dog. An — перед гласным звуком: an apple.',
      'the — «тот самый, конкретный»: The dog is in the garden.',
      'С именами людей и большинством стран артикль не нужен: Anna, Russia. Но: the UK, the USA.',
    ],
    tables: [
      {
        headers: ['Article', 'When', 'Example'],
        rows: [
          ['a', 'before a consonant sound', 'a book, a teacher, a university'],
          ['an', 'before a vowel sound', 'an apple, an egg, an hour'],
          ['the', 'a specific / known thing', 'The book on the table is mine.'],
          ['— (no article)', 'plural or general things', 'I like cats. Milk is white.'],
        ],
      },
    ],
    examples: [
      { en: 'I have a sister and a brother.', ru: 'У меня есть сестра и брат.' },
      { en: 'She eats an orange every day.', ru: 'Она ест апельсин каждый день.' },
      { en: 'The sun is hot.', ru: 'Солнце горячее.' },
      { en: 'Close the window, please.', ru: 'Закрой окно, пожалуйста.' },
      { en: 'I am an engineer.', ru: 'Я инженер.' },
    ],
    mistakes: [
      { wrong: 'I have a apple.', right: 'I have an apple.' },
      { wrong: 'She is teacher.', right: 'She is a teacher.' },
      { wrong: 'I like the cats. (in general)', right: 'I like cats.' },
    ],
    practice: [
      gap('g-ar-p1', 'I have ___ apple.', ['a', 'an', 'the'], 'an', 'apple starts with a vowel sound → an.'),
      gap('g-ar-p2', 'She is ___ teacher.', ['a', 'an', 'the'], 'a', 'Jobs need a / an: a teacher.'),
      gap('g-ar-p3', 'My father is ___ engineer.', ['a', 'an', 'the'], 'an', 'engineer starts with a vowel sound → an.'),
      gap('g-ar-p4', 'Look at ___ moon! It’s beautiful.', ['a', 'an', 'the'], 'the', 'There is only one moon → the.'),
      gap('g-ar-p5', 'It’s ___ hour from here.', ['a', 'an', 'the'], 'an', 'hour starts with a vowel sound /aʊ/ → an.'),
      mc('g-ar-p6', 'Which is correct?', ['I am student.', 'I am a student.', 'I am an student.'], 1, 'Jobs and roles need a / an.'),
    ],
    test: [
      gap('g-ar-t1', 'There is ___ cat in the garden.', ['a', 'an', 'the'], 'a', 'One cat, not a specific one → a.'),
      gap('g-ar-t2', 'I eat ___ egg for breakfast.', ['a', 'an', 'the'], 'an', 'egg → an.'),
      gap('g-ar-t3', 'Please open ___ door.', ['a', 'an', 'the'], 'the', 'We both know which door → the.'),
      mc('g-ar-t4', 'Choose the correct sentence.', ['She has an umbrella.', 'She has a umbrella.', 'She has umbrella.'], 0, 'umbrella → an.'),
      tf('g-ar-t5', 'We say "a university" because "university" starts with a /j/ (you) sound.', true),
    ],
  },

  /* 5 ------------------------------------------------------------- */
  {
    id: 'plural-nouns',
    title: 'Plural nouns',
    titleRu: 'Множественное число',
    emoji: '🍎',
    summary: 'One book → two books. Add -s and learn a few special words.',
    explanation: [
      'Most nouns: add -s → cat → cats, book → books.',
      'After s, sh, ch, x, o: add -es → bus → buses, box → boxes.',
      'Consonant + y → -ies: baby → babies, city → cities.',
      'Irregular: man → men, woman → women, child → children, person → people, foot → feet.',
    ],
    explanationRu: [
      'Обычно добавляем -s: cat → cats.',
      'После s, sh, ch, x, o добавляем -es: bus → buses, watch → watches.',
      'Согласная + y → -ies: city → cities (но гласная + y: boy → boys).',
      'Неправильные формы нужно запомнить: child → children, person → people, tooth → teeth.',
    ],
    tables: [
      {
        headers: ['Rule', 'Singular', 'Plural'],
        rows: [
          ['+ s', 'cat, book, day', 'cats, books, days'],
          ['+ es', 'bus, box, watch', 'buses, boxes, watches'],
          ['y → ies', 'baby, city', 'babies, cities'],
          ['f / fe → ves', 'knife, leaf', 'knives, leaves'],
          ['irregular', 'man, woman, child, person', 'men, women, children, people'],
          ['irregular', 'foot, tooth, mouse, sheep', 'feet, teeth, mice, sheep'],
        ],
      },
    ],
    examples: [
      { en: 'I have two brothers.', ru: 'У меня два брата.' },
      { en: 'There are three buses at the station.', ru: 'На станции три автобуса.' },
      { en: 'Babies sleep a lot.', ru: 'Младенцы много спят.' },
      { en: 'There are ten children in the room.', ru: 'В комнате десять детей.' },
      { en: 'How much are these shoes?', ru: 'Сколько стоят эти туфли?' },
    ],
    mistakes: [
      { wrong: 'two childs', right: 'two children' },
      { wrong: 'three bus', right: 'three buses' },
      { wrong: 'many peoples', right: 'many people' },
      { wrong: 'two citys', right: 'two cities' },
    ],
    practice: [
      gap('g-pl-p1', 'one cat → two ___', ['cats', 'cates', 'cat'], 'cats', 'Most nouns: + s.'),
      gap('g-pl-p2', 'one box → three ___', ['boxs', 'boxes', 'box'], 'boxes', 'After x: + es.'),
      gap('g-pl-p3', 'one baby → two ___', ['babys', 'babies', 'babyes'], 'babies', 'Consonant + y → ies.'),
      gap('g-pl-p4', 'one child → five ___', ['childs', 'children', 'childrens'], 'children', 'child → children (irregular).'),
      gap('g-pl-p5', 'one man → two ___', ['mans', 'men', 'mens'], 'men', 'man → men (irregular).'),
      typeIn('g-pl-p6', 'one city → many ___', ['cities'], 'y → ies', 'city → cities.'),
    ],
    test: [
      mc('g-pl-t1', 'The plural of "person" is…', ['persons', 'people', 'peoples'], 1, 'We usually say people.'),
      gap('g-pl-t2', 'I have two ___. ⌚', ['watchs', 'watches', 'watch'], 'watches', 'After ch: + es.'),
      mc('g-pl-t3', 'The plural of "tooth" is…', ['tooths', 'teeth', 'teeths'], 1, 'tooth → teeth.'),
      gap('g-pl-t4', 'There are three ___ at the bus stop.', ['buses', 'bus', 'buss'], 'buses', 'After s: + es.'),
      tf('g-pl-t5', 'The plural of "boy" is "boies".', false, 'Vowel + y → just add s: boys.'),
    ],
  },

  /* 6 ------------------------------------------------------------- */
  {
    id: 'have-has',
    title: 'Have / Has',
    titleRu: 'Have / Has (иметь)',
    emoji: '🎒',
    summary: 'I have, she has — talk about your things and your family.',
    explanation: [
      'I / you / we / they → have. He / she / it → has.',
      'Use it for things you own and family: I have a car. She has two sisters.',
      "Negative: don't have / doesn't have → He doesn't have a car.",
      'Question: Do you have…? Does she have…?',
    ],
    explanationRu: [
      '«У меня есть…» по-английски — I have… (дословно «я имею»).',
      'he / she / it → has; все остальные → have.',
      'Отрицание: I don’t have, she doesn’t have (после doesn’t — have, а не has!).',
      'Возраст — не have! «Мне 20 лет» = I am 20.',
    ],
    tables: [
      {
        headers: ['Subject', 'Positive', 'Negative', 'Question'],
        rows: [
          ['I / you / we / they', 'have', "don't have", 'Do … have?'],
          ['he / she / it', 'has', "doesn't have", 'Does … have?'],
        ],
      },
    ],
    examples: [
      { en: 'I have a brother and a sister.', ru: 'У меня есть брат и сестра.' },
      { en: 'She has a big house.', ru: 'У неё большой дом.' },
      { en: "We don't have a car.", ru: 'У нас нет машины.' },
      { en: 'Does he have a dog? — Yes, he does.', ru: 'У него есть собака? — Да.' },
      { en: 'My flat has two bedrooms.', ru: 'В моей квартире две спальни.' },
    ],
    mistakes: [
      { wrong: 'She have a cat.', right: 'She has a cat.' },
      { wrong: 'I has a car.', right: 'I have a car.' },
      { wrong: "He doesn't has a phone.", right: "He doesn't have a phone." },
      { wrong: 'I have 25 years.', right: 'I am 25 years old.' },
    ],
    practice: [
      gap('g-hh-p1', 'I ___ two sisters.', ['have', 'has'], 'have', 'I → have.'),
      gap('g-hh-p2', 'My brother ___ a new bike.', ['have', 'has'], 'has', 'My brother = he → has.'),
      gap('g-hh-p3', 'We ___ a small flat.', ['have', 'has'], 'have', 'We → have.'),
      gap('g-hh-p4', "Anna doesn't ___ a car.", ['have', 'has'], 'have', "After doesn't use have."),
      gap('g-hh-p5', '___ you have a pet?', ['Do', 'Does'], 'Do', 'you → Do.'),
      gap('g-hh-p6', '___ your sister have a job?', ['Do', 'Does'], 'Does', 'your sister = she → Does.'),
    ],
    test: [
      gap('g-hh-t1', 'The cat ___ green eyes.', ['have', 'has'], 'has', 'The cat = it → has.'),
      gap('g-hh-t2', 'They ___ three children.', ['have', 'has'], 'have', 'They → have.'),
      mc('g-hh-t3', 'Choose the correct question.', ['Does she have a phone?', 'Does she has a phone?', 'Have she a phone?'], 0, 'Does + she + have.'),
      mc('g-hh-t4', 'How do you say «Мне 20 лет»?', ['I have 20 years.', 'I am 20 years old.', 'I has 20 years.'], 1, 'Age → be: I am 20 years old.'),
      tf('g-hh-t5', '"He don\'t have a car" is correct.', false, "He doesn't have a car."),
    ],
  },

  /* 7 ------------------------------------------------------------- */
  {
    id: 'present-simple',
    title: 'Present Simple',
    titleRu: 'Настоящее простое время',
    emoji: '🔁',
    summary: 'Habits, routines and facts: I work, she works.',
    explanation: [
      'Use it for things you do often and for facts: I drink coffee every day.',
      'He / she / it → add -s: she works, he likes, it lives.',
      'Spelling: go → goes, watch → watches, study → studies, have → has.',
      "Negative: don't / doesn't + verb. Question: Do / Does + subject + verb?",
    ],
    explanationRu: [
      'Present Simple — для привычек, расписания и фактов: I work every day.',
      'С he / she / it к глаголу добавляем -s: she works, he plays.',
      'Отрицание: don’t (I / you / we / they) и doesn’t (he / she / it) + глагол без -s.',
      'Вопрос: Do you work? Does she work? (после does — глагол без -s).',
    ],
    tables: [
      {
        caption: 'Positive',
        headers: ['Subject', 'Verb', 'Example'],
        rows: [
          ['I / you / we / they', 'work', 'I work in an office.'],
          ['he / she / it', 'works', 'She works in a bank.'],
        ],
      },
      {
        caption: 'Negative and questions',
        headers: ['Subject', 'Negative', 'Question'],
        rows: [
          ['I / you / we / they', "don't work", 'Do you work?'],
          ['he / she / it', "doesn't work", 'Does he work?'],
        ],
      },
      {
        caption: 'Spelling with he / she / it',
        headers: ['Verb', 'he / she / it'],
        rows: [
          ['play', 'plays'],
          ['go', 'goes'],
          ['watch', 'watches'],
          ['study', 'studies'],
          ['have', 'has'],
        ],
      },
    ],
    examples: [
      { en: 'I get up at seven every day.', ru: 'Я встаю в семь каждый день.' },
      { en: 'She lives in London.', ru: 'Она живёт в Лондоне.' },
      { en: "My dad doesn't drink coffee.", ru: 'Мой папа не пьёт кофе.' },
      { en: 'Do you like pizza? — Yes, I do.', ru: 'Ты любишь пиццу? — Да.' },
      { en: 'The shop opens at nine.', ru: 'Магазин открывается в девять.' },
    ],
    mistakes: [
      { wrong: 'She work in a bank.', right: 'She works in a bank.' },
      { wrong: "He don't like fish.", right: "He doesn't like fish." },
      { wrong: 'Does she works?', right: 'Does she work?' },
      { wrong: 'I am work every day.', right: 'I work every day.' },
    ],
    practice: [
      gap('g-ps-p1', 'I ___ coffee every morning.', ['drink', 'drinks'], 'drink', 'I → verb without -s.'),
      gap('g-ps-p2', 'She ___ in a hospital.', ['work', 'works'], 'works', 'She → verb + s.'),
      gap('g-ps-p3', 'My brother ___ TV every evening.', ['watch', 'watchs', 'watches'], 'watches', 'watch → watches.'),
      gap('g-ps-p4', 'We ___ like fish.', ["don't", "doesn't"], "don't", "We → don't."),
      gap('g-ps-p5', '___ he play football?', ['Do', 'Does'], 'Does', 'he → Does.'),
      build('g-ps-p6', 'She goes to work by bus.', 'Она ездит на работу на автобусе.'),
      typeIn('g-ps-p7', 'Tom ___ English. (study)', ['studies'], 'study → studies', 'Consonant + y → ies: studies.'),
    ],
    test: [
      gap('g-ps-t1', 'My mother ___ at eight o’clock.', ['get up', 'gets up'], 'gets up', 'My mother = she → gets up.'),
      gap('g-ps-t2', 'They ___ live in Paris.', ["don't", "doesn't"], "don't", "They → don't."),
      mc('g-ps-t3', 'Choose the correct question.', ['Do she like tea?', 'Does she like tea?', 'Does she likes tea?'], 1, 'Does + she + like (no -s).'),
      gap('g-ps-t4', 'The bus ___ at half past seven.', ['leave', 'leaves'], 'leaves', 'The bus = it → leaves.'),
      tf('g-ps-t5', 'We use Present Simple for things we do every day.', true),
    ],
  },

  /* 8 ------------------------------------------------------------- */
  {
    id: 'adverbs-of-frequency',
    title: 'Adverbs of frequency',
    titleRu: 'Наречия частотности',
    emoji: '⏱️',
    summary: 'always, usually, often, sometimes, never — how often?',
    explanation: [
      'They say how often: always (100%) → usually → often → sometimes → never (0%).',
      'They go before the main verb: I always get up at 7.',
      'But after am / is / are: She is never late.',
      'Ask: How often do you…? — Every day / once a week / twice a month.',
    ],
    explanationRu: [
      'always — всегда, usually — обычно, often — часто, sometimes — иногда, rarely — редко, never — никогда.',
      'Ставим их перед основным глаголом: I often read.',
      'Но после глагола to be: He is always happy.',
      'С never не нужно not: I never eat meat (а не «I don’t never…»).',
    ],
    tables: [
      {
        headers: ['Adverb', '%', 'Русский', 'Example'],
        rows: [
          ['always', '100%', 'всегда', 'I always have breakfast.'],
          ['usually', '80%', 'обычно', 'I usually walk to work.'],
          ['often', '60%', 'часто', 'We often go to the park.'],
          ['sometimes', '40%', 'иногда', 'She sometimes cooks dinner.'],
          ['rarely', '10%', 'редко', 'He rarely watches TV.'],
          ['never', '0%', 'никогда', 'I never drink coffee.'],
        ],
      },
    ],
    examples: [
      { en: 'I always brush my teeth in the morning.', ru: 'Я всегда чищу зубы утром.' },
      { en: 'We usually have lunch at one.', ru: 'Мы обычно обедаем в час.' },
      { en: 'She is often tired on Mondays.', ru: 'По понедельникам она часто устаёт.' },
      { en: 'My dad never eats fish.', ru: 'Мой папа никогда не ест рыбу.' },
      { en: 'How often do you go to the gym? — Twice a week.', ru: 'Как часто ты ходишь в спортзал? — Два раза в неделю.' },
    ],
    mistakes: [
      { wrong: 'I go always to school by bus.', right: 'I always go to school by bus.' },
      { wrong: 'She always is late.', right: 'She is always late.' },
      { wrong: "I don't never eat meat.", right: 'I never eat meat.' },
    ],
    practice: [
      build('g-af-p1', 'I always get up at seven.', 'Я всегда встаю в семь.', 'Adverb before the main verb.'),
      build('g-af-p2', 'She is never late.', 'Она никогда не опаздывает.', 'After is / am / are.'),
      mc('g-af-p3', 'Which word means 0%?', ['always', 'sometimes', 'never'], 2),
      mc('g-af-p4', 'Which is correct?', ['He usually walks to work.', 'He walks usually to work.', 'Usually he walk to work.'], 0, 'Adverb goes before the main verb.'),
      gap('g-af-p5', 'I ___ eat meat. I am a vegetarian.', ['always', 'never', 'often'], 'never', 'A vegetarian never eats meat.'),
      mc('g-af-p6', '«Иногда» in English is…', ['often', 'sometimes', 'usually'], 1),
    ],
    test: [
      mc('g-af-t1', 'Choose the correct sentence.', ['They are always happy.', 'They always are happy.', 'Always they happy.'], 0, 'After "are" → They are always happy.'),
      gap('g-af-t2', 'I ___ drink tea — every single morning!', ['always', 'never', 'rarely'], 'always', 'Every single morning = always.'),
      mc('g-af-t3', '"Twice a week" is closest to…', ['never', 'sometimes', 'always'], 1),
      build('g-af-t4', 'We often go to the cinema.', 'Мы часто ходим в кино.'),
      tf('g-af-t5', '"Usually" means more often than "sometimes".', true),
    ],
  },

  /* 9 ------------------------------------------------------------- */
  {
    id: 'some-any',
    title: 'Some / Any',
    titleRu: 'Some / Any',
    emoji: '🧺',
    summary: 'some in positive sentences, any in negatives and questions.',
    explanation: [
      'Use some in positive sentences: There is some milk. I have some apples.',
      "Use any in negatives and questions: I don't have any money. Are there any eggs?",
      'Use some in offers and requests: Would you like some tea? Can I have some water?',
      'They go with plural nouns (apples) and uncountable nouns (milk, water, bread).',
    ],
    explanationRu: [
      'some — «немного, несколько» в утвердительных предложениях.',
      'any — в отрицаниях и вопросах: I don’t have any… / Do you have any…?',
      'В просьбах и предложениях — some: Would you like some coffee?',
      'Неисчисляемые слова (milk, water, bread, money) не имеют множественного числа: some milk, а не milks.',
    ],
    tables: [
      {
        headers: ['Sentence', 'some / any', 'Example'],
        rows: [
          ['Positive (+)', 'some', 'I have some friends in London.'],
          ['Negative (−)', 'any', "We don't have any bread."],
          ['Question (?)', 'any', 'Do you have any brothers?'],
          ['Offer / request', 'some', 'Would you like some juice?'],
        ],
      },
    ],
    examples: [
      { en: 'There are some apples on the table.', ru: 'На столе есть несколько яблок.' },
      { en: "There isn't any milk in the fridge.", ru: 'В холодильнике нет молока.' },
      { en: 'Do you have any questions?', ru: 'У вас есть вопросы?' },
      { en: 'Can I have some water, please?', ru: 'Можно мне воды, пожалуйста?' },
      { en: 'I need some new shoes.', ru: 'Мне нужна новая обувь.' },
    ],
    mistakes: [
      { wrong: "I don't have some money.", right: "I don't have any money." },
      { wrong: "I'd like any tea.", right: "I'd like some tea." },
      { wrong: 'some milks', right: 'some milk' },
    ],
    practice: [
      gap('g-sa-p1', 'There is ___ cheese in the fridge.', ['some', 'any'], 'some', 'Positive → some.'),
      gap('g-sa-p2', "I don't have ___ brothers.", ['some', 'any'], 'any', 'Negative → any.'),
      gap('g-sa-p3', 'Are there ___ eggs?', ['some', 'any'], 'any', 'Question → any.'),
      gap('g-sa-p4', 'Would you like ___ coffee?', ['some', 'any'], 'some', 'Offers → some.'),
      gap('g-sa-p5', 'We need ___ bread.', ['some', 'any'], 'some', 'Positive → some.'),
      gap('g-sa-p6', "There aren't ___ chairs in the room.", ['some', 'any'], 'any', 'Negative → any.'),
    ],
    test: [
      gap('g-sa-t1', 'Is there ___ juice?', ['some', 'any'], 'any', 'Question → any.'),
      gap('g-sa-t2', 'I have ___ good news!', ['some', 'any'], 'some', 'Positive → some.'),
      mc('g-sa-t3', 'Choose the correct sentence.', ["She doesn't have any pets.", "She doesn't have some pets.", "She don't have any pets."], 0),
      mc('g-sa-t4', 'Which word is uncountable?', ['apple', 'milk', 'egg'], 1, 'We say "some milk", not "two milks".'),
      tf('g-sa-t5', 'We usually use "any" in positive sentences.', false, 'Positive → some.'),
    ],
  },

  /* 10 ------------------------------------------------------------ */
  {
    id: 'there-is-are',
    title: 'There is / There are',
    titleRu: 'There is / There are',
    emoji: '🏠',
    summary: 'Say what is in a place: There is a sofa. There are two beds.',
    explanation: [
      'There is + one thing: There is a lamp on the desk.',
      'There are + two or more things: There are three chairs.',
      "Negative: There isn't… / There aren't any…",
      "Question: Is there…? / Are there…? — Yes, there is. / No, there aren't.",
    ],
    explanationRu: [
      'There is / There are — «есть, имеется, находится» (что-то где-то есть).',
      'Русское «В комнате есть стол» → There is a table in the room.',
      'is — для одного предмета, are — для нескольких.',
      'Вопрос: Is there a bank near here? — Здесь рядом есть банк?',
    ],
    tables: [
      {
        headers: ['', 'One thing', 'Many things'],
        rows: [
          ['+', "There is a bed. (There's)", 'There are two windows.'],
          ['−', "There isn't a TV.", "There aren't any books."],
          ['?', 'Is there a park?', 'Are there any shops?'],
          ['Short answers', "Yes, there is. / No, there isn't.", "Yes, there are. / No, there aren't."],
        ],
      },
    ],
    examples: [
      { en: 'There is a big window in my room.', ru: 'В моей комнате большое окно.' },
      { en: 'There are four people in my family.', ru: 'В моей семье четыре человека.' },
      { en: "There isn't a lift in our building.", ru: 'В нашем доме нет лифта.' },
      { en: 'Is there a bank near here?', ru: 'Здесь рядом есть банк?' },
      { en: 'Are there any good cafés in your town?', ru: 'В твоём городе есть хорошие кафе?' },
    ],
    mistakes: [
      { wrong: 'There are a sofa.', right: 'There is a sofa.' },
      { wrong: 'There is two beds.', right: 'There are two beds.' },
      { wrong: 'In my room is a desk.', right: 'There is a desk in my room.' },
      { wrong: 'Have there a bank?', right: 'Is there a bank?' },
    ],
    practice: [
      gap('g-ti-p1', '___ a sofa in the living room.', ['There is', 'There are'], 'There is', 'One sofa → There is.'),
      gap('g-ti-p2', '___ two bedrooms in my flat.', ['There is', 'There are'], 'There are', 'Two bedrooms → There are.'),
      gap('g-ti-p3', 'There ___ any milk.', ["isn't", "aren't"], "isn't", 'milk is uncountable → isn’t.'),
      gap('g-ti-p4', '___ there any shops near here?', ['Is', 'Are'], 'Are', 'shops (plural) → Are.'),
      gap('g-ti-p5', 'Is there a garden? — Yes, there ___.', ['is', 'are'], 'is', 'Is there…? → Yes, there is.'),
      build('g-ti-p6', 'There are three chairs in the kitchen.', 'На кухне три стула.'),
    ],
    test: [
      gap('g-ti-t1', '___ a supermarket on my street.', ['There is', 'There are'], 'There is', 'One supermarket → There is.'),
      gap('g-ti-t2', 'There ___ five apples on the table.', ['is', 'are'], 'are', 'Five apples → are.'),
      mc('g-ti-t3', 'Choose the correct question.', ['Is there a bus stop near here?', 'Are there a bus stop near here?', 'Has there a bus stop near here?'], 0),
      gap('g-ti-t4', 'There ___ any books on the shelf.', ["isn't", "aren't"], "aren't", 'books (plural) → aren’t.'),
      tf('g-ti-t5', '"There is two cats" is correct.', false, 'Two cats → There are two cats.'),
    ],
  },

  /* 11 ------------------------------------------------------------ */
  {
    id: 'prepositions',
    title: 'Prepositions of place and time',
    titleRu: 'Предлоги места и времени',
    emoji: '📍',
    summary: 'in, on, under, next to, between — and at / on / in for time.',
    explanation: [
      'Place: in (inside), on (on top), under, next to, between, behind, in front of.',
      'Time: at + clock time (at 7 o’clock), on + days (on Monday), in + months, years, seasons (in June, in summer).',
      'Remember: in the morning / in the evening, but at night and at the weekend.',
      'Address: in London, on Green Street, at number 12.',
    ],
    explanationRu: [
      'in — в (внутри), on — на (поверхности), under — под, next to — рядом с, between — между, behind — за, in front of — перед.',
      'Время: at — точное время (at 5 pm), on — дни и даты (on Friday), in — месяцы, годы, времена года (in May).',
      'Запомни: in the morning, но at night.',
    ],
    tables: [
      {
        caption: 'Place',
        headers: ['Preposition', 'Русский', 'Example'],
        rows: [
          ['in', 'в', 'The keys are in my bag.'],
          ['on', 'на', 'The book is on the table.'],
          ['under', 'под', 'The cat is under the bed.'],
          ['next to', 'рядом с', 'The bank is next to the café.'],
          ['between', 'между', 'The shop is between the bank and the park.'],
          ['behind', 'за, позади', 'The garden is behind the house.'],
          ['in front of', 'перед', 'The bus stop is in front of the school.'],
        ],
      },
      {
        caption: 'Time',
        headers: ['Preposition', 'Use', 'Example'],
        rows: [
          ['at', 'clock time, night', "at 8 o'clock, at night"],
          ['on', 'days, dates', 'on Monday, on 5 May'],
          ['in', 'months, years, seasons, parts of the day', 'in July, in 2025, in winter, in the evening'],
        ],
      },
    ],
    examples: [
      { en: 'The cat is under the table.', ru: 'Кошка под столом.' },
      { en: 'My phone is on the sofa.', ru: 'Мой телефон на диване.' },
      { en: 'The pharmacy is next to the bank.', ru: 'Аптека рядом с банком.' },
      { en: "I get up at seven o'clock.", ru: 'Я встаю в семь часов.' },
      { en: 'We go to the sea in summer.', ru: 'Летом мы ездим на море.' },
      { en: 'My birthday is on Friday.', ru: 'Мой день рождения в пятницу.' },
    ],
    mistakes: [
      { wrong: 'at Monday', right: 'on Monday' },
      { wrong: "in 8 o'clock", right: "at 8 o'clock" },
      { wrong: 'on summer', right: 'in summer' },
      { wrong: 'in the night', right: 'at night' },
    ],
    practice: [
      gap('g-pr-p1', 'The cat is inside the box. → The cat is ___ the box.', ['in', 'on', 'under'], 'in', 'Inside → in.'),
      gap('g-pr-p2', 'The book is ___ the table.', ['on', 'in', 'at'], 'on', 'On top of a surface → on.'),
      gap('g-pr-p3', 'I have English ___ Monday.', ['on', 'in', 'at'], 'on', 'Days → on.'),
      gap('g-pr-p4', "The film starts ___ 8 o'clock.", ['at', 'on', 'in'], 'at', 'Clock time → at.'),
      gap('g-pr-p5', 'My birthday is ___ June.', ['in', 'on', 'at'], 'in', 'Months → in.'),
      gap('g-pr-p6', 'The bank is ___ the café and the shop.', ['between', 'next', 'under'], 'between', 'between A and B.'),
    ],
    test: [
      gap('g-pr-t1', 'I go to bed ___ night.', ['at', 'in', 'on'], 'at', 'at night.'),
      gap('g-pr-t2', 'We go skiing ___ winter.', ['in', 'on', 'at'], 'in', 'Seasons → in.'),
      gap('g-pr-t3', 'The bus stop is next ___ the school.', ['to', 'of', 'at'], 'to', 'next to.'),
      mc('g-pr-t4', 'Choose the correct sentence.', ['See you on Saturday!', 'See you in Saturday!', 'See you at Saturday!'], 0, 'Days → on.'),
      tf('g-pr-t5', 'We say "in the morning" but "at night".', true),
    ],
  },

  /* 12 ------------------------------------------------------------ */
  {
    id: 'can-cant',
    title: "Can / Can't",
    titleRu: "Модальный глагол can",
    emoji: '💪',
    summary: 'Ability and permission: I can swim. Can I open the window?',
    explanation: [
      "can + verb (no 'to', no '-s'): I can swim. She can drive.",
      "Negative: can't (cannot): He can't cook.",
      "Question: Can you…? — Yes, I can. / No, I can't.",
      'Also for permission and requests: Can I sit here? Can you help me?',
    ],
    explanationRu: [
      'can — «могу, умею»: I can swim — Я умею плавать.',
      'После can глагол без to и без -s: She can sing (не «can sings»).',
      'Отрицание: can’t = cannot.',
      'Просьба: Can you help me? Разрешение: Can I come in?',
    ],
    tables: [
      {
        headers: ['', 'Example', 'Русский'],
        rows: [
          ['+', 'I can speak English.', 'Я умею говорить по-английски.'],
          ['−', "She can't drive.", 'Она не умеет водить.'],
          ['?', 'Can you swim?', 'Ты умеешь плавать?'],
          ['Short answers', "Yes, I can. / No, I can't.", 'Да. / Нет.'],
          ['Request', 'Can I have a coffee, please?', 'Можно мне кофе?'],
        ],
      },
    ],
    examples: [
      { en: 'I can play the guitar.', ru: 'Я умею играть на гитаре.' },
      { en: "My grandmother can't use a computer.", ru: 'Моя бабушка не умеет пользоваться компьютером.' },
      { en: 'Can you speak Spanish? — A little.', ru: 'Ты говоришь по-испански? — Немного.' },
      { en: 'Can I open the window?', ru: 'Можно открыть окно?' },
      { en: "Penguins can't fly.", ru: 'Пингвины не умеют летать.' },
    ],
    mistakes: [
      { wrong: 'She can sings.', right: 'She can sing.' },
      { wrong: 'I can to swim.', right: 'I can swim.' },
      { wrong: 'Do you can drive?', right: 'Can you drive?' },
      { wrong: 'He cans dance.', right: 'He can dance.' },
    ],
    practice: [
      gap('g-cc-p1', 'Fish ___ swim.', ['can', "can't"], 'can'),
      gap('g-cc-p2', 'Babies ___ drive a car.', ['can', "can't"], "can't"),
      mc('g-cc-p3', 'Choose the correct sentence.', ['She can speak French.', 'She can speaks French.', 'She cans speak French.'], 0, 'can + verb without -s.'),
      build('g-cc-p4', 'Can you play the guitar?', 'Ты умеешь играть на гитаре?'),
      gap('g-cc-p5', 'Can you help me? — Yes, I ___.', ['can', 'do', 'am'], 'can', 'Can you…? → Yes, I can.'),
      mc('g-cc-p6', 'How do you ask for permission?', ['Can I open the window?', 'I can open the window?', 'Do I can open the window?'], 0),
    ],
    test: [
      gap('g-cc-t1', 'I ___ cook. I always burn the food!', ['can', "can't"], "can't"),
      mc('g-cc-t2', 'Which is correct?', ['Can he ride a bike?', 'Does he can ride a bike?', 'Can he rides a bike?'], 0),
      gap('g-cc-t3', 'Birds ___ fly.', ['can', "can't"], 'can'),
      gap('g-cc-t4', 'Can I have some water? — Yes, of course you ___.', ['can', 'are', 'do'], 'can'),
      tf('g-cc-t5', 'After "can" we use "to": I can to swim.', false, 'No "to": I can swim.'),
    ],
  },

  /* 13 ------------------------------------------------------------ */
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    titleRu: 'Настоящее продолженное время',
    emoji: '⏳',
    summary: 'Actions happening now: I am reading. They are playing.',
    explanation: [
      "Use it for things happening now: Look! It's raining.",
      'Form: am / is / are + verb-ing: I am working. She is cooking.',
      'Spelling: make → making, swim → swimming, sit → sitting.',
      'Signal words: now, right now, at the moment, Look!, Listen!',
    ],
    explanationRu: [
      'Present Continuous — действие происходит прямо сейчас.',
      'Формула: am / is / are + глагол + -ing: She is reading — Она (сейчас) читает.',
      'Сравни: I work in a bank (вообще) — I am working now (прямо сейчас).',
      'Отрицание: I’m not sleeping. Вопрос: Are you listening?',
    ],
    tables: [
      {
        headers: ['Subject', 'be', 'verb-ing', 'Example'],
        rows: [
          ['I', "am ('m)", 'reading', "I'm reading a book."],
          ['he / she / it', "is ('s)", 'cooking', "She's cooking dinner."],
          ['you / we / they', "are ('re)", 'playing', "They're playing football."],
        ],
      },
      {
        caption: 'Spelling',
        headers: ['Rule', 'Examples'],
        rows: [
          ['+ ing', 'read → reading, play → playing'],
          ['e → ing', 'make → making, write → writing'],
          ['double letter', 'swim → swimming, run → running, sit → sitting'],
        ],
      },
    ],
    examples: [
      { en: "I'm learning English now.", ru: 'Я сейчас учу английский.' },
      { en: 'Look! The bus is coming.', ru: 'Смотри! Автобус идёт.' },
      { en: "We aren't watching TV.", ru: 'Мы не смотрим телевизор.' },
      { en: "What are you doing? — I'm cooking.", ru: 'Что ты делаешь? — Готовлю.' },
      { en: "It's raining. Take an umbrella.", ru: 'Идёт дождь. Возьми зонт.' },
    ],
    mistakes: [
      { wrong: 'I reading now.', right: "I'm reading now." },
      { wrong: 'She is cook.', right: 'She is cooking.' },
      { wrong: 'They are swiming.', right: 'They are swimming.' },
      { wrong: 'Are you work now?', right: 'Are you working now?' },
    ],
    practice: [
      gap('g-pc-p1', 'I ___ reading a book now.', ['am', 'is', 'are'], 'am'),
      gap('g-pc-p2', 'Look! The children ___ playing in the garden.', ['is', 'are'], 'are', 'The children = they → are.'),
      gap('g-pc-p3', 'She is ___ dinner.', ['cook', 'cooking', 'cooks'], 'cooking', 'be + verb-ing.'),
      typeIn('g-pc-p4', 'They are ___ in the sea. (swim)', ['swimming'], 'swim → swimming', 'Double the m: swimming.'),
      mc('g-pc-p5', 'What is happening now? 🌧️', ["It's raining.", 'It rains every day.', 'It rain.'], 0, 'Now → Present Continuous.'),
      build('g-pc-p6', 'What are you doing?', 'Что ты делаешь?'),
    ],
    test: [
      gap('g-pc-t1', 'Be quiet! The baby ___ sleeping.', ['is', 'are', 'am'], 'is'),
      mc('g-pc-t2', 'Choose the correct sentence.', ['We are watching a film.', 'We watching a film.', 'We are watch a film.'], 0),
      gap('g-pc-t3', 'He is ___ a letter. (write)', ['writing', 'writeing', 'writes'], 'writing', 'write → writing.'),
      mc('g-pc-t4', 'Which sentence is about NOW?', ["I'm drinking coffee.", 'I drink coffee every day.', 'I often drink coffee.'], 0),
      tf('g-pc-t5', 'Present Continuous = am / is / are + verb-ing.', true),
    ],
  },

  /* 14 ------------------------------------------------------------ */
  {
    id: 'question-words',
    title: 'Question words',
    titleRu: 'Вопросительные слова',
    emoji: '❓',
    summary: 'What, where, who, when, why, how — ask about anything.',
    explanation: [
      "What → things (What's your name?), Where → places, Who → people, When → time.",
      'Why → reasons (answer with because), How → manner (How are you?).',
      'How old / How much / How many: How old are you? How much is it?',
      'Word order: question word + be + subject (Where are you from?) or + do / does + subject + verb (Where do you live?).',
    ],
    explanationRu: [
      'What — что / какой, Where — где / куда, Who — кто, When — когда, Why — почему, How — как.',
      'How old — сколько лет, How much — сколько (стоит / неисчисляемое), How many — сколько (исчисляемое).',
      'Порядок слов: Where do you live? (вопросительное слово + do / does + подлежащее + глагол).',
    ],
    tables: [
      {
        headers: ['Word', 'Русский', 'Example'],
        rows: [
          ['What', 'что, какой', "What's your name?"],
          ['Where', 'где, куда', 'Where are you from?'],
          ['Who', 'кто', 'Who is your teacher?'],
          ['When', 'когда', 'When is your birthday?'],
          ['Why', 'почему', 'Why are you sad? — Because…'],
          ['How', 'как', 'How are you?'],
          ['How old', 'сколько лет', 'How old is your sister?'],
          ['How much / many', 'сколько', 'How much is this? How many brothers do you have?'],
        ],
      },
    ],
    examples: [
      { en: "What's your favourite colour?", ru: 'Какой твой любимый цвет?' },
      { en: 'Where do you work?', ru: 'Где ты работаешь?' },
      { en: 'Who is that man?', ru: 'Кто этот мужчина?' },
      { en: 'When do you get up?', ru: 'Когда ты встаёшь?' },
      { en: 'How many people are in your family?', ru: 'Сколько человек в твоей семье?' },
    ],
    mistakes: [
      { wrong: 'Where you live?', right: 'Where do you live?' },
      { wrong: 'How many money?', right: 'How much money?' },
      { wrong: 'How old have you?', right: 'How old are you?' },
    ],
    practice: [
      gap('g-qw-p1', "___ are you from? — I'm from Spain.", ['Where', 'What', 'Who'], 'Where', 'Place → Where.'),
      gap('g-qw-p2', '___ is your name? — Anna.', ['What', 'Who', 'How'], 'What'),
      gap('g-qw-p3', "___ old are you? — I'm 25.", ['How', 'What', 'When'], 'How', 'Age → How old.'),
      gap('g-qw-p4', '___ is your birthday? — In May.', ['When', 'Where', 'Who'], 'When', 'Time → When.'),
      gap('g-qw-p5', "___ is that girl? — She's my sister.", ['Who', 'What', 'Where'], 'Who', 'Person → Who.'),
      build('g-qw-p6', 'Where do you live?', 'Где ты живёшь?'),
    ],
    test: [
      gap('g-qw-t1', "___ are you sad? — Because I'm tired.", ['Why', 'What', 'How'], 'Why', 'Reason → Why.'),
      gap('g-qw-t2', "How ___ is this T-shirt? — It's ten pounds.", ['much', 'many', 'old'], 'much', 'Price → How much.'),
      mc('g-qw-t3', 'Choose the correct question.', ['What do you do?', 'What you do?', 'What does you do?'], 0, '"What do you do?" = What is your job?'),
      gap('g-qw-t4', 'How ___ sisters do you have?', ['many', 'much'], 'many', 'sisters (countable) → many.'),
      tf('g-qw-t5', '"Who" asks about places.', false, 'Who → people. Where → places.'),
    ],
  },

  /* 15 ------------------------------------------------------------ */
  {
    id: 'past-simple',
    title: 'Past Simple basics',
    titleRu: 'Прошедшее простое время',
    emoji: '⌛',
    summary: 'Finished actions in the past: I visited, I went, I was.',
    explanation: [
      'Use it for finished actions in the past: yesterday, last week, in 2020, two days ago.',
      'Regular verbs: add -ed → work → worked, play → played, live → lived.',
      'Irregular verbs have special forms: go → went, have → had, see → saw, eat → ate, buy → bought.',
      "be → was / were. Negative: didn't + verb. Question: Did you…?",
    ],
    explanationRu: [
      'Past Simple — законченное действие в прошлом (вчера, на прошлой неделе).',
      'Правильные глаголы: + ed (worked, played). Неправильные нужно выучить: go → went, see → saw.',
      'Глагол to be: I / he / she / it was; you / we / they were.',
      'Отрицание: didn’t + глагол в начальной форме (I didn’t go). Вопрос: Did you go?',
    ],
    tables: [
      {
        caption: 'Regular and irregular verbs',
        headers: ['Verb', 'Past', 'Русский'],
        rows: [
          ['work', 'worked', 'работал'],
          ['play', 'played', 'играл'],
          ['watch', 'watched', 'смотрел'],
          ['go', 'went', 'ходил, ездил'],
          ['have', 'had', 'имел, ел'],
          ['see', 'saw', 'видел'],
          ['eat', 'ate', 'ел'],
          ['buy', 'bought', 'купил'],
          ['take', 'took', 'взял'],
        ],
      },
      {
        caption: 'was / were',
        headers: ['Subject', 'Past of be', 'Example'],
        rows: [
          ['I / he / she / it', 'was', 'I was at home yesterday.'],
          ['you / we / they', 'were', 'We were in Paris last summer.'],
        ],
      },
      {
        caption: 'Negative and questions',
        headers: ['', 'Example'],
        rows: [
          ['−', "I didn't go to work yesterday."],
          ['?', 'Did you see the film?'],
          ['Short answers', "Yes, I did. / No, I didn't."],
        ],
      },
    ],
    examples: [
      { en: 'I visited my grandmother last weekend.', ru: 'В прошлые выходные я навестил бабушку.' },
      { en: 'We went to the cinema yesterday.', ru: 'Вчера мы ходили в кино.' },
      { en: 'She was tired after work.', ru: 'Она устала после работы.' },
      { en: "I didn't have breakfast this morning.", ru: 'Сегодня утром я не завтракал.' },
      { en: 'Did you like the film? — Yes, I did!', ru: 'Тебе понравился фильм? — Да!' },
    ],
    mistakes: [
      { wrong: 'I goed to the park.', right: 'I went to the park.' },
      { wrong: "She didn't went.", right: "She didn't go." },
      { wrong: 'Did you saw it?', right: 'Did you see it?' },
    ],
    practice: [
      gap('g-pst-p1', 'Yesterday I ___ football. (play)', ['play', 'played', 'plays'], 'played', 'Regular verb: + ed.'),
      gap('g-pst-p2', 'Last summer we ___ to Spain.', ['go', 'went', 'goed'], 'went', 'go → went (irregular).'),
      gap('g-pst-p3', 'I ___ at home yesterday evening.', ['was', 'were'], 'was', 'I → was.'),
      gap('g-pst-p4', 'They ___ very happy.', ['was', 'were'], 'were', 'They → were.'),
      gap('g-pst-p5', "She didn't ___ the film.", ['see', 'saw', 'seen'], 'see', "After didn't → base verb."),
      gap('g-pst-p6', '___ you buy a new phone? — Yes, I did.', ['Did', 'Do', 'Was'], 'Did', 'Past question → Did.'),
    ],
    test: [
      gap('g-pst-t1', 'I ___ a pizza last night. (eat)', ['ate', 'eated', 'eat'], 'ate', 'eat → ate.'),
      gap('g-pst-t2', 'We ___ a lot of photos. (take)', ['took', 'taked', 'take'], 'took', 'take → took.'),
      mc('g-pst-t3', 'Choose the correct sentence.', ["I didn't work yesterday.", "I didn't worked yesterday.", 'I not worked yesterday.'], 0),
      gap('g-pst-t4', 'Where ___ you last Sunday?', ['were', 'was', 'did'], 'were', 'you → were.'),
      tf('g-pst-t5', 'The past of "buy" is "buyed".', false, 'buy → bought.'),
    ],
  },
]

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((t) => t.id === id)
}
