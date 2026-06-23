---
id: "2-2"
moduleId: "2"
title: "Subnetting"
order: 2
quiz:
  - question: "Network /26 มีกี่ usable host?"
    options: ["30", "62", "126", "254"]
    answer: 1
  - question: "192.168.1.0/25 มี subnet mask อะไร?"
    options: ["255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224"]
    answer: 1
  - question: "VLSM ย่อมาจากอะไร?"
    options: ["Variable Length Subnet Mask", "Very Large Subnet Method", "Virtual LAN Subnet Mapping", "Variable Link Subnet Mode"]
    answer: 0
  - question: "/30 subnet ใช้ทำอะไร?"
    options: ["LAN ใหญ่", "Point-to-point link ระหว่าง router", "VLAN segment", "Management network"]
    answer: 1
  - question: "Broadcast address ของ 192.168.1.0/24 คือ?"
    options: ["192.168.1.0", "192.168.1.1", "192.168.1.254", "192.168.1.255"]
    answer: 3
lab:
  title: "คำนวณ Subnet"
  scenario: "คำนวณ network address, broadcast, และ usable host range สำหรับแต่ละ subnet"
  steps:
    - "192.168.10.0/26 → Network: .0, Broadcast: .63, Hosts: .1-.62 (62 hosts)"
    - "10.0.0.0/8 → Network: 10.0.0.0, Broadcast: 10.255.255.255, Hosts: 16,777,214"
    - "172.16.5.0/30 → Network: .0, Broadcast: .3, Hosts: .1-.2 (2 hosts, point-to-point)"
    - "192.168.1.128/25 → Network: .128, Broadcast: .255, Hosts: .129-.254 (126 hosts)"
---

## Subnetting

Subnetting คือการแบ่ง network ใหญ่ออกเป็น network ย่อยๆ เพื่อใช้ IP address ได้อย่างมีประสิทธิภาพ

## สูตรคำนวณ

- **Number of subnets** = 2^(borrowed bits)
- **Hosts per subnet** = 2^(host bits) - 2
- **Block size** = 256 - subnet mask octet

## CIDR Notation

| CIDR | Subnet Mask | Hosts |
|------|------------|-------|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |

## VLSM (Variable Length Subnet Mask)

VLSM ช่วยให้ใช้ subnet mask ขนาดต่างกันใน network เดียวกัน ประหยัด IP address ได้มาก เช่น ใช้ /30 สำหรับ point-to-point links ระหว่าง router
