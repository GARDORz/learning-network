'use client'

import Link from 'next/link'
import { getLessonProgress, isLessonUnlocked } from '@/lib/progress'
import type { Lesson } from '@/types'

interface Props {
  lesson: Lesson
  allLessons: Lesson[]
}

export default function LessonListItem({ lesson, allLessons }: Props) {
  const progress = getLessonProgress(lesson.id)
  const unlocked = isLessonUnlocked(lesson.id, allLessons)
  const completed = progress.quizPassed && progress.labComplete
  const icon = completed ? '✅' : unlocked ? '📖' : '🔒'

  if (!unlocked) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-lg opacity-50 cursor-not-allowed"
        style={{ background: '#1e293b', border: '1px solid #334155' }}
      >
        <span>{icon}</span>
        <span className="text-sm" style={{ color: '#64748b' }}>{lesson.title}</span>
      </div>
    )
  }

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <div
        className="flex items-center gap-3 p-3 rounded-lg transition-colors"
        style={{ background: '#1e293b', border: '1px solid #334155' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
      >
        <span>{icon}</span>
        <div className="flex-1">
          <span className="text-sm" style={{ color: '#e2e8f0' }}>{lesson.title}</span>
          {progress.quizScore > 0 && (
            <span className="ml-2 text-xs" style={{ color: '#64748b' }}>Quiz: {progress.quizScore}%</span>
          )}
        </div>
      </div>
    </Link>
  )
}
