# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## คำสั่งที่ใช้บ่อย

```bash
npm run dev      # รัน dev server ที่ http://localhost:3000
npm run build    # build สำหรับ production (ตรวจ TypeScript ด้วย)
npm run lint     # รัน ESLint
npx tsc --noEmit # ตรวจ type เฉยๆ ไม่ build
```

ไม่มี test suite ในโปรเจกต์นี้

## สถาปัตยกรรมหลัก

**เว็บ static ทั้งหมด** ทุก page ใช้ `generateStaticParams` และถูก pre-render ตอน build ไม่มี server-side state — progress ทั้งหมดเก็บใน `localStorage` ฝั่ง client เท่านั้น

**การไหลของข้อมูล:**
- `lib/content.ts` อ่านไฟล์ Markdown จาก `content/module-*/` ตอน build time ด้วย Node `fs` + `gray-matter` — เรียกได้เฉพาะจาก Server Components
- `lib/progress.ts` อ่าน/เขียน `localStorage` — เรียกได้เฉพาะจาก Client Components (`'use client'`) มีการ guard SSR ด้วย `typeof window === 'undefined'`
- Pages โหลดข้อมูล `Lesson[]` ฝั่ง server แล้วส่งเป็น props ให้ client components (Quiz, Lab, Sidebar, StatsRow, ModuleCard, LessonListItem)

**เพิ่ม lesson ใหม่:** สร้างไฟล์ `content/module-N/lesson-N-M.md` พร้อม frontmatter ตาม schema — ไม่ต้องแก้โค้ดใดๆ content loader scan ไฟล์ `.md` อัตโนมัติ

## Schema ของ Frontmatter

ทุกไฟล์ lesson ต้องมี:

```yaml
---
id: "2-3"           # "<moduleId>-<order>" ต้องไม่ซ้ำกัน
moduleId: "2"       # string "1"–"6"
title: "..."
order: 3            # integer กำหนดลำดับ lesson ใน module
quiz:
  - question: "..."
    options: ["A", "B", "C", "D"]   # 4 ตัวเลือกเสมอ
    answer: 0                        # index ของคำตอบที่ถูก (0-based)
lab:
  title: "..."
  scenario: "..."
  steps: ["step 1", "step 2"]
---
```

## Styling

ใช้ Tailwind CSS v4 (`@import "tailwindcss"` ใน globals.css — ไม่ใช้ directive แบบ v3) Dark theme ใช้ inline `style` props และ class `.prose` ใน `globals.css` **ห้ามใช้ `dark:` prefix**

## ข้อกำหนดสำคัญ

- เกณฑ์ผ่าน quiz คือ **70%** (hardcode ใน `lib/progress.ts` ฟังก์ชัน `saveQuizScore`)
- การ unlock lesson ถัดไปต้องการทั้ง `quizPassed` และ `labComplete` ของ lesson ก่อนหน้า (ดูที่ `lib/progress.ts` ฟังก์ชัน `isLessonUnlocked`)
- ชื่อและคำอธิบาย module hardcode ไว้ใน `lib/content.ts` ใน `MODULE_META` — แก้ที่นั่นถ้าต้องการเปลี่ยนชื่อ module
- `params` ใน App Router pages เป็น `Promise<{...}>` ต้อง `await` เสมอ (ข้อกำหนดของ Next.js 16)
