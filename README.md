# 🌐 เว็บเรียน Network

เว็บไซต์เรียนรู้ระบบเครือข่ายคอมพิวเตอร์ ตั้งแต่พื้นฐานจนถึงระดับ CCNA พร้อมระบบ Quiz, Lab และ Dashboard ติดตาม progress ส่วนตัว

---

## ✨ ฟีเจอร์หลัก

- **6 Module** ครอบคลุมเนื้อหา Network ตั้งแต่พื้นฐานถึง CCNA
- **Quiz** แบบ MCQ ต้องได้ ≥ 70% ถึงจะผ่าน
- **Lab** แบบ Checklist ฝึกปฏิบัติจริง
- **Dashboard** แสดง progress รวมทุก module
- **Unlock System** lesson ถัดไปจะเปิดเมื่อทำ quiz + lab ผ่านแล้ว
- **บันทึก progress** ลง localStorage ไม่ต้องสมัครสมาชิก

---

## 📚 เนื้อหา

| Module | หัวข้อ | Lessons |
|--------|--------|---------|
| 1 | Network Fundamentals | OSI Model, TCP/IP, Network Devices |
| 2 | IP Addressing | IPv4, Subnetting/VLSM |
| 3 | Switching | VLANs, STP, EtherChannel |
| 4 | Routing | Static Routes, OSPF, Inter-VLAN |
| 5 | Network Services | DNS, DHCP, NAT, HTTP/S |
| 6 | Security & WAN | ACLs, Firewalls, VPN |

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router, Static Export) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + inline styles |
| Content | Markdown + YAML frontmatter |
| State | localStorage (ฝั่ง client เท่านั้น) |
| ไม่มี | Backend, Database, Authentication |

---

## 🚀 วิธีรัน

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
# เปิด http://localhost:3000

# build สำหรับ production
npm run build

# รัน production build
npm run start
```

---

## 📁 โครงสร้างโปรเจกต์

```
webnetwork/
├── app/
│   ├── page.tsx                     # Dashboard หลัก
│   ├── module/[moduleId]/page.tsx   # หน้า module
│   └── lesson/[lessonId]/page.tsx   # หน้า lesson
├── components/
│   ├── Quiz.tsx                     # MCQ Quiz
│   ├── Lab.tsx                      # Checklist Lab
│   ├── Sidebar.tsx                  # Sidebar นำทาง
│   ├── ModuleCard.tsx               # Card แต่ละ module
│   └── StatsRow.tsx                 # สถิติรวม
├── content/
│   ├── module-1/                    # เนื้อหา Module 1
│   ├── module-2/                    # เนื้อหา Module 2
│   └── ...
├── lib/
│   ├── content.ts                   # อ่าน Markdown (server-side)
│   └── progress.ts                  # จัดการ progress (client-side)
└── types/
    └── index.ts                     # TypeScript types
```

---

## ✏️ วิธีเพิ่ม Lesson ใหม่

สร้างไฟล์ `content/module-X/lesson-X-Y.md` พร้อม frontmatter:

```yaml
---
id: "1-4"
moduleId: "1"
title: "ชื่อ Lesson"
order: 4
quiz:
  - question: "คำถาม?"
    options: ["A", "B", "C", "D"]
    answer: 0
lab:
  title: "ชื่อ Lab"
  scenario: "สถานการณ์จำลอง"
  steps:
    - "ขั้นตอนที่ 1"
    - "ขั้นตอนที่ 2"
---

เนื้อหา Markdown ที่นี่...
```

**ไม่ต้องแก้ไขโค้ดใดๆ** — content loader จะ scan ไฟล์ `.md` อัตโนมัติ

---

## 🚢 Deploy บน Vercel

```bash
npm install -g vercel
vercel
```

เลือก Next.js preset ได้เลย ไม่ต้องตั้งค่า environment variables

---

## 📝 License

MIT
