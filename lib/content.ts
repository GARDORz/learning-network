import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Lesson, Module } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

const MODULE_META: Record<string, { title: string; description: string }> = {
  '1': { title: 'Network Fundamentals', description: 'OSI Model, TCP/IP, อุปกรณ์เครือข่าย' },
  '2': { title: 'IP Addressing', description: 'IPv4, Subnetting, VLSM, IPv6' },
  '3': { title: 'Switching', description: 'VLANs, STP, EtherChannel' },
  '4': { title: 'Routing', description: 'Static Routes, OSPF, inter-VLAN' },
  '5': { title: 'Network Services', description: 'DNS, DHCP, NAT, HTTP/S' },
  '6': { title: 'Security & WAN', description: 'ACLs, Firewalls, VPN' },
}

export function getAllLessons(): Lesson[] {
  const lessons: Lesson[] = []

  for (let m = 1; m <= 6; m++) {
    const moduleDir = path.join(CONTENT_DIR, `module-${m}`)
    if (!fs.existsSync(moduleDir)) continue

    const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(moduleDir, file), 'utf-8')
      const { data, content } = matter(raw)
      lessons.push({
        id: data.id,
        moduleId: data.moduleId,
        title: data.title,
        order: data.order,
        content,
        quiz: data.quiz ?? [],
        lab: data.lab ?? { title: '', scenario: '', steps: [] },
      })
    }
  }

  return lessons.sort((a, b) => {
    if (a.moduleId !== b.moduleId) return Number(a.moduleId) - Number(b.moduleId)
    return a.order - b.order
  })
}

export function getLessonById(id: string): Lesson | null {
  return getAllLessons().find(l => l.id === id) ?? null
}

export function getModules(): Module[] {
  const lessons = getAllLessons()
  return Object.entries(MODULE_META).map(([id, meta]) => ({
    id,
    ...meta,
    lessons: lessons.filter(l => l.moduleId === id),
  }))
}

export function getModuleById(id: string): Module | null {
  return getModules().find(m => m.id === id) ?? null
}
