---
id: "1-3"
moduleId: "1"
title: "Network Devices"
order: 3
quiz:
  - question: "Switch ทำงานที่ OSI Layer ใด?"
    options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"]
    answer: 1
  - question: "Router ใช้อะไรในการ forward packet?"
    options: ["MAC address", "IP address", "Port number", "VLAN ID"]
    answer: 1
  - question: "Hub แตกต่างจาก Switch อย่างไร?"
    options: ["Hub ทำงานที่ Layer 3", "Hub ส่งข้อมูลออกทุก port ส่วน Switch ส่งเฉพาะ port ปลายทาง", "Switch ไม่มี MAC table", "Hub เร็วกว่า Switch"]
    answer: 1
  - question: "Firewall ทำหน้าที่อะไร?"
    options: ["เพิ่มความเร็วเครือข่าย", "กรอง traffic ตาม rules", "แปลง IP address", "จ่าย IP address อัตโนมัติ"]
    answer: 1
  - question: "อุปกรณ์ใดทำหน้าที่ NAT ได้?"
    options: ["Hub", "Switch", "Router", "Repeater"]
    answer: 2
lab:
  title: "ออกแบบ Network Topology"
  scenario: "บริษัทมี 20 PC, 1 Server, และต้องการเชื่อมต่ออินเทอร์เน็ต ให้เลือกอุปกรณ์และ check เมื่อเข้าใจหน้าที่"
  steps:
    - "เลือก Switch 24-port เพื่อเชื่อม PC และ Server เข้าด้วยกันใน LAN"
    - "เลือก Router เพื่อเชื่อมต่อ LAN ออกสู่ Internet (ISP)"
    - "วาง Firewall ระหว่าง Router กับ Switch เพื่อกรอง traffic"
    - "ตรวจสอบว่า Router ทำ NAT เพื่อแปลง private IP เป็น public IP"
    - "สรุป: Hub ห้ามใช้ใน network จริง เพราะ broadcast ทุก frame ออกทุก port"
---

## Network Devices

### Hub (Layer 1)
- รับข้อมูลแล้ว **broadcast ออกทุก port**
- ทำให้เกิด collision บ่อย
- **ไม่ใช้ในเครือข่ายสมัยใหม่แล้ว**

### Switch (Layer 2)
- เรียนรู้ **MAC address** ของแต่ละ port (MAC address table)
- ส่งข้อมูล **เฉพาะ port ปลายทาง** ลด collision
- ทำงานใน LAN เดียวกัน

```
PC-A ──┐
PC-B ──┤ Switch ├── Server
PC-C ──┘
```

### Router (Layer 3)
- ส่ง packet ข้าม **network ต่างๆ** โดยใช้ IP address
- มี **Routing Table** เพื่อตัดสินใจว่าจะส่ง packet ไปทางไหน
- ทำ **NAT** เพื่อแปลง private เป็น public IP

### Firewall
- กรอง traffic ตาม rules (allow/deny)
- ทำงานได้ตั้งแต่ Layer 3-7
- มีทั้ง hardware และ software

### Access Point (AP)
- เชื่อมต่ออุปกรณ์ wireless เข้ากับ wired network
- ทำงานที่ Layer 2

## Network Topology

| Topology | ข้อดี | ข้อเสีย |
|----------|-------|---------|
| Star | ดูแลง่าย, node เสียไม่กระทบอื่น | ถ้า switch เสีย ทั้ง network ล่ม |
| Bus | ง่าย, ถูก | ถ้าสาย break ทั้งหมดล่ม |
| Ring | predictable performance | node เสียกระทบทั้งวง |
| Mesh | redundancy สูง | แพง, ซับซ้อน |
