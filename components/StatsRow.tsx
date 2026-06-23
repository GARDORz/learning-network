'use client'

import ProgressBar from './ProgressBar'
import { getOverallStats } from '@/lib/progress'
import type { Lesson } from '@/types'

interface Props {
  allLessons: Lesson[]
}

export default function StatsRow({ allLessons }: Props) {
  const stats = getOverallStats(allLessons)
  const pct = allLessons.length
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0

  return (
    <div className="rounded-lg p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: '#cbd5e1' }}>Overall Progress</span>
        <span className="text-sm font-mono" style={{ color: '#60a5fa' }}>{pct}%</span>
      </div>
      <ProgressBar value={pct} className="mb-4" />
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
            {stats.completedLessons}/{stats.totalLessons}
          </p>
          <p className="text-xs" style={{ color: '#64748b' }}>Lessons</p>
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: '#f1f5f9' }}>{stats.quizPassed}</p>
          <p className="text-xs" style={{ color: '#64748b' }}>Quiz ผ่าน</p>
        </div>
        <div>
          <p className="text-xl font-bold" style={{ color: '#f1f5f9' }}>{stats.labsComplete}</p>
          <p className="text-xs" style={{ color: '#64748b' }}>Labs เสร็จ</p>
        </div>
      </div>
    </div>
  )
}
