# Stepwise — Learn English step by step 🪜

**Stepwise** — интерактивная EdTech-платформа для изучения английского языка с нуля до уровня **A1**.
Короткие последовательные уроки, речь с распознаванием голоса, аудирование, чтение, письмо с автопроверкой,
грамматика, словарь с интервальным повторением, видеоуроки, кинематографичный Book Trailer и итоговый тест A1 —
всё с XP, сериями дней, сердцами, достижениями и сохранением прогресса.

> Главная идея: **Learn → Practice → Test → Review → Progress**

---

## 🚀 Запуск

Нужен **Node.js 20.19+**.

```bash
npm install
npm run dev        # http://localhost:5173
```

Другие команды:

```bash
npm run build      # проверка типов + production-сборка в папку dist/
npm run preview    # посмотреть собранную версию
npm test           # юнит-тесты (Vitest)
```

Сборка статическая (HashRouter + `base: './'`), поэтому папку `dist/` можно выложить на любой хостинг:
GitHub Pages, Netlify, Vercel, школьный сервер.

> 🎤 Распознавание речи работает в **Chrome, Edge и Safari** (Web Speech API) и требует HTTPS или `localhost`.
> В других браузерах можно сказать фразу вслух и напечатать её — проверка работает так же.

---

## 👩‍🏫 Как быстро показать проект преподавателю

1. Откройте **Profile → Teacher & demo mode**.
2. Включите **Unlock all lessons** (все юниты и шаги открыты) и **Unlimited hearts**.
3. Нажмите **Fill with sample progress** — дашборд заполнится демо-данными (2,5 юнита, серия 7 дней, XP за неделю).
4. **Reset progress** вернёт всё к началу.

---

## 🗺️ Пользовательский путь

```
Главная (логотип, слоган, START LEARNING)
  → Онбординг (имя, аватар, ежедневная цель)
  → Карта курса: START → Unit 1 … Unit 10 → A1 Certificate
      → Юнит: Vocabulary → Grammar → Listening → Reading → Speaking → Writing → Video Lesson → Quiz
          → 🎉 Lesson Complete! (+XP, точность, время) → следующий шаг
      → после всех 8 шагов открывается следующий юнит
  → Unit 10 «Final A1 Challenge» → Final A1 Test (6 разделов) → сертификат A1
```

Ошибки сохраняются автоматически → **Review Mistakes** → «Practice again» (каждое исправление даёт +1 ❤️).

---

## 📚 Контент (реальный A1, без пустых страниц)

| Раздел | Объём |
|---|---|
| Юниты | **10** (Hello! · About Me · Family · My Day · Food · Home · Shopping · Free Time · City & Transport · Final A1 Challenge) |
| Грамматика | **15 тем** A1, у каждой: объяснение на EN и RU, таблицы, примеры с озвучкой, типичные ошибки, практика и мини-тест — **167 упражнений** |
| Словарь | **201 слово** в **15 категориях** (эмодзи, транскрипция, перевод, пример, озвучка); режимы Learn / Flashcards / Match / Listen / Test |
| Чтение | **10 текстов** с озвучкой, подсветкой предложений и переводом слов по клику — **60 заданий** (True/False, Multiple choice, Match, Order…) |
| Аудирование | **10 диалогов** (Play / Pause / Replay / Slow mode, транскрипт только после ответов) — **50 заданий** |
| Говорение | **12 заданий / 48 реплик**: Repeat, Answer, Introduce yourself, Describe the picture, Complete the dialogue, Role play |
| Письмо | **10 заданий** с подсказками, счётчиком слов, примером ответа и автопроверкой |
| Видеоуроки | **13 уроков** в 5 категориях + **45 вопросов** после просмотра |
| Book Trailer | оригинальная история *The Lighthouse Key*: обложка, персонажи, анимированный трейлер, словарь, задания, **4 главы** |
| Итоговый тест | Grammar, Vocabulary, Reading, Listening, Writing, Speaking → баллы по разделам, TOTAL, сертификат |
| Ещё | Word of the Day, Daily Challenge, Random Speaking Question, Pronunciation Practice, 3 мини-игры, Leaderboard (демо), поиск (Ctrl K), уведомления |

---

## 🎮 Геймификация

⭐ XP и уровни · 🔥 серия дней · ❤️ сердца (теряются за ошибки в уроках курса, +1 каждые 15 минут или за исправленную ошибку) ·
🎯 ежедневная цель с заданиями (Speaking +20 XP, Grammar +15 XP, Vocabulary +10 XP) · 🏆 16 достижений
(First Lesson, 7 Day Streak, 100 Words Learned, Grammar Master, Speaking Beginner, A1 Champion…) · 🔒 закрытые уроки ·
повтор ошибочных вопросов в конце урока · комбо правильных ответов · конфетти и звуки.

Весь прогресс (XP, прогресс юнитов, уроки, серия, слова и их интервальное повторение, ошибки, достижения,
результаты теста) хранится в **localStorage** — аккаунт не нужен. Его можно выгрузить в JSON из профиля.

---

## 🛠️ Технологии

- **React 19 + TypeScript**, **Vite**
- **Tailwind CSS v4** (дизайн-токены, светлая/тёмная тема, анимации)
- **React Router** (HashRouter, ленивая загрузка страниц)
- **Zustand** (состояние + `persist` в localStorage)
- **Web Speech API**: озвучка (speechSynthesis) и распознавание речи (SpeechRecognition); **MediaRecorder** — прослушать свой голос
- **lucide-react** (иконки), **canvas-confetti**, шрифты Plus Jakarta Sans и Bricolage Grotesque (self-hosted через Fontsource)
- **Vitest** — тесты логики (сравнение речи, автопроверка письма, SRS, уровни, целостность контента)

Все звуки, озвучка, иллюстрации и «видео» создаются в браузере — внешних медиафайлов нет.

---

## 📁 Структура проекта

```
src/
├── main.tsx, App.tsx            # точка входа и маршруты
├── index.css                    # дизайн-токены, темы, анимации
├── types.ts                     # типы контента и прогресса
├── data/                        # ВЕСЬ учебный контент
│   ├── units.ts                 # 10 юнитов, их шаги и квизы
│   ├── vocabulary.ts            # 15 категорий, 201 слово
│   ├── grammar.ts               # 15 тем грамматики
│   ├── reading.ts · listening.ts · speaking.ts · writing.ts
│   ├── videos.ts                # видеоуроки (сцены + квизы)
│   ├── book.ts                  # Book Trailer и главы
│   ├── finalTest.ts             # итоговый тест A1
│   ├── achievements.ts · extras.ts (произношение, лидерборд, аватары)
│   └── helpers.ts               # компактные конструкторы упражнений
├── lib/                         # чистая логика (без React)
│   ├── text.ts                  # нормализация, сравнение речи с эталоном
│   ├── writing.ts               # автопроверка письма
│   ├── speech.ts                # озвучка и распознавание речи
│   ├── exercises.ts             # проверка ответов, генераторы упражнений
│   ├── srs.ts · levels.ts · course.ts · search.ts · …
├── store/                       # Zustand: progress (persist), toasts, ui
├── hooks/                       # useSpeechRecognition, useRecorder, useDialogPlayer, …
├── components/
│   ├── layout/                  # AppShell, Sidebar, BottomNav (мобильная), TopBar, поиск, уведомления
│   ├── ui/                      # Button, ProgressBar, ProgressRing, Modal, Segmented, Switch, …
│   ├── exercises/               # ExerciseRunner + Choice / Fill / Order / Match / TrueFalse / Listen
│   ├── lesson/                  # ActivityFlow + экран «Lesson Complete»
│   ├── speaking/ listening/ reading/ writing/ video/ grammar/ vocabulary/ book/ final/ games/ charts/ home/
└── pages/                       # страницы (Home, Learn, UnitPage, LessonStep, центры навыков, Review, Progress, Profile…)
```

Каждый вид активности — переиспользуемый компонент: один и тот же `ReadingActivity` работает и внутри шага юнита,
и в Reading Center. `ActivityFlow` единообразно начисляет XP, обновляет серию и показывает экран завершения.

---

## ✏️ Как изменить или добавить контент

- **Новое слово** — добавьте строку в нужную категорию в `src/data/vocabulary.ts`.
- **Новое упражнение** — используйте конструкторы `mc`, `gap`, `typeIn`, `tf`, `build`, `orderLines`, `match` из `src/data/helpers.ts`.
- **Настоящее видео вместо анимированного урока** — в `src/data/videos.ts` добавьте уроку поле
  `youtubeId: 'XXXXXXXXXXX'` (встраивание через youtube-nocookie) или `videoUrl: '/videos/lesson.mp4'`
  (файл положите в `public/videos/`). Квиз после просмотра останется.

---

## ♿ Доступность и адаптивность

Мобильная версия с нижней навигацией (Home · Learn · Practice · Progress · Profile), режим фокуса в уроках,
управление с клавиатуры (1–4 — варианты, Enter — проверить/далее, Ctrl K — поиск), `prefers-reduced-motion`,
светлая / тёмная / системная тема, подсказки на русском (отключаются в настройках).
