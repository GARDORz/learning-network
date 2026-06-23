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

| Layer | ชื่อ | หน้าที่หลัก | PDU |
|-------|------|------------|-----|
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
    + L7 header
    + L6 header
    + L5 header
    + TCP/UDP header  →  Segment
    + IP header       →  Packet
    + Ethernet header →  Frame
    →  Bits (1s and 0s)
```

## Layer 2 vs Layer 3

- **Layer 2 (Data Link):** ทำงานใน LAN เดียวกัน, ใช้ MAC address, อุปกรณ์คือ Switch
- **Layer 3 (Network):** ทำงานข้าม network, ใช้ IP address, อุปกรณ์คือ Router
