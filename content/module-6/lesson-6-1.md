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
  - question: "Standard ACL ควร apply ไว้ใกล้ที่ใด?"
    options: ["ใกล้ source", "ใกล้ destination", "ที่ internet edge", "ไม่มีข้อกำหนด"]
    answer: 1
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
    - "สร้าง ACL: Router(config)# access-list 10 deny 192.168.2.0 0.0.0.255"
    - "อนุญาต traffic อื่น: Router(config)# access-list 10 permit any"
    - "Apply บน interface ใกล้ destination (inbound): Router(config-if)# ip access-group 10 in"
    - "ตรวจสอบ: Router# show access-lists"
    - "ทดสอบด้วย ping จาก host ใน 192.168.2.0/24 ไปยัง 192.168.1.x (ควร fail)"
---

## Access Control Lists (ACLs)

ACL คือ rule set สำหรับกรอง packet บน router

### Standard vs Extended ACL

| | Standard (1-99) | Extended (100-199) |
|--|----------------|-------------------|
| กรองตาม | Source IP | Src/Dst IP, Port, Protocol |
| Apply ไว้ | ใกล้ destination | ใกล้ source |
| ตัวอย่าง | Block host ทั้งหมด | Block HTTP จาก host หนึ่งไป server |

### Implicit Deny

ทุก ACL มี **implicit deny any** ท้ายสุดเสมอ ถ้าไม่มี `permit any` จะ block ทุกอย่างที่ไม่ได้ระบุ

## Firewalls

### Packet Filter
- กรอง packet แต่ละตัวแบบ stateless
- ดูเฉพาะ header (src/dst IP, port)
- เร็วแต่ security น้อยกว่า

### Stateful Firewall
- ติดตาม **connection state** (SYN, established, FIN)
- อนุญาต return traffic อัตโนมัติ
- ปลอดภัยกว่า packet filter

### Next-Generation Firewall (NGFW)
- Deep Packet Inspection (DPI)
- Application awareness
- IDS/IPS built-in

## Cisco ACL Commands

```
! Standard ACL
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# access-list 10 deny any

! Extended ACL
Router(config)# access-list 100 deny tcp 192.168.2.0 0.0.0.255 any eq 80
Router(config)# access-list 100 permit ip any any

! Apply บน interface
Router(config-if)# ip access-group 10 in
Router(config-if)# ip access-group 100 out
```
