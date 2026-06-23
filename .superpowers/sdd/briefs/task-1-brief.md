# Task 1: Project Setup

**Project context:** สร้างเว็บไซต์เรียน Network ส่วนตัวระดับ CCNA ด้วย Next.js + Tailwind + localStorage

## Global Constraints
- Node.js 18+
- Next.js 14 with App Router (`app/` directory)
- TypeScript strict mode
- Tailwind CSS — dark theme เป็น default (ไม่ใช้ `dark:` prefix, ใช้สีมืดตลอด)
- UI: เรียบง่าย (simple/clean), สี neutral dark (#0f172a background, #e2e8f0 text)
- ไม่มี authentication, ไม่มี server-side state

## Files
- Create: `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json` (auto-generated)
- Create: `app/layout.tsx`
- Create: `app/globals.css`

## Steps

- [ ] **Step 1: Scaffold Next.js project**

Working directory: `C:/Users/pongs/webnetwork`

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

เมื่อถาม prompt ตอบ Yes ทุกอย่างตามนี้:
- Use TypeScript? → Yes
- Use ESLint? → Yes
- Use Tailwind CSS? → Yes
- Use `src/` directory? → No
- Use App Router? → Yes
- Customize import alias? → No (ใช้ @/*)

**หมายเหตุ:** `create-next-app` มักถาม interactively ถ้า flag ครบแล้วอาจไม่ถาม ให้ใช้ `--yes` flag ถ้าติด:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

- [ ] **Step 2: ลบ default files**

```bash
rm app/page.tsx app/globals.css 2>/dev/null; true
```

- [ ] **Step 3: สร้าง `app/globals.css`**

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
mkdir -p content/module-1 content/module-2 content/module-3 content/module-4 content/module-5 content/module-6
mkdir -p components lib types
mkdir -p "app/module/[moduleId]"
mkdir -p "app/lesson/[lessonId]"
```

- [ ] **Step 6: Install additional dependencies**

```bash
npm install gray-matter react-markdown remark-gfm
```

- [ ] **Step 7: สร้าง placeholder `app/page.tsx` เพื่อให้ dev server ไม่ error**

```tsx
export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold text-slate-100">Network Learning</h1>
      <p className="text-slate-400">Dashboard coming soon</p>
    </main>
  )
}
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: ไม่มี error (อาจมี warning เล็กน้อยจาก next.js internals)

- [ ] **Step 9: git init และ commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Tailwind dark theme"
```

## Report

เขียน report ที่ `C:/Users/pongs/webnetwork/.superpowers/sdd/briefs/task-1-report.md` ประกอบด้วย:
- Status: DONE / BLOCKED / NEEDS_CONTEXT
- Commit hash (short)
- สิ่งที่ทำได้จริง vs plan
- Concerns (ถ้ามี)
