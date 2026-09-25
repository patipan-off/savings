CREATE DATABASE IF NOT EXISTS `savings_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `savings_db`;

-- 1. Savings Categories & Logs
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `color` VARCHAR(20) DEFAULT '#10b981',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `savings_logs` (
  `month` VARCHAR(7) NOT NULL,
  `entry_date` DATE DEFAULT NULL,
  `amounts_json` JSON NOT NULL,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `note` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Variable Expenses Categories & Logs (Updated with period_type)
CREATE TABLE IF NOT EXISTS `expense_categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `color` VARCHAR(20) DEFAULT '#ef4444',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `expense_logs` (
  `period` VARCHAR(10) NOT NULL,
  `period_type` ENUM('monthly', 'yearly') DEFAULT 'monthly',
  `entry_date` DATE DEFAULT NULL,
  `amounts_json` JSON NOT NULL,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `note` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`period`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Income Categories & Logs
CREATE TABLE IF NOT EXISTS `income_categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `color` VARCHAR(20) DEFAULT '#06b6d4',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `income_logs` (
  `period` VARCHAR(10) NOT NULL,
  `period_type` ENUM('monthly', 'yearly') DEFAULT 'monthly',
  `entry_date` DATE DEFAULT NULL,
  `amounts_json` JSON NOT NULL,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `note` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`period`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Fixed Expenses (Subscriptions)
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `cycle` ENUM('monthly', 'yearly') DEFAULT 'monthly',
  `color` VARCHAR(20) DEFAULT '#6366f1',
  `category` VARCHAR(50) DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;