'use client'

import Link from 'next/link'
import ProgressBar from './ProgressBar'
import { getModuleProgress } from '@/lib/progress'
import type { Module } from '@/types'

interface Props {
  module: Module
}

export default function ModuleCard({ module }: Props) {
  const progress = getModuleProgress(module.lessons)

  return (
    <Link href={`/module/${module.id}`}>
      <div
        className="rounded-lg p-5 cursor-pointer transition-colors h-full"
        style={{ background: '#1e293b', border: '1px solid #334155' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#334155')}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-mono" style={{ color: '#64748b' }}>Module {module.id}</span>
          <span className="text-xs font-mono" style={{ color: '#60a5fa' }}>{progress}%</span>
        </div>
        <h3 className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>{module.title}</h3>
        <p className="text-sm mb-4" style={{ color: '#64748b' }}>{module.description}</p>
        <ProgressBar value={progress} />
        <p className="text-xs mt-2" style={{ color: '#475569' }}>{module.lessons.length} lessons</p>
      </div>
    </Link>
  )
}
