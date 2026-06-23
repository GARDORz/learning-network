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
  - question: "DNS A record ใช้ทำอะไร?"
    options: ["แปลง IP เป็น domain", "แปลง domain เป็น IPv4", "แปลง domain เป็น IPv6", "กำหนด mail server"]
    answer: 1
  - question: "DHCP DORA process ย่อมาจาก?"
    options: ["Discover, Offer, Request, Acknowledge", "Detect, Order, Route, Assign", "Deploy, Open, Request, Allow", "Discover, Order, Reserve, Assign"]
    answer: 0
lab:
  title: "DHCP Configuration บน Cisco Router"
  scenario: "กำหนด DHCP server บน router เพื่อจ่าย IP ให้ client ใน 192.168.1.0/24"
  steps:
    - "ยกเว้น IP ที่ใช้แล้ว: Router(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10"
    - "สร้าง DHCP pool: Router(config)# ip dhcp pool LAN"
    - "กำหนด network: Router(dhcp-config)# network 192.168.1.0 255.255.255.0"
    - "กำหนด default gateway: Router(dhcp-config)# default-router 192.168.1.1"
    - "กำหนด DNS server: Router(dhcp-config)# dns-server 8.8.8.8"
---

## DNS (Domain Name System)

DNS แปลง domain name เป็น IP address เหมือนสมุดโทรศัพท์ของ internet

### DNS Record Types

| Record | ใช้สำหรับ | ตัวอย่าง |
|--------|---------|---------|
| A | domain → IPv4 | google.com → 142.250.x.x |
| AAAA | domain → IPv6 | - |
| CNAME | alias | www → google.com |
| MX | Mail server | - |
| PTR | IPv4 → domain (reverse DNS) | - |

### DNS Resolution Process

```
Browser → Local cache → OS cache → Recursive Resolver
         → Root NS → TLD NS (.com) → Authoritative NS
         → IP address ส่งกลับ
```

## DHCP (Dynamic Host Configuration Protocol)

DHCP จ่าย IP address และ config อัตโนมัติให้ client

### DORA Process

```
Client ──DISCOVER──────────────────→ (broadcast)
Client ←──OFFER──────────────────── Server
Client ──REQUEST───────────────────→ Server
Client ←──ACKNOWLEDGE──────────────── Server
```

### DHCP Options ที่ส่งให้ client

- IP address + subnet mask
- Default gateway
- DNS server
- Lease time
