import { getModuleById, getModules } from '@/lib/content'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LessonListItem from '@/components/LessonListItem'

interface Props {
  params: Promise<{ moduleId: string }>
}

export function generateStaticParams() {
  return getModules().map(m => ({ moduleId: m.id }))
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params
  const module = getModuleById(moduleId)
  if (!module) notFound()

  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order)

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/" className="text-sm mb-6 inline-block" style={{ color: '#64748b' }}>
        ← Dashboard
      </Link>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#f1f5f9' }}>
        Module {module.id}: {module.title}
      </h1>
      <p className="text-sm mb-8" style={{ color: '#64748b' }}>{module.description}</p>

      <div className="space-y-2">
        {sortedLessons.map(lesson => (
          <LessonListItem key={lesson.id} lesson={lesson} allLessons={sortedLessons} />
        ))}
      </div>
    </main>
  )
}
