---
id: "3-1"
moduleId: "3"
title: "VLANs"
order: 1
quiz:
  - question: "VLAN ย่อมาจากอะไร?"
    options: ["Virtual LAN", "Variable LAN", "Verified LAN", "Vendor LAN"]
    answer: 0
  - question: "VLAN ทำงานที่ OSI Layer ใด?"
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"]
    answer: 1
  - question: "Trunk port ทำหน้าที่อะไร?"
    options: ["เชื่อมต่อ PC กับ switch", "ส่ง traffic หลาย VLAN ผ่าน link เดียว", "กำหนด default VLAN", "block broadcast"]
    answer: 1
  - question: "Native VLAN คือ VLAN ใดโดย default บน Cisco switch?"
    options: ["VLAN 0", "VLAN 1", "VLAN 99", "VLAN 100"]
    answer: 1
  - question: "Inter-VLAN routing ต้องการอะไร?"
    options: ["Switch เพิ่มเติม", "Router หรือ Layer 3 switch", "Hub", "Repeater"]
    answer: 1
lab:
  title: "VLAN Configuration บน Cisco Switch"
  scenario: "ฝึก configure VLAN บน Cisco switch ผ่าน CLI commands"
  steps:
    - "สร้าง VLAN: switch(config)# vlan 10 แล้ว name SALES"
    - "กำหนด access port: switch(config-if)# switchport mode access / switchport access vlan 10"
    - "กำหนด trunk port: switch(config-if)# switchport mode trunk"
    - "ตรวจสอบ VLAN: switch# show vlan brief"
    - "ตรวจสอบ trunk: switch# show interfaces trunk"
---

## VLANs (Virtual LANs)

VLAN ช่วยแบ่ง switch ออกเป็น broadcast domain ย่อยๆ โดยไม่ต้องใช้ hardware แยก ทำให้:
- **แยก traffic** ระหว่างแผนก (HR, Finance, IT)
- **เพิ่มความปลอดภัย** ป้องกันการ sniff traffic
- **ลด broadcast domain** ให้เล็กลง

## Access Port vs Trunk Port

| | Access Port | Trunk Port |
|--|------------|-----------|
| VLAN | 1 VLAN เท่านั้น | หลาย VLAN |
| ใช้กับ | End device (PC, printer) | Switch-to-Switch, Switch-to-Router |
| Tagging | ไม่มี tag | IEEE 802.1Q tag |

## Inter-VLAN Routing

VLAN ต่างกันจะสื่อสารกันไม่ได้ ต้องผ่าน Router หรือ Layer 3 Switch:

```
VLAN 10 (Sales) ──┐
                   ├── Router/L3 Switch ── ไปยัง VLAN อื่น
VLAN 20 (IT)   ──┘
```

## Cisco Commands

```
! สร้าง VLAN
Switch(config)# vlan 10
Switch(config-vlan)# name SALES

! Access port
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

! Trunk port
Switch(config-if)# switchport mode trunk

! ตรวจสอบ
Switch# show vlan brief
Switch# show interfaces trunk
```
