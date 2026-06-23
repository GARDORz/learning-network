# Network Learning Website — Design Spec

**Date:** 2026-06-23  
**Status:** Approved

---

## Overview

เว็บไซต์เรียน Network สำหรับใช้คนเดียว ครอบคลุมเนื้อหาตั้งแต่พื้นฐานจนถึงระดับ CCNA พร้อม Quiz, Lab exercises และ Dashboard ติดตาม progress

---

## Architecture

**Stack:** Next.js (App Router) + Tailwind CSS + localStorage  
**Deploy:** Vercel (ฟรี)  
**ไม่มี backend หรือ database** — ทุกอย่างทำงานใน browser ล้วนๆ

```
webnetwork/
├── content/                   ← Markdown + frontmatter (เนื้อหา, quiz, lab)
│   └── module-1/
│       └── lesson-1.md
├── app/
│   ├── page.tsx               ← Dashboard
│   ├── module/[id]/page.tsx   ← รายการ lessons
│   └── lesson/[id]/page.tsx   ← เนื้อหา + quiz + lab
├── components/
│   ├── Dashboard/
│   ├── LessonViewer/
│   ├── Quiz/
│   └── Lab/
└── lib/
    └── progress.ts            ← localStorage helper
```

---

## Curriculum (6 Modules)

| Module | หัวข้อ |
|--------|--------|
| 1 | Network Fundamentals — OSI, TCP/IP model, cables, topologies |
| 2 | IP Addressing — IPv4, subnetting, VLSM, IPv6 basics |
| 3 | Switching — VLANs, STP, EtherChannel |
| 4 | Routing — Static routes, RIP, OSPF, inter-VLAN |
| 5 | Network Services — DNS, DHCP, NAT, HTTP/S |
| 6 | Security & WAN — ACLs, firewalls, VPN basics |

แต่ละ Lesson ประกอบด้วย: เนื้อหา Markdown + Quiz 5-10 ข้อ + Lab 1 ข้อ

---

## Content Schema

```yaml
---
id: lesson_1_1
module: 1
title: "OSI Model"
order: 1
quiz:
  - question: "OSI model มีกี่ layer?"
    options: ["5", "7", "4", "6"]
    answer: 1
lab:
  scenario: "..."
  steps: ["Step 1", "Step 2"]
---
เนื้อหา Markdown...
```

---

## UI Components

### Dashboard (หน้าแรก)
- Overall progress bar รวมทั้งหมด
- 6 Module cards พร้อม progress bar แต่ละ module
- สถิติ: lessons เสร็จ / quiz ผ่าน / labs ผ่าน
- ธีม: เรียบง่าย (simple/clean), dark theme เหมือน terminal

### หน้า Lesson
- Sidebar: Module outline พร้อมสถานะแต่ละ lesson (✅ / 📖 / 🔒)
- Main area: เนื้อหา Markdown → Quiz → Lab ตามลำดับ

### Navigation Rules
- Lesson ถัดไป unlock หลัง quiz ผ่าน (≥ 70%) และ mark lab complete
- ทำ quiz ซ้ำได้ไม่จำกัด บันทึกคะแนนสูงสุด

---

## localStorage Schema

```json
{
  "progress": {
    "lesson_1_1": {
      "read": true,
      "quizScore": 80,
      "quizPassed": true,
      "labComplete": true
    }
  }
}
```

---

## Styling

- Tailwind CSS, dark theme
- Font monospace สำหรับ code/config examples
- UI เรียบง่าย (user preference: simple/clean)
- Responsive: mobile + desktop
