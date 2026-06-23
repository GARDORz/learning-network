# Network Learning Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็บไซต์เรียน Network ส่วนตัวครอบคลุมระดับ CCNA พร้อม Quiz, Lab และ Dashboard ติดตาม progress

**Architecture:** Next.js App Router แบบ static — content อยู่ใน Markdown files อ่านด้วย `fs` ที่ build time, progress เก็บใน localStorage ฝั่ง client, ไม่มี backend หรือ database

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v3, gray-matter, react-markdown, localStorage

## Global Constraints

- Node.js 18+
- Next.js 14 with App Router (`app/` directory)
- TypeScript strict mode
- Tailwind CSS — dark theme เป็น default (ไม่ใช้ `dark:` prefix, ใช้สีมืดตลอด)
- UI: เรียบง่าย (simple/clean), สี neutral dark (#0f172a background, #e2e8f0 text)
- Quiz pass threshold: 70%
- Lesson unlock: ต้องผ่าน quiz (≥70%) AND mark lab complete
- ไม่มี authentication, ไม่มี server-side state

---

## File Map

```
webnetwork/
├── content/
│   ├── module-1/
│   │   ├── lesson-1-1.md     OSI Model
│   │   ├── lesson-1-2.md     TCP/IP Model
│   │   └── lesson-1-3.md     Network Devices
│   ├── module-2/
│   │   ├── lesson-2-1.md     IPv4 Addressing
│   │   └── lesson-2-2.md     Subnetting
│   ├── module-3/lesson-3-1.md
│   ├── module-4/lesson-4-1.md
│   ├── module-5/lesson-5-1.md
│   └── module-6/lesson-6-1.md
├── app/
│   ├── layout.tsx            root layout, dark bg
│   ├── page.tsx              Dashboard
│   ├── module/[moduleId]/page.tsx
│   └── lesson/[lessonId]/page.tsx
├── components/
│   ├── ProgressBar.tsx
│   ├── ModuleCard.tsx
│   ├── Sidebar.tsx
│   ├── LessonContent.tsx
│   ├── Quiz.tsx
│   └── Lab.tsx
├── lib/
│   ├── content.ts            อ่าน + parse Markdown files
│   └── progress.ts           localStorage helpers
└── types/index.ts
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json` (auto-generated)
- Create: `app/layout.tsx`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd C:/Users/pongs/webnetwork
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

เมื่อถาม prompt ตอบ:
- Use TypeScript? → Yes
- Use ESLint? → Yes
- Use Tailwind CSS? → Yes
- Use `src/` directory? → No
- Use App Router? → Yes
- Customize import alias? → No (ใช้ @/*)

- [ ] **Step 2: ลบไฟล์ default ที่ไม่ต้องการ**

```bash
rm app/page.tsx app/globals.css
```

- [ ] **Step 3: สร้าง `app/globals.css`** ที่ override Tailwind base

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0f172a;
  color: #e2e8f0;
}

.prose pre {
  background-color: #1e293b !important;
}
```

- [ ] **Step 4: สร้าง `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Network Learning',
  description: 'เรียน Network พื้นฐานถึง CCNA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-slate-900 text-slate-200 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: สร้าง folder structure**

```bash
mkdir -p content/module-{1,2,3,4,5,6}
mkdir -p components lib types
mkdir -p app/module/\[moduleId\]
mkdir -p app/lesson/\[lessonId\]
```

- [ ] **Step 6: Install dependencies**

```bash
npm install gray-matter react-markdown remark-gfm
npm install --save-dev @types/node
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: server รันที่ `http://localhost:3000` ไม่มี error

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Tailwind"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `types/index.ts`

**Produces:**
- `QuizQuestion`, `Lab`, `Lesson`, `Module`, `LessonProgress`, `AllProgress` types
- ใช้ใน Task 3, 4, 6, 7, 8, 9, 10

- [ ] **Step 1: สร้าง `types/index.ts`**

```typescript
export interface QuizQuestion {
  question: string
  options: string[]
  answer: number  // index ของ correct answer ใน options
}

export interface Lab {
  title: string
  scenario: string
  steps: string[]
}

export interface Lesson {
  id: string          // เช่น "1-1"
  moduleId: string    // เช่น "1"
  title: string
  order: number
  content: string     // Markdown string
  quiz: QuizQuestion[]
  lab: Lab
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export interface LessonProgress {
  read: boolean
  quizScore: number    // 0-100, คะแนนสูงสุด
  quizPassed: boolean  // score >= 70
  labComplete: boolean
}

export interface AllProgress {
  [lessonId: string]: LessonProgress
}
```

- [ ] **Step 2: Commit**

```bash
git add types/index.ts
git commit -m "feat: add TypeScript types"
```

---

## Task 3: Progress Store (localStorage)

**Files:**
- Create: `lib/progress.ts`

**Interfaces:**
- Consumes: `LessonProgress`, `AllProgress` จาก `types/index.ts`
- Produces:
  - `getProgress(): AllProgress`
  - `getLessonProgress(lessonId: string): LessonProgress`
  - `markRead(lessonId: string): void`
  - `saveQuizScore(lessonId: string, score: number): void`
  - `markLabComplete(lessonId: string): void`
  - `isLessonUnlocked(lessonId: string, allLessons: Lesson[]): boolean`

- [ ] **Step 1: สร้าง `lib/progress.ts`**

```typescript
import type { AllProgress, LessonProgress, Lesson } from '@/types'

const STORAGE_KEY = 'network-learning-progress'

const defaultLesson = (): LessonProgress => ({
  read: false,
  quizScore: 0,
  quizPassed: false,
  labComplete: false,
})

export function getProgress(): AllProgress {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress: AllProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getLessonProgress(lessonId: string): LessonProgress {
  return getProgress()[lessonId] ?? defaultLesson()
}

export function markRead(lessonId: string): void {
  const progress = getProgress()
  progress[lessonId] = { ...defaultLesson(), ...progress[lessonId], read: true }
  saveProgress(progress)
}

export function saveQuizScore(lessonId: string, score: number): void {
  const progress = getProgress()
  const current = progress[lessonId] ?? defaultLesson()
  const best = Math.max(current.quizScore, score)
  progress[lessonId] = { ...current, quizScore: best, quizPassed: best >= 70 }
  saveProgress(progress)
}

export function markLabComplete(lessonId: string): void {
  const progress = getProgress()
  progress[lessonId] = { ...defaultLesson(), ...progress[lessonId], labComplete: true }
  saveProgress(progress)
}

export function isLessonUnlocked(lessonId: string, allLessons: Lesson[]): boolean {
  // Lesson แรกของแต่ละ module ไม่ต้อง unlock
  const sorted = [...allLessons].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex(l => l.id === lessonId)
  if (idx <= 0) return true

  const prev = sorted[idx - 1]
  const prevProgress = getLessonProgress(prev.id)
  return prevProgress.quizPassed && prevProgress.labComplete
}

export function getModuleProgress(lessons: Lesson[]): number {
  if (lessons.length === 0) return 0
  const progress = getProgress()
  const completed = lessons.filter(l => {
    const p = progress[l.id]
    return p?.quizPassed && p?.labComplete
  }).length
  return Math.round((completed / lessons.length) * 100)
}

export function getOverallStats(allLessons: Lesson[]): {
  totalLessons: number
  completedLessons: number
  quizPassed: number
  labsComplete: number
} {
  const progress = getProgress()
  const totalLessons = allLessons.length
  const completedLessons = allLessons.filter(l => {
    const p = progress[l.id]
    return p?.quizPassed && p?.labComplete
  }).length
  const quizPassed = allLessons.filter(l => progress[l.id]?.quizPassed).length
  const labsComplete = allLessons.filter(l => progress[l.id]?.labComplete).length
  return { totalLessons, completedLessons, quizPassed, labsComplete }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/progress.ts
git commit -m "feat: add localStorage progress store"
```

---

## Task 4: Content Loader

**Files:**
- Create: `lib/content.ts`

**Interfaces:**
- Consumes: `Lesson`, `Module` จาก `types/index.ts`
- Produces:
  - `getAllLessons(): Lesson[]`
  - `getLessonById(id: string): Lesson | null`
  - `getModules(): Module[]`
  - `getModuleById(id: string): Module | null`

- [ ] **Step 1: สร้าง `lib/content.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: ไม่มี error

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add Markdown content loader"
```

---

## Task 5: Module 1 Content (OSI, TCP/IP, Devices)

**Files:**
- Create: `content/module-1/lesson-1-1.md`
- Create: `content/module-1/lesson-1-2.md`
- Create: `content/module-1/lesson-1-3.md`

- [ ] **Step 1: สร้าง `content/module-1/lesson-1-1.md`**

```markdown
---
id: "1-1"
moduleId: "1"
title: "OSI Model"
order: 1
quiz:
  - question: "OSI model มีกี่ layer?"
    options: ["4", "5", "6", "7"]
    answer: 3
  - question: "Layer ใดรับผิดชอบการกำหนด IP address?"
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"]
    answer: 1
  - question: "TCP อยู่ใน layer ใดของ OSI?"
    options: ["Layer 3", "Layer 4", "Layer 5", "Layer 6"]
    answer: 1
  - question: "Physical layer ทำหน้าที่อะไร?"
    options: ["เข้ารหัสข้อมูล", "ส่ง bit ผ่าน medium", "จัดการ MAC address", "route packet"]
    answer: 1
  - question: "Layer ใดเรียกหน่วยข้อมูลว่า 'frame'?"
    options: ["Network", "Transport", "Data Link", "Physical"]
    answer: 2
lab:
  title: "จับคู่ OSI Layer กับ Protocol"
  scenario: "จับคู่ protocol/เทคโนโลยีต่อไปนี้กับ OSI layer ที่ถูกต้อง แล้ว check ✓ เมื่อแต่ละข้อถูกต้อง"
  steps:
    - "HTTP, HTTPS, FTP, DNS → Layer 7 (Application)"
    - "SSL/TLS → Layer 6 (Presentation)"
    - "TCP, UDP → Layer 4 (Transport)"
    - "IP, ICMP, routing protocols → Layer 3 (Network)"
    - "Ethernet, MAC address, switches → Layer 2 (Data Link)"
    - "Cables, fiber, wireless signals → Layer 1 (Physical)"
---

## OSI Model คืออะไร?

OSI (Open Systems Interconnection) Model เป็น framework ที่อธิบายว่าข้อมูลถูกส่งผ่านเครือข่ายอย่างไร โดยแบ่งเป็น **7 Layer** แต่ละ layer มีหน้าที่เฉพาะเจาะจง

## 7 Layers

| Layer | ชื่อ | หน้าที่หลัก | ตัวอย่าง PDU |
|-------|------|------------|-------------|
| 7 | Application | Interface กับ user | Data |
| 6 | Presentation | เข้ารหัส, บีบอัด, แปลงรูปแบบ | Data |
| 5 | Session | จัดการ session | Data |
| 4 | Transport | end-to-end delivery, error recovery | Segment |
| 3 | Network | routing, logical addressing | Packet |
| 2 | Data Link | framing, MAC address, error detection | Frame |
| 1 | Physical | ส่ง bit ผ่าน medium | Bit |

## จำง่ายด้วย Mnemonic

**"All People Seem To Need Data Processing"**
- **A**ll → Application
- **P**eople → Presentation
- **S**eem → Session
- **T**o → Transport
- **N**eed → Network
- **D**ata → Data Link
- **P**rocessing → Physical

## Encapsulation และ Decapsulation

เมื่อส่งข้อมูล ทุก layer จะเพิ่ม **header** ของตัวเองลงไป (Encapsulation) และเมื่อรับข้อมูล จะถอด header ออก (Decapsulation)

```
Application Data
    ↓ + L7 header
    ↓ + L6 header
    ↓ + L5 header
    ↓ + TCP/UDP header  → Segment
    ↓ + IP header       → Packet
    ↓ + Ethernet header + trailer → Frame
    ↓ 1010110...         → Bits
```

## Layer 2 vs Layer 3

- **Layer 2 (Data Link):** ทำงานใน LAN เดียวกัน, ใช้ MAC address, อุปกรณ์คือ Switch
- **Layer 3 (Network):** ทำงานข้าม network, ใช้ IP address, อุปกรณ์คือ Router
```

- [ ] **Step 2: สร้าง `content/module-1/lesson-1-2.md`**

```markdown
---
id: "1-2"
moduleId: "1"
title: "TCP/IP Model"
order: 2
quiz:
  - question: "TCP/IP model มีกี่ layer?"
    options: ["3", "4", "5", "7"]
    answer: 1
  - question: "OSI Layer 5-7 correspond กับ TCP/IP layer ใด?"
    options: ["Internet", "Transport", "Application", "Network Access"]
    answer: 2
  - question: "TCP แตกต่างจาก UDP อย่างไร?"
    options: ["TCP เร็วกว่า UDP", "TCP มี error recovery, UDP ไม่มี", "UDP ใช้ IP address", "TCP ไม่มี handshake"]
    answer: 1
  - question: "Three-way handshake ของ TCP คืออะไร?"
    options: ["ACK-SYN-ACK", "SYN-SYN/ACK-ACK", "SYN-ACK-FIN", "RST-SYN-ACK"]
    answer: 1
  - question: "Port 443 ใช้สำหรับอะไร?"
    options: ["HTTP", "FTP", "HTTPS", "SSH"]
    answer: 2
lab:
  title: "วิเคราะห์ TCP vs UDP Use Cases"
  scenario: "พิจารณาแต่ละ use case แล้วตัดสินใจว่าควรใช้ TCP หรือ UDP"
  steps:
    - "Video streaming (YouTube, Netflix) → UDP (ความเร็วสำคัญกว่า reliability)"
    - "การโอนไฟล์ (FTP, SFTP) → TCP (ต้องครบทุก byte)"
    - "DNS query → UDP (ข้อมูลน้อย, latency สำคัญ)"
    - "Web browsing (HTTP/HTTPS) → TCP (ต้องการ reliability)"
    - "Online gaming → UDP (latency ต่ำสำคัญ)"
    - "Email (SMTP) → TCP (ต้องส่งครบ)"
---

## TCP/IP Model

TCP/IP model (หรือเรียกว่า Internet model) เป็น model จริงที่ใช้งานบน Internet ปัจจุบัน มี **4 Layer**

| TCP/IP Layer | สอดคล้องกับ OSI | Protocol ตัวอย่าง |
|-------------|----------------|-----------------|
| Application | L5-L7 | HTTP, DNS, SMTP, FTP |
| Transport | L4 | TCP, UDP |
| Internet | L3 | IP, ICMP, ARP |
| Network Access | L1-L2 | Ethernet, Wi-Fi |

## TCP vs UDP

### TCP (Transmission Control Protocol)
- **Connection-oriented** — ต้องทำ 3-way handshake ก่อน
- **Reliable** — มี acknowledgment, retransmission
- **Ordered** — ข้อมูลมาถึงเรียงลำดับ
- **ช้ากว่า** เพราะมี overhead

### UDP (User Datagram Protocol)
- **Connectionless** — ส่งทันทีไม่ต้อง handshake
- **Unreliable** — ไม่มี acknowledgment
- **เร็วกว่า** เหมาะกับ real-time application

## TCP Three-Way Handshake

```
Client          Server
  |---SYN------->|   "ขอเชื่อมต่อ"
  |<--SYN/ACK----|   "โอเค พร้อมแล้ว"
  |---ACK-------->|   "รับทราบ"
  [Connection established]
```

## Well-Known Ports

| Port | Protocol | ใช้สำหรับ |
|------|----------|----------|
| 20/21 | FTP | File transfer |
| 22 | SSH | Secure remote access |
| 23 | Telnet | Remote access (ไม่ปลอดภัย) |
| 25 | SMTP | Email sending |
| 53 | DNS | Name resolution |
| 80 | HTTP | Web |
| 110 | POP3 | Email receiving |
| 443 | HTTPS | Secure web |
```

- [ ] **Step 3: สร้าง `content/module-1/lesson-1-3.md`**

```markdown
---
id: "1-3"
moduleId: "1"
title: "Network Devices"
order: 3
quiz:
  - question: "Switch ทำงานที่ OSI Layer ใด?"
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"]
    answer: 1
  - question: "Router ใช้อะไรในการ forward packet?"
    options: ["MAC address", "IP address", "Port number", "VLAN ID"]
    answer: 1
  - question: "Hub แตกต่างจาก Switch อย่างไร?"
    options: ["Hub ทำงานที่ Layer 3", "Hub ส่งข้อมูลออกทุก port, Switch ส่งเฉพาะ port ปลายทาง", "Switch ไม่มี MAC table", "Hub เร็วกว่า Switch"]
    answer: 1
  - question: "Firewall ทำหน้าที่อะไร?"
    options: ["เพิ่มความเร็วเครือข่าย", "กรอง traffic ตาม rules", "แปลง IP address", "จ่าย IP address อัตโนมัติ"]
    answer: 1
  - question: "อุปกรณ์ใดทำหน้าที่ NAT ได้?"
    options: ["Hub", "Switch", "Router", "Repeater"]
    answer: 2
lab:
  title: "ออกแบบ Network Topology"
  scenario: "บริษัทมี 20 PC, 1 Server, และต้องการเชื่อมต่ออินเทอร์เน็ต ให้เลือกอุปกรณ์และอธิบายหน้าที่"
  steps:
    - "เลือก Switch 24-port เพื่อเชื่อม PC และ Server เข้าด้วยกันใน LAN"
    - "เลือก Router เพื่อเชื่อมต่อ LAN ออกสู่ Internet (ISP)"
    - "วาง Firewall ระหว่าง Router กับ Switch เพื่อกรอง traffic"
    - "ตรวจสอบว่า Router ทำ NAT เพื่อแปลง private IP → public IP"
    - "สรุป: Hub ห้ามใช้ใน network จริง เพราะ broadcast ทุก frame ออกทุก port"
---

## Network Devices

### Hub (Layer 1)
- รับข้อมูลแล้ว **broadcast ออกทุก port**
- ทำให้เกิด collision บ่อย
- **ไม่ใช้ในเครือข่ายสมัยใหม่แล้ว**

### Switch (Layer 2)
- เรียนรู้ **MAC address** ของแต่ละ port (MAC address table)
- ส่งข้อมูล **เฉพาะ port ปลายทาง** ลด collision
- ทำงานใน LAN เดียวกัน

```
PC-A ──┐
PC-B ──┤ Switch ├── Server
PC-C ──┘
```

### Router (Layer 3)
- ส่ง packet ข้าม **network ต่างๆ** โดยใช้ IP address
- มี **Routing Table** เพื่อตัดสินใจว่าจะส่ง packet ไปทางไหน
- ทำ **NAT** เพื่อแปลง private → public IP

### Firewall
- กรอง traffic ตาม rules (allow/deny)
- ทำงานได้ตั้งแต่ Layer 3-7
- มีทั้ง hardware และ software

### Access Point (AP)
- เชื่อมต่ออุปกรณ์ wireless เข้ากับ wired network
- ทำงานที่ Layer 2

## Network Topology

| Topology | ข้อดี | ข้อเสีย |
|----------|-------|---------|
| Star | ดูแลง่าย, ถ้า node เสียไม่กระทบอื่น | ถ้า switch เสีย ทั้ง network ล่ม |
| Bus | ง่าย, ถูก | ถ้าสาย break ทั้งหมดล่ม |
| Ring | predictable performance | ถ้า node เสียกระทบทั้งวง |
| Mesh | redundancy สูง | แพง, ซับซ้อน |
```

- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "feat: add Module 1 content (OSI, TCP/IP, Network Devices)"
```

---

## Task 6: Dashboard Page

**Files:**
- Create: `components/ProgressBar.tsx`
- Create: `components/ModuleCard.tsx`
- Create: `app/page.tsx`

**Interfaces:**
- Consumes: `getModules()`, `getOverallStats()`, `getModuleProgress()`

- [ ] **Step 1: สร้าง `components/ProgressBar.tsx`**

```tsx
interface Props {
  value: number  // 0-100
  className?: string
}

export default function ProgressBar({ value, className = '' }: Props) {
  return (
    <div className={`w-full bg-slate-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
```

- [ ] **Step 2: สร้าง `components/ModuleCard.tsx`**

```tsx
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
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-blue-500 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-mono text-slate-400">Module {module.id}</span>
          <span className="text-xs text-slate-400">{progress}%</span>
        </div>
        <h3 className="text-slate-100 font-semibold mb-1">{module.title}</h3>
        <p className="text-slate-400 text-sm mb-4">{module.description}</p>
        <ProgressBar value={progress} />
        <p className="text-xs text-slate-500 mt-2">{module.lessons.length} lessons</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: สร้าง `app/page.tsx`**

```tsx
import { getModules, getAllLessons } from '@/lib/content'
import ModuleCard from '@/components/ModuleCard'
import StatsRow from '@/components/StatsRow'

export default function DashboardPage() {
  const modules = getModules()
  const allLessons = getAllLessons()

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Network Learning</h1>
        <p className="text-slate-400 text-sm">พื้นฐานถึงระดับ CCNA</p>
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
```

- [ ] **Step 4: สร้าง `components/StatsRow.tsx`**

```tsx
'use client'

import { getOverallStats } from '@/lib/progress'
import ProgressBar from './ProgressBar'
import type { Lesson } from '@/types'

interface Props {
  allLessons: Lesson[]
}

export default function StatsRow({ allLessons }: Props) {
  const stats = getOverallStats(allLessons)
  const overallPct = allLessons.length
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-300 font-medium">Overall Progress</span>
        <span className="text-sm font-mono text-blue-400">{overallPct}%</span>
      </div>
      <ProgressBar value={overallPct} className="mb-4" />
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-slate-100">{stats.completedLessons}/{stats.totalLessons}</p>
          <p className="text-xs text-slate-400">Lessons</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-100">{stats.quizPassed}</p>
          <p className="text-xs text-slate-400">Quiz ผ่าน</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-100">{stats.labsComplete}</p>
          <p className="text-xs text-slate-400">Labs เสร็จ</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: ตรวจสอบใน browser**

```bash
npm run dev
```

เปิด `http://localhost:3000` — ควรเห็น Dashboard พร้อม Module cards

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx components/
git commit -m "feat: add Dashboard with module cards and stats"
```

---

## Task 7: Module Page

**Files:**
- Create: `app/module/[moduleId]/page.tsx`

- [ ] **Step 1: สร้าง `app/module/[moduleId]/page.tsx`**

```tsx
import { getModuleById, getModules } from '@/lib/content'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LessonListItem from '@/components/LessonListItem'

interface Props {
  params: { moduleId: string }
}

export function generateStaticParams() {
  return getModules().map(m => ({ moduleId: m.id }))
}

export default function ModulePage({ params }: Props) {
  const module = getModuleById(params.moduleId)
  if (!module) notFound()

  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order)

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/" className="text-slate-400 text-sm hover:text-slate-200 mb-6 inline-block">
        ← Dashboard
      </Link>
      <h1 className="text-xl font-bold text-slate-100 mb-1">Module {module.id}: {module.title}</h1>
      <p className="text-slate-400 text-sm mb-8">{module.description}</p>

      <div className="space-y-2">
        {sortedLessons.map(lesson => (
          <LessonListItem
            key={lesson.id}
            lesson={lesson}
            allLessons={sortedLessons}
          />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: สร้าง `components/LessonListItem.tsx`**

```tsx
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
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 opacity-50 cursor-not-allowed">
        <span>{icon}</span>
        <span className="text-slate-400 text-sm">{lesson.title}</span>
      </div>
    )
  }

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors">
        <span>{icon}</span>
        <div className="flex-1">
          <span className="text-slate-200 text-sm">{lesson.title}</span>
          {progress.quizScore > 0 && (
            <span className="ml-2 text-xs text-slate-400">Quiz: {progress.quizScore}%</span>
          )}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/module components/LessonListItem.tsx
git commit -m "feat: add Module page with lesson list"
```

---

## Task 8: Lesson Page & Content Renderer

**Files:**
- Create: `app/lesson/[lessonId]/page.tsx`
- Create: `components/LessonContent.tsx`

- [ ] **Step 1: สร้าง `components/LessonContent.tsx`**

```tsx
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function LessonContent({ content }: Props) {
  return (
    <div className="prose prose-invert prose-slate max-w-none
      prose-headings:text-slate-100 prose-p:text-slate-300
      prose-strong:text-slate-100 prose-code:text-blue-300
      prose-pre:bg-slate-800 prose-table:text-slate-300
      prose-th:text-slate-200 prose-td:text-slate-300
      prose-a:text-blue-400 prose-li:text-slate-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 2: Install @tailwindcss/typography**

```bash
npm install @tailwindcss/typography
```

เพิ่มใน `tailwind.config.ts`:
```typescript
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 3: สร้าง `app/lesson/[lessonId]/page.tsx`**

```tsx
import { getLessonById, getAllLessons, getModuleById } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LessonContent from '@/components/LessonContent'
import Quiz from '@/components/Quiz'
import Lab from '@/components/Lab'
import Sidebar from '@/components/Sidebar'

interface Props {
  params: { lessonId: string }
}

export function generateStaticParams() {
  return getAllLessons().map(l => ({ lessonId: l.id }))
}

export default function LessonPage({ params }: Props) {
  const lesson = getLessonById(params.lessonId)
  if (!lesson) notFound()

  const module = getModuleById(lesson.moduleId)
  const allLessons = module ? [...module.lessons].sort((a, b) => a.order - b.order) : []

  return (
    <div className="flex min-h-screen">
      <Sidebar lesson={lesson} allLessons={allLessons} />

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto">
        <Link
          href={`/module/${lesson.moduleId}`}
          className="text-slate-400 text-sm hover:text-slate-200 mb-6 inline-block"
        >
          ← Module {lesson.moduleId}
        </Link>

        <h1 className="text-2xl font-bold text-slate-100 mb-8">{lesson.title}</h1>

        <LessonContent content={lesson.content} />

        <div className="mt-12 border-t border-slate-700 pt-8">
          <Quiz lessonId={lesson.id} questions={lesson.quiz} />
        </div>

        <div className="mt-10">
          <Lab lessonId={lesson.id} lab={lesson.lab} />
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/lesson components/LessonContent.tsx tailwind.config.ts
git commit -m "feat: add Lesson page with content renderer"
```

---

## Task 9: Quiz Component

**Files:**
- Create: `components/Quiz.tsx`

**Interfaces:**
- Consumes: `saveQuizScore(lessonId, score)` จาก `lib/progress.ts`
- Consumes: `QuizQuestion[]` จาก `types/index.ts`

- [ ] **Step 1: สร้าง `components/Quiz.tsx`**

```tsx
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
    const p = getLessonProgress(lessonId)
    setBestScore(p.quizScore)
  }, [lessonId])

  function startQuiz() {
    setSelected(new Array(questions.length).fill(null))
    setState('answering')
  }

  function selectOption(qIdx: number, optIdx: number) {
    setSelected(prev => {
      const next = [...prev]
      next[qIdx] = optIdx
      return next
    })
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
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">Quiz</h2>
        <p className="text-slate-400 text-sm mb-4">
          {questions.length} ข้อ | ต้องได้ ≥ 70% เพื่อ unlock บทถัดไป
          {bestScore > 0 && <span className="ml-2 text-blue-400">คะแนนสูงสุด: {bestScore}%</span>}
        </p>
        <button
          onClick={startQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          {bestScore >= 70 ? 'ทำอีกครั้ง' : 'เริ่ม Quiz'}
        </button>
      </div>
    )
  }

  if (state === 'submitted') {
    const passed = score >= 70
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">ผลลัพธ์ Quiz</h2>
        <div className={`text-3xl font-bold mb-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          {score}%
        </div>
        <p className={`text-sm mb-4 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          {passed ? '✅ ผ่าน! ทำ Lab ด้านล่างเพื่อ unlock บทถัดไป' : '❌ ยังไม่ผ่าน (ต้องได้ ≥ 70%)'}
        </p>
        {questions.map((q, i) => {
          const correct = selected[i] === q.answer
          return (
            <div key={i} className="mb-3">
              <p className="text-slate-300 text-sm mb-1">
                {i + 1}. {q.question}
                <span className={`ml-2 ${correct ? 'text-green-400' : 'text-red-400'}`}>
                  {correct ? '✓' : '✗'}
                </span>
              </p>
              {!correct && (
                <p className="text-xs text-slate-400 ml-3">
                  เฉลย: {q.options[q.answer]}
                </p>
              )}
            </div>
          )
        })}
        <button
          onClick={startQuiz}
          className="mt-4 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          ทำอีกครั้ง
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-slate-100 mb-6">Quiz</h2>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="text-slate-200 text-sm mb-3">{i + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => selectOption(i, j)}
                  className={`w-full text-left px-3 py-2 rounded text-sm border transition-colors ${
                    selected[i] === j
                      ? 'border-blue-500 bg-blue-900/30 text-slate-100'
                      : 'border-slate-600 text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {j === 0 ? 'A' : j === 1 ? 'B' : j === 2 ? 'C' : 'D'}. {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={submitQuiz}
        disabled={!allAnswered}
        className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm transition-colors"
      >
        ส่งคำตอบ
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Quiz.tsx
git commit -m "feat: add Quiz component with scoring and retry"
```

---

## Task 10: Lab Component

**Files:**
- Create: `components/Lab.tsx`

**Interfaces:**
- Consumes: `markLabComplete(lessonId)`, `getLessonProgress(lessonId)` จาก `lib/progress.ts`
- Consumes: `Lab` จาก `types/index.ts`

- [ ] **Step 1: สร้าง `components/Lab.tsx`**

```tsx
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
    setChecked(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  function complete() {
    markLabComplete(lessonId)
    setCompleted(true)
    setChecked(new Array(lab.steps.length).fill(true))
  }

  const allChecked = checked.every(Boolean) && checked.length > 0

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">LAB</span>
        <h2 className="text-lg font-semibold text-slate-100">{lab.title}</h2>
      </div>
      <p className="text-slate-400 text-sm mb-5">{lab.scenario}</p>

      <div className="space-y-3 mb-6">
        {lab.steps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className={`w-full text-left flex items-start gap-3 p-3 rounded border transition-colors ${
              checked[i]
                ? 'border-green-700 bg-green-900/20 text-slate-300'
                : 'border-slate-600 text-slate-300 hover:border-slate-400'
            }`}
          >
            <span className={`mt-0.5 text-sm flex-shrink-0 ${checked[i] ? 'text-green-400' : 'text-slate-500'}`}>
              {checked[i] ? '☑' : '☐'}
            </span>
            <span className="text-sm">{step}</span>
          </button>
        ))}
      </div>

      {completed ? (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>Lab เสร็จแล้ว</span>
        </div>
      ) : (
        <button
          onClick={complete}
          disabled={!allChecked}
          className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Mark Lab Complete
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Lab.tsx
git commit -m "feat: add Lab component with checklist"
```

---

## Task 11: Sidebar

**Files:**
- Create: `components/Sidebar.tsx`

- [ ] **Step 1: สร้าง `components/Sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { getLessonProgress, isLessonUnlocked } from '@/lib/progress'
import type { Lesson } from '@/types'

interface Props {
  lesson: Lesson
  allLessons: Lesson[]
}

export default function Sidebar({ lesson: currentLesson, allLessons }: Props) {
  return (
    <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-800 px-4 py-10 hidden md:block">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Module {currentLesson.moduleId}</p>
      <div className="space-y-1">
        {allLessons.map(l => {
          const progress = getLessonProgress(l.id)
          const unlocked = isLessonUnlocked(l.id, allLessons)
          const completed = progress.quizPassed && progress.labComplete
          const isCurrent = l.id === currentLesson.id

          const icon = completed ? '✅' : unlocked ? '📖' : '🔒'

          if (!unlocked) {
            return (
              <div key={l.id} className="flex items-center gap-2 px-2 py-1.5 opacity-40 cursor-not-allowed">
                <span className="text-xs">{icon}</span>
                <span className="text-xs text-slate-400 truncate">{l.title}</span>
              </div>
            )
          }

          return (
            <Link key={l.id} href={`/lesson/${l.id}`}>
              <div className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                isCurrent
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}>
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: add Sidebar with lesson status and unlock state"
```

---

## Task 12: Content Stubs (Modules 2–6)

**Files:** สร้าง stub lesson 1 ของแต่ละ module (2-6)

- [ ] **Step 1: สร้าง `content/module-2/lesson-2-1.md`**

```markdown
---
id: "2-1"
moduleId: "2"
title: "IPv4 Addressing"
order: 1
quiz:
  - question: "IPv4 address มีกี่ bit?"
    options: ["16", "32", "64", "128"]
    answer: 1
  - question: "Subnet mask /24 คือ?"
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"]
    answer: 2
  - question: "Class C address range คือ?"
    options: ["1-126", "128-191", "192-223", "224-239"]
    answer: 2
  - question: "Private IP range 192.168.0.0/16 เป็น Class ใด?"
    options: ["Class A", "Class B", "Class C", "Class D"]
    answer: 2
  - question: "Loopback address คือ?"
    options: ["0.0.0.0", "127.0.0.1", "192.168.1.1", "255.255.255.255"]
    answer: 1
lab:
  title: "จำแนก IP Address Class"
  scenario: "ระบุ Class ของ IP address ต่อไปนี้"
  steps:
    - "10.0.0.1 → Class A (Private)"
    - "172.16.0.1 → Class B (Private)"
    - "192.168.1.1 → Class C (Private)"
    - "8.8.8.8 → Class A (Public, Google DNS)"
    - "224.0.0.1 → Class D (Multicast)"
---

## IPv4 Addressing

เนื้อหาส่วนนี้จะครอบคลุม IPv4 addressing, classes, และ subnetting

*(เนื้อหากำลังจะเพิ่มเติม)*
```

- [ ] **Step 2: สร้าง `content/module-2/lesson-2-2.md`**

```markdown
---
id: "2-2"
moduleId: "2"
title: "Subnetting"
order: 2
quiz:
  - question: "Network /26 มีกี่ host ได้?"
    options: ["30", "62", "126", "254"]
    answer: 1
  - question: "192.168.1.0/25 มี subnet mask อะไร?"
    options: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224"]
    answer: 1
  - question: "VLSM ย่อมาจากอะไร?"
    options: ["Variable Length Subnet Mask", "Very Large Subnet Method", "Virtual LAN Subnet Mapping", "Variable Link Subnet Mode"]
    answer: 0
  - question: "/30 subnet ใช้ทำอะไร?"
    options: ["ใช้กับ LAN ใหญ่", "Point-to-point link ระหว่าง router", "VLAN segment", "Management network"]
    answer: 1
  - question: "Broadcast address ของ 192.168.1.0/24 คือ?"
    options: ["192.168.1.0", "192.168.1.1", "192.168.1.254", "192.168.1.255"]
    answer: 3
lab:
  title: "คำนวณ Subnet"
  scenario: "คำนวณ network address, broadcast, และ usable host range"
  steps:
    - "192.168.10.0/26 → Network: 192.168.10.0, Broadcast: 192.168.10.63, Hosts: .1-.62 (62 hosts)"
    - "10.0.0.0/8 → Network: 10.0.0.0, Broadcast: 10.255.255.255, Hosts: 16,777,214"
    - "172.16.5.0/30 → Network: 172.16.5.0, Broadcast: 172.16.5.3, Hosts: .1-.2 (2 hosts)"
    - "192.168.1.128/25 → Network: 192.168.1.128, Broadcast: 192.168.1.255, Hosts: .129-.254"
---

## Subnetting

*(เนื้อหากำลังจะเพิ่มเติม)*
```

- [ ] **Step 3: สร้าง stub สำหรับ Module 3-6**

```bash
cat > content/module-3/lesson-3-1.md << 'EOF'
---
id: "3-1"
moduleId: "3"
title: "VLANs"
order: 1
quiz:
  - question: "VLAN ย่อมาจากอะไร?"
    options: ["Virtual LAN", "Variable LAN", "Verified LAN", "Vendor LAN"]
    answer: 0
  - question: "VLAN ทำงานที่ OSI Layer ใด?"
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"]
    answer: 1
  - question: "Trunk port ทำหน้าที่อะไร?"
    options: ["เชื่อมต่อ PC กับ switch", "ส่ง traffic หลาย VLAN", "กำหนด default VLAN", "block broadcast"]
    answer: 1
  - question: "Native VLAN คือ VLAN ใดโดย default บน Cisco switch?"
    options: ["VLAN 0", "VLAN 1", "VLAN 99", "VLAN 100"]
    answer: 1
  - question: "Inter-VLAN routing ต้องการอะไร?"
    options: ["Switch เพิ่มเติม", "Router หรือ Layer 3 switch", "Hub", "Repeater"]
    answer: 1
lab:
  title: "VLAN Configuration"
  scenario: "ขั้นตอน basic VLAN configuration บน Cisco switch"
  steps:
    - "สร้าง VLAN: switch(config)# vlan 10 / name SALES"
    - "กำหนด access port: switch(config-if)# switchport mode access / switchport access vlan 10"
    - "กำหนด trunk port: switch(config-if)# switchport mode trunk"
    - "ตรวจสอบ: switch# show vlan brief / show interfaces trunk"
---

## VLANs

*(เนื้อหากำลังจะเพิ่มเติม)*
EOF
```

```bash
cat > content/module-4/lesson-4-1.md << 'EOF'
---
id: "4-1"
moduleId: "4"
title: "Static Routing"
order: 1
quiz:
  - question: "คำสั่ง static route บน Cisco IOS คือ?"
    options: ["ip route [dest] [mask] [next-hop]", "route add [dest]", "add route [dest]", "static route [dest]"]
    answer: 0
  - question: "Default route คือ?"
    options: ["0.0.0.0/0", "255.255.255.255/0", "192.168.0.0/16", "10.0.0.0/8"]
    answer: 0
  - question: "Administrative Distance ของ static route คือ?"
    options: ["0", "1", "90", "110"]
    answer: 1
  - question: "Routing table ดูได้ด้วยคำสั่งอะไร?"
    options: ["show ip table", "show ip route", "show route", "display ip route"]
    answer: 1
  - question: "Next-hop address คืออะไร?"
    options: ["IP ของ destination host", "IP ของ router ตัวถัดไป", "IP ของ source", "broadcast address"]
    answer: 1
lab:
  title: "Configure Static Route"
  scenario: "กำหนด static route เพื่อให้ Router A เข้าถึง 192.168.2.0/24 ผ่าน Router B (10.0.0.2)"
  steps:
    - "เข้า config mode: RouterA# conf t"
    - "กำหนด static route: RouterA(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2"
    - "ตรวจสอบ: RouterA# show ip route"
    - "ทดสอบ: RouterA# ping 192.168.2.1"
    - "กำหนด default route: RouterA(config)# ip route 0.0.0.0 0.0.0.0 [ISP-IP]"
---

## Static Routing

*(เนื้อหากำลังจะเพิ่มเติม)*
EOF
```

```bash
cat > content/module-5/lesson-5-1.md << 'EOF'
---
id: "5-1"
moduleId: "5"
title: "DNS & DHCP"
order: 1
quiz:
  - question: "DNS ใช้ port อะไร?"
    options: ["80", "443", "53", "67"]
    answer: 2
  - question: "DHCP ย่อมาจากอะไร?"
    options: ["Dynamic Host Configuration Protocol", "Direct Host Control Protocol", "Domain Host Config Protocol", "Distributed Host Comm Protocol"]
    answer: 0
  - question: "DHCP lease คืออะไร?"
    options: ["IP ที่ถาวร", "ระยะเวลาที่ client ใช้ IP ได้", "รหัสผ่าน DHCP", "subnet ของ DHCP"]
    answer: 1
  - question: "A record ใน DNS ใช้ทำอะไร?"
    options: ["แปลง IP → domain", "แปลง domain → IPv4", "แปลง domain → IPv6", "กำหนด mail server"]
    answer: 1
  - question: "DHCP DORA process ย่อมาจาก?"
    options: ["Discover, Offer, Request, Acknowledge", "Detect, Order, Route, Assign", "Deploy, Open, Request, Allow", "Discover, Order, Reserve, Assign"]
    answer: 0
lab:
  title: "DHCP Configuration บน Cisco Router"
  scenario: "กำหนด DHCP server บน router เพื่อจ่าย IP ให้ client ใน 192.168.1.0/24"
  steps:
    - "สร้าง DHCP pool: Router(config)# ip dhcp pool LAN"
    - "กำหนด network: Router(dhcp-config)# network 192.168.1.0 255.255.255.0"
    - "กำหนด default gateway: Router(dhcp-config)# default-router 192.168.1.1"
    - "กำหนด DNS: Router(dhcp-config)# dns-server 8.8.8.8"
    - "ยกเว้น IP ที่ใช้แล้ว: Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10"
---

## DNS & DHCP

*(เนื้อหากำลังจะเพิ่มเติม)*
EOF
```

```bash
cat > content/module-6/lesson-6-1.md << 'EOF'
---
id: "6-1"
moduleId: "6"
title: "ACLs & Firewalls"
order: 1
quiz:
  - question: "Standard ACL กรอง traffic ตาม?"
    options: ["Source IP เท่านั้น", "Destination IP", "Port number", "Protocol"]
    answer: 0
  - question: "Extended ACL ต่างจาก Standard ACL อย่างไร?"
    options: ["Extended กรองได้ละเอียดกว่า (src, dst, port, protocol)", "Standard เร็วกว่า", "Extended ใช้ได้แค่ inbound", "ไม่มีความต่าง"]
    answer: 0
  - question: "ACL ควร apply ไว้ใกล้ที่ใด?"
    options: ["Standard: ใกล้ destination, Extended: ใกล้ source", "Standard: ใกล้ source, Extended: ใกล้ destination", "ทั้งคู่ใกล้ source", "ทั้งคู่ใกล้ destination"]
    answer: 0
  - question: "ท้าย ACL list มี implicit rule ว่า?"
    options: ["permit any", "deny any", "log any", "forward any"]
    answer: 1
  - question: "Stateful firewall แตกต่างจาก packet filter อย่างไร?"
    options: ["Stateful ติดตาม connection state, packet filter ไม่ติดตาม", "Stateful เร็วกว่า", "Packet filter ปลอดภัยกว่า", "ไม่มีความต่าง"]
    answer: 0
lab:
  title: "Standard ACL Configuration"
  scenario: "Block traffic จาก 192.168.2.0/24 ไม่ให้เข้าถึง 192.168.1.0/24"
  steps:
    - "สร้าง standard ACL: Router(config)# access-list 10 deny 192.168.2.0 0.0.0.255"
    - "อนุญาต traffic อื่น: Router(config)# access-list 10 permit any"
    - "Apply บน interface ที่ใกล้ destination: Router(config-if)# ip access-group 10 in"
    - "ตรวจสอบ: Router# show access-lists"
    - "ทดสอบด้วย ping จาก host ใน 192.168.2.0/24 → ควร fail"
---

## ACLs & Firewalls

*(เนื้อหากำลังจะเพิ่มเติม)*
EOF
```

- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "feat: add content stubs for Modules 2-6"
```

---

## Task 13: Final Verification & Deploy

- [ ] **Step 1: Build ทดสอบ**

```bash
npm run build
```

Expected: build สำเร็จ ไม่มี TypeScript error

- [ ] **Step 2: ทดสอบ flow ครบทั้งหมด**

1. เปิด `http://localhost:3000` → เห็น Dashboard
2. คลิก Module 1 → เห็น 3 lessons (lesson 1 unlock, 2-3 lock)
3. คลิก Lesson 1-1 → เห็นเนื้อหา + quiz + lab
4. ทำ quiz ผ่าน (≥70%) → เห็นผลลัพธ์สีเขียว
5. Checkmark ทุก lab step → กด "Mark Lab Complete"
6. กลับ Module page → Lesson 1-2 unlock แล้ว
7. Dashboard → progress bar อัปเดต

- [ ] **Step 3: Deploy บน Vercel (optional)**

```bash
npm install -g vercel
vercel
```

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete network learning website v1"
```
