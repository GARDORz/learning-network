import type { AllProgress, LessonProgress, Lesson } from '@/types'

const STORAGE_KEY = 'network-learning-progress'

const defaultLesson = (): LessonProgress => ({
  read: false,
  quizScore: 0,
  quizPassed: false,
  labComplete: false,
})

export function getProgress(): AllProgress {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress: AllProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getLessonProgress(lessonId: string): LessonProgress {
  return getProgress()[lessonId] ?? defaultLesson()
}

export function markRead(lessonId: string): void {
  const progress = getProgress()
  progress[lessonId] = { ...defaultLesson(), ...progress[lessonId], read: true }
  saveProgress(progress)
}

export function saveQuizScore(lessonId: string, score: number): void {
  const progress = getProgress()
  const current = progress[lessonId] ?? defaultLesson()
  const best = Math.max(current.quizScore, score)
  progress[lessonId] = { ...current, quizScore: best, quizPassed: best >= 70 }
  saveProgress(progress)
}

export function markLabComplete(lessonId: string): void {
  const progress = getProgress()
  progress[lessonId] = { ...defaultLesson(), ...progress[lessonId], labComplete: true }
  saveProgress(progress)
}

export function isLessonUnlocked(lessonId: string, allLessons: Lesson[]): boolean {
  const sorted = [...allLessons].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex(l => l.id === lessonId)
  if (idx <= 0) return true
  const prev = sorted[idx - 1]
  const prevProgress = getLessonProgress(prev.id)
  return prevProgress.quizPassed && prevProgress.labComplete
}

export function getModuleProgress(lessons: Lesson[]): number {
  if (lessons.length === 0) return 0
  const progress = getProgress()
  const completed = lessons.filter(l => {
    const p = progress[l.id]
    return p?.quizPassed && p?.labComplete
  }).length
  return Math.round((completed / lessons.length) * 100)
}

export function getOverallStats(allLessons: Lesson[]): {
  totalLessons: number
  completedLessons: number
  quizPassed: number
  labsComplete: number
} {
  const progress = getProgress()
  const totalLessons = allLessons.length
  const completedLessons = allLessons.filter(l => {
    const p = progress[l.id]
    return p?.quizPassed && p?.labComplete
  }).length
  const quizPassed = allLessons.filter(l => progress[l.id]?.quizPassed).length
  const labsComplete = allLessons.filter(l => progress[l.id]?.labComplete).length
  return { totalLessons, completedLessons, quizPassed, labsComplete }
}
