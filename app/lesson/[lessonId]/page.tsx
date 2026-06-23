import { getLessonById, getAllLessons, getModuleById } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LessonContent from '@/components/LessonContent'
import Quiz from '@/components/Quiz'
import Lab from '@/components/Lab'
import Sidebar from '@/components/Sidebar'

interface Props {
  params: Promise<{ lessonId: string }>
}

export function generateStaticParams() {
  return getAllLessons().map(l => ({ lessonId: l.id }))
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  const lesson = getLessonById(lessonId)
  if (!lesson) notFound()

  const module = getModuleById(lesson.moduleId)
  const allLessons = module
    ? [...module.lessons].sort((a, b) => a.order - b.order)
    : []

  return (
    <div className="flex min-h-screen">
      <Sidebar currentLessonId={lesson.id} allLessons={allLessons} moduleId={lesson.moduleId} />

      <main className="flex-1 px-6 py-10 max-w-3xl">
        <Link
          href={`/module/${lesson.moduleId}`}
          className="text-sm mb-6 inline-block"
          style={{ color: '#64748b' }}
        >
          ← Module {lesson.moduleId}
        </Link>

        <h1 className="text-2xl font-bold mb-8" style={{ color: '#f1f5f9' }}>{lesson.title}</h1>

        <LessonContent content={lesson.content} />

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #1e293b' }}>
          <Quiz lessonId={lesson.id} questions={lesson.quiz} />
        </div>

        <div className="mt-8">
          <Lab lessonId={lesson.id} lab={lesson.lab} />
        </div>
      </main>
    </div>
  )
}
