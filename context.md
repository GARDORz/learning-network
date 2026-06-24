# Network Learning Website — Context

เว็บไซต์เรียน Network ส่วนตัว ครอบคลุมพื้นฐานถึงระดับ CCNA พร้อม Quiz, Lab และ Dashboard ติดตาม progress

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router, Static) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + inline styles |
| Content | Markdown + YAML frontmatter (gray-matter) |
| Markdown render | react-markdown + remark-gfm |
| State/Storage | localStorage (ฝั่ง client เท่านั้น) |
| ไม่มี | Backend, database, authentication |

---

## โครงสร้างโปรเจกต์

```
webnetwork/
├── app/
│   ├── layout.tsx                   root layout (dark bg #0f172a)
│   ├── page.tsx                     Dashboard
│   ├── module/[moduleId]/page.tsx   หน้า module
│   └── lesson/[lessonId]/page.tsx   หน้า lesson
├── components/
│   ├── ProgressBar.tsx              progress bar ทั่วไป
│   ├── StatsRow.tsx                 overall stats บน dashboard
│   ├── ModuleCard.tsx               card แต่ละ module บน dashboard
│   ├── LessonListItem.tsx           รายการ lesson ในหน้า module
│   ├── Sidebar.tsx                  sidebar ในหน้า lesson
│   ├── LessonContent.tsx            renderer สำหรับ Markdown
│   ├── Quiz.tsx                     MCQ quiz + scoring
│   └── Lab.tsx                      checklist lab
├── content/
│   ├── module-1/
│   │   ├── lesson-1-1.md            OSI Model
│   │   ├── lesson-1-2.md            TCP/IP Model
│   │   └── lesson-1-3.md            Network Devices
│   ├── module-2/
│   │   ├── lesson-2-1.md            IPv4 Addressing
│   │   └── lesson-2-2.md            Subnetting
│   ├── module-3/lesson-3-1.md       VLANs
│   ├── module-4/lesson-4-1.md       Static Routing
│   ├── module-5/lesson-5-1.md       DNS & DHCP
│   └── module-6/lesson-6-1.md       ACLs & Firewalls
├── lib/
│   ├── content.ts                   อ่าน + parse Markdown files (server-side)
│   └── progress.ts                  localStorage helpers (client-side)
├── types/
│   └── index.ts                     TypeScript interfaces ทั้งหมด
└── docs/
    └── superpowers/
        ├── specs/                   design spec
        └── plans/                   implementation plan
```

---

## Curriculum (6 Modules)

| Module | หัวข้อ | Lessons |
|--------|--------|---------|
| 1 | Network Fundamentals | OSI Model, TCP/IP, Network Devices |
| 2 | IP Addressing | IPv4, Subnetting/VLSM |
| 3 | Switching | VLANs, STP, EtherChannel |
| 4 | Routing | Static Routes, OSPF, inter-VLAN |
| 5 | Network Services | DNS, DHCP, NAT, HTTP/S |
| 6 | Security & WAN | ACLs, Firewalls, VPN |

> Module 1-2 มีเนื้อหาจริงครบ, Module 3-6 มี stub lesson พร้อม quiz+lab รอเพิ่มเนื้อหา

---

## Content Schema (Markdown Frontmatter)

```yaml
---
id: "1-1"           # unique lesson ID (moduleId-order)
moduleId: "1"       # module ที่ lesson นี้สังกัด
title: "OSI Model"
order: 1            # ลำดับใน module
quiz:
  - question: "..."
    options: ["A", "B", "C", "D"]
    answer: 2       # index ของคำตอบที่ถูก (0-based)
lab:
  title: "..."
  scenario: "..."
  steps:
    - "step 1"
    - "step 2"
---

เนื้อหา Markdown ที่นี่...
```

---

## Progress Logic

เก็บใน `localStorage` key `network-learning-progress`:

```json
{
  "1-1": {
    "read": true,
    "quizScore": 80,
    "quizPassed": true,
    "labComplete": true
  }
}
```

**Unlock rule:** Lesson ถัดไปจะ unlock เมื่อ lesson ก่อนหน้า `quizPassed = true` AND `labComplete = true`

**Quiz:** ต้องได้ ≥ 70% ถึงจะ pass — ทำซ้ำได้ไม่จำกัด บันทึกเฉพาะคะแนนสูงสุด

---

## วิธีเพิ่มเนื้อหาใหม่

1. สร้างไฟล์ใหม่ใน `content/module-X/lesson-X-Y.md`
2. ใส่ frontmatter ตาม schema ด้านบน
3. `npm run build` หรือ `npm run dev` — Next.js จะ pick up อัตโนมัติ

**ไม่ต้องแก้ไขโค้ดใดๆ** เมื่อเพิ่ม lesson ใหม่

---

## รัน / Build

```bash
npm run dev      # development server → http://localhost:3000
npm run build    # production build
npm run start    # รัน production build
```

---

## Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

เลือก Next.js preset — ไม่ต้องตั้งค่า environment variables เพราะไม่มี backend
