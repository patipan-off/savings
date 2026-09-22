# Monthly Savings Tracker (MySQL + Node.js)

เว็บแอปพลิเคชันสำหรับบันทึกและติดตามเงินเก็บรายเดือน พร้อมระบบจัดหมวดหมู่และกราฟเปรียบเทียบระยะยาว

## 🚀 วิธีการติดตั้งและรันโปรเจกต์

1. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd savings-tracker
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **ตั้งค่าฐานข้อมูลและ Environment Variables:**
   - นำไฟล์ `schema.sql` ไปรันใน MySQL เพื่อสร้าง Database และ Tables
   - คัดลอกไฟล์ `.env.example` เป็น `.env` แล้วระบุข้อมูล MySQL Connection:
     ```bash
     cp .env.example .env
     ```

4. **เริ่มใช้งาน Server:**
   ```bash
   npm start
   ```
   เข้าใช้งานได้ที่ `http://localhost:3000`
