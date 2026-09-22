CREATE DATABASE IF NOT EXISTS savings_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE savings_db;

-- ตารางเก็บประเภทเงินเก็บ
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางเก็บประวัติเงินเก็บรายเดือน
CREATE TABLE IF NOT EXISTS savings_logs (
    month VARCHAR(7) PRIMARY KEY, -- รูปแบบ YYYY-MM เช่น 2026-01
    amounts_json JSON NOT NULL,   -- เก็บยอดแต่ละประเภทในรูปแบบ JSON
    total DECIMAL(12, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูลประเภทเงินเก็บเริ่มต้น
INSERT INTO categories (id, name, color, sort_order) VALUES
('scb', 'เงินฝาก SCB', '#4c1d95', 1),
('bbl', 'กองทุน BBL', '#1e40af', 2),
('pvd', 'PVD', '#059669', 3),
('crypto', 'Crypto', '#d97706', 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);
