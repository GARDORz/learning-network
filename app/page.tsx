import { getModules, getAllLessons } from '@/lib/content'
import ModuleCard from '@/components/ModuleCard'
import StatsRow from '@/components/StatsRow'

export default function DashboardPage() {
  const modules = getModules()
  const allLessons = getAllLessons()

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Network Learning</h1>
        <p className="text-sm" style={{ color: '#64748b' }}>พื้นฐานถึงระดับ CCNA</p>
      </div>

      <StatsRow allLessons={allLessons} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {modules.map(m => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
    </main>
  )
}
