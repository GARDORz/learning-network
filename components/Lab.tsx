'use client'

import { useState, useEffect } from 'react'
import { markLabComplete, getLessonProgress } from '@/lib/progress'
import type { Lab as LabType } from '@/types'

interface Props {
  lessonId: string
  lab: LabType
}

export default function Lab({ lessonId, lab }: Props) {
  const [checked, setChecked] = useState<boolean[]>([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const p = getLessonProgress(lessonId)
    setCompleted(p.labComplete)
    setChecked(new Array(lab.steps.length).fill(p.labComplete))
  }, [lessonId, lab.steps.length])

  function toggleStep(i: number) {
    if (completed) return
    setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n })
  }

  function complete() {
    markLabComplete(lessonId)
    setCompleted(true)
    setChecked(new Array(lab.steps.length).fill(true))
  }

  const allChecked = checked.length > 0 && checked.every(Boolean)

  return (
    <div className="rounded-lg p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.15)' }}>
          LAB
        </span>
        <h2 className="text-lg font-semibold" style={{ color: '#f1f5f9' }}>{lab.title}</h2>
      </div>
      <p className="text-sm mb-5" style={{ color: '#64748b' }}>{lab.scenario}</p>

      <div className="space-y-3 mb-6">
        {lab.steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className="w-full text-left flex items-start gap-3 p-3 rounded transition-colors"
            style={{
              border: `1px solid ${checked[i] ? '#166534' : '#475569'}`,
              background: checked[i] ? 'rgba(22,101,52,0.2)' : 'transparent',
            }}
          >
            <span className="mt-0.5 text-sm flex-shrink-0" style={{ color: checked[i] ? '#4ade80' : '#475569' }}>
              {checked[i] ? '☑' : '☐'}
            </span>
            <span className="text-sm" style={{ color: '#cbd5e1' }}>{step}</span>
          </button>
        ))}
      </div>

      {completed ? (
        <div className="flex items-center gap-2 text-sm" style={{ color: '#4ade80' }}>
          <span>✅</span>
          <span>Lab เสร็จแล้ว</span>
        </div>
      ) : (
        <button
          onClick={complete}
          disabled={!allChecked}
          className="px-4 py-2 rounded text-sm text-white transition-colors"
          style={{
            background: allChecked ? '#15803d' : '#334155',
            cursor: allChecked ? 'pointer' : 'not-allowed',
          }}
        >
          Mark Lab Complete
        </button>
      )}
    </div>
  )
}
