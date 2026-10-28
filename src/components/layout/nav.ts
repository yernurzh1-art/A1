import {
  BookOpen,
  ChartColumn,
  Clapperboard,
  Crown,
  Dumbbell,
  Film,
  GraduationCap,
  Headphones,
  House,
  Languages,
  Mic,
  PenLine,
  Puzzle,
  RefreshCw,
  Trophy,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Tailwind text colour for the icon. */
  color?: string
}

export const MAIN_NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: House },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: ChartColumn },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export const SKILL_NAV: NavItem[] = [
  { to: '/speaking', label: 'Speaking', icon: Mic, color: 'text-rose-500' },
  { to: '/listening', label: 'Listening', icon: Headphones, color: 'text-cyan-500' },
  { to: '/reading', label: 'Reading', icon: BookOpen, color: 'text-emerald-500' },
  { to: '/writing', label: 'Writing', icon: PenLine, color: 'text-orange-500' },
  { to: '/grammar', label: 'Grammar', icon: Puzzle, color: 'text-blue-500' },
  { to: '/vocabulary', label: 'Vocabulary', icon: Languages, color: 'text-violet-500' },
  { to: '/videos', label: 'Video Lessons', icon: Clapperboard, color: 'text-fuchsia-500' },
  { to: '/book', label: 'Book Trailer', icon: Film, color: 'text-indigo-500' },
]

export const MORE_NAV: NavItem[] = [
  { to: '/review', label: 'Review Mistakes', icon: RefreshCw, color: 'text-amber-500' },
  { to: '/leaderboard', label: 'Leaderboard', icon: Crown, color: 'text-yellow-500' },
  { to: '/final-test', label: 'Final A1 Test', icon: Trophy, color: 'text-amber-500' },
]

/** Routes where the learner is inside an activity: the bottom nav is hidden. */
export const FOCUS_ROUTE = /^\/(learn\/[^/]+\/[^/]+|speaking\/[^/]+|listening\/[^/]+|reading\/[^/]+|writing\/[^/]+|videos\/[^/]+|challenge|final-test|games\/.+|review\/practice|vocabulary\/review|welcome)/
