'use client'

import Link from 'next/link'
import { getLessonProgress, isLessonUnlocked } from '@/lib/progress'
import type { Lesson } from '@/types'

interface Props {
  currentLessonId: string
  allLessons: Lesson[]
  moduleId: string
}

export default function Sidebar({ currentLessonId, allLessons, moduleId }: Props) {
  return (
    <aside
      className="w-56 flex-shrink-0 px-4 py-10 hidden md:block"
      style={{ background: '#0f172a', borderRight: '1px solid #1e293b' }}
    >
      <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#475569' }}>
        Module {moduleId}
      </p>
      <div className="space-y-1">
        {allLessons.map(l => {
          const progress = getLessonProgress(l.id)
          const unlocked = isLessonUnlocked(l.id, allLessons)
          const completed = progress.quizPassed && progress.labComplete
          const isCurrent = l.id === currentLessonId
          const icon = completed ? '✅' : unlocked ? '📖' : '🔒'

          if (!unlocked) {
            return (
              <div key={l.id} className="flex items-center gap-2 px-2 py-1.5 opacity-40 cursor-not-allowed">
                <span className="text-xs">{icon}</span>
                <span className="text-xs truncate" style={{ color: '#64748b' }}>{l.title}</span>
              </div>
            )
          }

          return (
            <Link key={l.id} href={`/lesson/${l.id}`}>
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors"
                style={{
                  background: isCurrent ? '#1e293b' : 'transparent',
                  color: isCurrent ? '#f1f5f9' : '#64748b',
                }}
              >
                <span>{icon}</span>
                <span className="truncate">{l.title}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
