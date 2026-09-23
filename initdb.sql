SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `offsdev1_savings`
--
CREATE DATABASE IF NOT EXISTS `offsdev1_savings` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `offsdev1_savings`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '#10b981',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `color`, `sort_order`) VALUES
('scb', 'เงินฝาก SCB', '#4c1d95', 1),
('bbl', 'กองทุน BBL', '#1e40af', 2),
('pvd', 'PVD', '#267CBC', 3),
('crypto', 'Crypto', '#d97706', 4)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `color` = VALUES(`color`), `sort_order` = VALUES(`sort_order`);

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE IF NOT EXISTS `expense_categories` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '#ef4444',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`id`, `name`, `color`, `sort_order`) VALUES
('credit_card', 'บัตรเครดิต', '#138F2D', 1),
('water', 'น้ำ', '#DEF4FC', 2),
('mea', 'ไฟฟ้า', '#7A2682', 3),
('3bb', 'Internet', '#F47920', 4),
('true', 'Mobile Bill', '#EC1C24', 5),
('exat', 'Easy Pass', '#0B2341', 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `color` = VALUES(`color`), `sort_order` = VALUES(`sort_order`);

-- --------------------------------------------------------

--
-- Table structure for table `savings_logs`
--

CREATE TABLE IF NOT EXISTS `savings_logs` (
  `month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` date DEFAULT NULL,
  `amounts_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amounts_json`)),
  `total` decimal(12,2) DEFAULT 0.00,
  `note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_logs`
--

CREATE TABLE IF NOT EXISTS `expense_logs` (
  `month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` date DEFAULT NULL,
  `amounts_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amounts_json`)),
  `total` decimal(12,2) DEFAULT 0.00,
  `note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
