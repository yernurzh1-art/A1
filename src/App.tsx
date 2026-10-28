import { Fragment, lazy, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsSync } from '@/components/layout/SettingsSync'
import Home from '@/pages/Home'

const Welcome = lazy(() => import('@/pages/Welcome'))
const Learn = lazy(() => import('@/pages/Learn'))
const UnitPage = lazy(() => import('@/pages/UnitPage'))
const LessonStep = lazy(() => import('@/pages/LessonStep'))
const Practice = lazy(() => import('@/pages/practice/Practice'))
const DailyChallenge = lazy(() => import('@/pages/practice/DailyChallenge'))
const Pronunciation = lazy(() => import('@/pages/practice/Pronunciation'))
const MatchGame = lazy(() => import('@/pages/practice/Games').then((m) => ({ default: m.MatchGame })))
const SpellingBee = lazy(() => import('@/pages/practice/Games').then((m) => ({ default: m.SpellingBee })))
const SentenceBuilder = lazy(() => import('@/pages/practice/Games').then((m) => ({ default: m.SentenceBuilder })))
const SpeakingCenter = lazy(() => import('@/pages/centers/SpeakingCenter'))
const SpeakingTaskPage = lazy(() => import('@/pages/centers/SpeakingTaskPage'))
const ListeningCenter = lazy(() => import('@/pages/centers/ListeningCenter'))
const ListeningTaskPage = lazy(() => import('@/pages/centers/ListeningTaskPage'))
const ReadingCenter = lazy(() => import('@/pages/centers/ReadingCenter'))
const ReadingTaskPage = lazy(() => import('@/pages/centers/ReadingTaskPage'))
const WritingCenter = lazy(() => import('@/pages/centers/WritingCenter'))
const WritingTaskPage = lazy(() => import('@/pages/centers/WritingTaskPage'))
const GrammarCenter = lazy(() => import('@/pages/centers/GrammarCenter'))
const GrammarTopicPage = lazy(() => import('@/pages/centers/GrammarTopicPage'))
const VocabularyCenter = lazy(() => import('@/pages/centers/VocabularyCenter'))
const VocabularyCategory = lazy(() => import('@/pages/centers/VocabularyCategory'))
const VocabReview = lazy(() => import('@/pages/centers/VocabReview'))
const VideoLessons = lazy(() => import('@/pages/centers/VideoLessons'))
const VideoLessonPage = lazy(() => import('@/pages/centers/VideoLessonPage'))
const BookTrailer = lazy(() => import('@/pages/book/BookTrailer'))
const BookChapter = lazy(() => import('@/pages/book/BookChapter'))
const ReviewMistakes = lazy(() => import('@/pages/review/ReviewMistakes'))
const ReviewPractice = lazy(() => import('@/pages/review/ReviewPractice'))
const ProgressPage = lazy(() => import('@/pages/ProgressPage'))
const Profile = lazy(() => import('@/pages/Profile'))
const Leaderboard = lazy(() => import('@/pages/Leaderboard'))
const FinalTestPage = lazy(() => import('@/pages/FinalTestPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Remount a page when its URL changes (e.g. /grammar/a → /grammar/b) so its state resets. */
function Keyed({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <Fragment key={pathname}>{children}</Fragment>
}

export default function App() {
  return (
    <>
      <SettingsSync />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:unitId" element={<Keyed><UnitPage /></Keyed>} />
          <Route path="learn/:unitId/:step" element={<Keyed><LessonStep /></Keyed>} />
          <Route path="practice" element={<Practice />} />
          <Route path="challenge" element={<DailyChallenge />} />
          <Route path="pronunciation" element={<Pronunciation />} />
          <Route path="games/match" element={<MatchGame />} />
          <Route path="games/spelling" element={<SpellingBee />} />
          <Route path="games/builder" element={<SentenceBuilder />} />
          <Route path="speaking" element={<SpeakingCenter />} />
          <Route path="speaking/:id" element={<Keyed><SpeakingTaskPage /></Keyed>} />
          <Route path="listening" element={<ListeningCenter />} />
          <Route path="listening/:id" element={<Keyed><ListeningTaskPage /></Keyed>} />
          <Route path="reading" element={<ReadingCenter />} />
          <Route path="reading/:id" element={<Keyed><ReadingTaskPage /></Keyed>} />
          <Route path="writing" element={<WritingCenter />} />
          <Route path="writing/:id" element={<Keyed><WritingTaskPage /></Keyed>} />
          <Route path="grammar" element={<GrammarCenter />} />
          <Route path="grammar/:id" element={<Keyed><GrammarTopicPage /></Keyed>} />
          <Route path="vocabulary" element={<VocabularyCenter />} />
          <Route path="vocabulary/review" element={<VocabReview />} />
          <Route path="vocabulary/:categoryId" element={<Keyed><VocabularyCategory /></Keyed>} />
          <Route path="videos" element={<VideoLessons />} />
          <Route path="videos/:id" element={<Keyed><VideoLessonPage /></Keyed>} />
          <Route path="book" element={<BookTrailer />} />
          <Route path="book/chapter/:chapterId" element={<Keyed><BookChapter /></Keyed>} />
          <Route path="review" element={<ReviewMistakes />} />
          <Route path="review/practice" element={<ReviewPractice />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="final-test" element={<FinalTestPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
