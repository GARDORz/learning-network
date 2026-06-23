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
  scenario: "พิจารณาแต่ละ use case แล้วตัดสินใจว่าควรใช้ TCP หรือ UDP — check เมื่อเข้าใจเหตุผล"
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
