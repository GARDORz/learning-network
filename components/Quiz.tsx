'use client'

import { useState, useEffect } from 'react'
import { saveQuizScore, getLessonProgress } from '@/lib/progress'
import type { QuizQuestion } from '@/types'

interface Props {
  lessonId: string
  questions: QuizQuestion[]
}

type QuizState = 'idle' | 'answering' | 'submitted'

export default function Quiz({ lessonId, questions }: Props) {
  const [state, setState] = useState<QuizState>('idle')
  const [selected, setSelected] = useState<(number | null)[]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  useEffect(() => {
    setBestScore(getLessonProgress(lessonId).quizScore)
  }, [lessonId])

  function startQuiz() {
    setSelected(new Array(questions.length).fill(null))
    setState('answering')
  }

  function selectOption(qIdx: number, optIdx: number) {
    setSelected(prev => { const n = [...prev]; n[qIdx] = optIdx; return n })
  }

  function submitQuiz() {
    const correct = questions.filter((q, i) => selected[i] === q.answer).length
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    saveQuizScore(lessonId, pct)
    setBestScore(prev => Math.max(prev, pct))
    setState('submitted')
  }

  const allAnswered = selected.length > 0 && selected.every(s => s !== null)

  if (state === 'idle') {
    return (
      <div className="rounded-lg p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>Quiz</h2>
        <p className="text-sm mb-4" style={{ color: '#64748b' }}>
          {questions.length} ข้อ — ต้องได้ ≥ 70% เพื่อ unlock บทถัดไป
          {bestScore > 0 && <span className="ml-2" style={{ color: '#60a5fa' }}>คะแนนสูงสุด: {bestScore}%</span>}
        </p>
        <button
          onClick={startQuiz}
          className="px-4 py-2 rounded text-sm text-white transition-colors"
          style={{ background: '#2563eb' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
        >
          {bestScore >= 70 ? 'ทำอีกครั้ง' : 'เริ่ม Quiz'}
        </button>
      </div>
    )
  }

  if (state === 'submitted') {
    const passed = score >= 70
    return (
      <div className="rounded-lg p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#f1f5f9' }}>ผลลัพธ์ Quiz</h2>
        <div className="text-3xl font-bold mb-2" style={{ color: passed ? '#4ade80' : '#f87171' }}>
          {score}%
        </div>
        <p className="text-sm mb-5" style={{ color: passed ? '#4ade80' : '#f87171' }}>
          {passed ? '✅ ผ่านแล้ว — ทำ Lab ด้านล่างเพื่อ unlock บทถัดไป' : '❌ ยังไม่ผ่าน (ต้องได้ ≥ 70%)'}
        </p>
        {questions.map((q, i) => {
          const correct = selected[i] === q.answer
          return (
            <div key={i} className="mb-3">
              <p className="text-sm mb-1" style={{ color: '#cbd5e1' }}>
                {i + 1}. {q.question}
                <span className="ml-2" style={{ color: correct ? '#4ade80' : '#f87171' }}>
                  {correct ? '✓' : '✗'}
                </span>
              </p>
              {!correct && (
                <p className="text-xs ml-3" style={{ color: '#64748b' }}>
                  เฉลย: {q.options[q.answer]}
                </p>
              )}
            </div>
          )
        })}
        <button
          onClick={startQuiz}
          className="mt-4 px-4 py-2 rounded text-sm text-white transition-colors"
          style={{ background: '#334155' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#475569')}
          onMouseLeave={e => (e.currentTarget.style.background = '#334155')}
        >
          ทำอีกครั้ง
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg p-6" style={{ background: '#1e293b', border: '1px solid #334155' }}>
      <h2 className="text-lg font-semibold mb-6" style={{ color: '#f1f5f9' }}>Quiz</h2>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="text-sm mb-3" style={{ color: '#e2e8f0' }}>{i + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => selectOption(i, j)}
                  className="w-full text-left px-3 py-2 rounded text-sm transition-colors"
                  style={{
                    border: `1px solid ${selected[i] === j ? '#3b82f6' : '#475569'}`,
                    background: selected[i] === j ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: '#cbd5e1',
                  }}
                >
                  {['A', 'B', 'C', 'D'][j]}. {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={submitQuiz}
        disabled={!allAnswered}
        className="mt-6 px-4 py-2 rounded text-sm text-white transition-colors"
        style={{ background: allAnswered ? '#2563eb' : '#334155', cursor: allAnswered ? 'pointer' : 'not-allowed' }}
      >
        ส่งคำตอบ
      </button>
    </div>
  )
}
