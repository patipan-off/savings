-- phpMyAdmin Import
-- 1) สร้าง database ชื่อ savings_db (utf8mb4_unicode_ci)
-- 2) เลือก savings_db ทางซ้าย แล้ว Import ไฟล์นี้

-- ตารางเก็บประเภทเงินเก็บ
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตารางเก็บประวัติเงินเก็บรายเดือน
CREATE TABLE IF NOT EXISTS savings_logs (
    month VARCHAR(7) PRIMARY KEY,
    amounts_json JSON NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ข้อมูลประเภทเงินเก็บเริ่มต้น
INSERT INTO categories (id, name, color, sort_order) VALUES
('scb', 'เงินฝาก SCB', '#4c1d95', 1),
('bbl', 'กองทุน BBL', '#1e40af', 2),
('pvd', 'PVD', '#059669', 3),
('crypto', 'Crypto', '#d97706', 4)
ON DUPLICATE KEY UPDATE name=VALUES(name);
