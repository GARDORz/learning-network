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
  - question: "Class C address เริ่มต้นที่?"
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
  scenario: "ระบุ Class ของ IP address ต่อไปนี้ และบอกว่าเป็น Private หรือ Public"
  steps:
    - "10.0.0.1 → Class A (Private, RFC 1918)"
    - "172.16.0.1 → Class B (Private, RFC 1918)"
    - "192.168.1.1 → Class C (Private, RFC 1918)"
    - "8.8.8.8 → Class A (Public, Google DNS)"
    - "224.0.0.1 → Class D (Multicast, ไม่ใช้สำหรับ host)"
---

## IPv4 Addressing

IPv4 address คือตัวเลข 32-bit แทนด้วยเลขฐานสิบ 4 ส่วน คั่นด้วยจุด เช่น `192.168.1.1`

## Address Classes

| Class | Range (1st octet) | Default Mask | ใช้สำหรับ |
|-------|------------------|--------------|----------|
| A | 1-126 | /8 (255.0.0.0) | Large networks |
| B | 128-191 | /16 (255.255.0.0) | Medium networks |
| C | 192-223 | /24 (255.255.255.0) | Small networks |
| D | 224-239 | - | Multicast |
| E | 240-255 | - | Reserved |

## Private IP Ranges (RFC 1918)

| Range | Class |
|-------|-------|
| 10.0.0.0/8 | A |
| 172.16.0.0/12 | B |
| 192.168.0.0/16 | C |

## Special Addresses

- **127.0.0.1** — Loopback (localhost)
- **0.0.0.0** — Default route / unspecified
- **255.255.255.255** — Limited broadcast
- **169.254.x.x** — APIPA (no DHCP available)
