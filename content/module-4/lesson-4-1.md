---
id: "4-1"
moduleId: "4"
title: "Static Routing"
order: 1
quiz:
  - question: "คำสั่ง static route บน Cisco IOS คือ?"
    options: ["ip route [dest] [mask] [next-hop]", "route add [dest]", "add route [dest]", "static route [dest]"]
    answer: 0
  - question: "Default route คือ?"
    options: ["0.0.0.0/0", "255.255.255.255/0", "192.168.0.0/16", "10.0.0.0/8"]
    answer: 0
  - question: "Administrative Distance ของ static route คือ?"
    options: ["0", "1", "90", "110"]
    answer: 1
  - question: "ดู Routing table ด้วยคำสั่งอะไร?"
    options: ["show ip table", "show ip route", "show route", "display ip route"]
    answer: 1
  - question: "Next-hop address คืออะไร?"
    options: ["IP ของ destination host", "IP ของ router ตัวถัดไป", "IP ของ source", "broadcast address"]
    answer: 1
lab:
  title: "Configure Static Route"
  scenario: "กำหนด static route เพื่อให้ Router A เข้าถึง 192.168.2.0/24 ผ่าน Router B ที่ 10.0.0.2"
  steps:
    - "เข้า config mode: RouterA# conf t"
    - "กำหนด static route: RouterA(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2"
    - "ตรวจสอบ routing table: RouterA# show ip route"
    - "ทดสอบ connectivity: RouterA# ping 192.168.2.1"
    - "กำหนด default route: RouterA(config)# ip route 0.0.0.0 0.0.0.0 [ISP-gateway-IP]"
---

## Static Routing

Static route คือ route ที่ admin กำหนดเองด้วย command ไม่ได้เรียนรู้อัตโนมัติ

## ข้อดีและข้อเสีย

| | Static Route | Dynamic Route |
|--|-------------|--------------|
| ข้อดี | ง่าย, ปลอดภัย, ไม่ใช้ CPU | ปรับตัวอัตโนมัติ, scale ได้ |
| ข้อเสีย | ดูแลยากใน network ใหญ่ | ใช้ resource มากกว่า |
| เหมาะกับ | Small network, stub network | Large network |

## Cisco Commands

```
! Static route
Router(config)# ip route [destination] [mask] [next-hop]

! ตัวอย่าง
Router(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2

! Default route (ส่งทุก traffic ที่ไม่รู้ไปที่)
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! ดู routing table
Router# show ip route
```

## Administrative Distance

AD คือค่า trustworthiness ของ routing source (ต่ำ = น่าเชื่อถือกว่า):

| Source | AD |
|--------|-----|
| Connected | 0 |
| Static | 1 |
| OSPF | 110 |
| RIP | 120 |
