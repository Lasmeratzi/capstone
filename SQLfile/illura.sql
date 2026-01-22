-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 22, 2026 at 02:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `illura`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','super_admin') DEFAULT 'admin',
  `gcash_number` varchar(20) DEFAULT NULL,
  `gcash_name` varchar(100) DEFAULT NULL,
  `qr_code_path` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`, `role`, `gcash_number`, `gcash_name`, `qr_code_path`) VALUES
(6, 'admin', '$2b$10$YYylHcdXoSIL1VIHVA3XTu0lk.EdAT1R4v/gL3ynBU.J9h79gUhhe', '2025-09-10 07:22:09', 'admin', NULL, NULL, NULL),
(7, 'superadmin', '$2b$10$pdCLoSznVgA4WclA8FHdD.r831tE7LcOJIBAAdXyc0onjI9WIG1bi', '2025-09-10 07:22:09', 'super_admin', '09123456789', 'Illura Team', '1764336303955-436204109.png');

-- --------------------------------------------------------

--
-- Table structure for table `artwork_comments`
--

CREATE TABLE `artwork_comments` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `artwork_post_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork_comments`
--

INSERT INTO `artwork_comments` (`id`, `author_id`, `artwork_post_id`, `comment_text`, `created_at`) VALUES
(14, 34, 53, 'commenttest', '2026-01-22 01:14:23');

-- --------------------------------------------------------

--
-- Table structure for table `artwork_media`
--

CREATE TABLE `artwork_media` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `media_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork_media`
--

INSERT INTO `artwork_media` (`id`, `post_id`, `media_path`) VALUES
(97, 53, 'watermarked-1768382844431-grunge-texture-overlay-black-white-104976.jpg'),
(98, 53, 'watermarked-1768382844433-istockphoto-532051977-612x612.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `artwork_posts`
--

CREATE TABLE `artwork_posts` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `visibility` enum('public','friends','private') DEFAULT 'private'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork_posts`
--

INSERT INTO `artwork_posts` (`id`, `author_id`, `title`, `description`, `created_at`, `visibility`) VALUES
(53, 28, 'asdasdads', '12312313', '2026-01-14 09:27:24', 'friends');

-- --------------------------------------------------------

--
-- Table structure for table `artwork_post_likes`
--

CREATE TABLE `artwork_post_likes` (
  `id` int(11) NOT NULL,
  `artwork_post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork_post_likes`
--

INSERT INTO `artwork_post_likes` (`id`, `artwork_post_id`, `user_id`, `created_at`) VALUES
(14, 53, 38, '2026-01-20 10:08:51'),
(15, 53, 34, '2026-01-22 00:51:56');

-- --------------------------------------------------------

--
-- Table structure for table `artwork_tags`
--

CREATE TABLE `artwork_tags` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork_tags`
--

INSERT INTO `artwork_tags` (`id`, `post_id`, `tag_id`, `created_at`) VALUES
(63, 53, 10, '2026-01-22 00:51:44');

-- --------------------------------------------------------

--
-- Table structure for table `auctions`
--

CREATE TABLE `auctions` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `starting_price` decimal(10,2) NOT NULL,
  `current_price` decimal(10,2) DEFAULT NULL,
  `final_price` decimal(10,2) DEFAULT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('draft','pending','approved','active','ended','stopped','rejected') DEFAULT 'draft',
  `winner_id` int(11) DEFAULT NULL,
  `escrow_status` enum('pending_payment','paid','item_received','completed') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `auction_start_time` datetime DEFAULT NULL,
  `auction_duration_hours` decimal(10,4) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `payment_receipt_path` varchar(255) DEFAULT NULL,
  `release_receipt_path` varchar(255) DEFAULT NULL,
  `payment_receipt_verified` tinyint(1) DEFAULT 0,
  `release_receipt_uploaded` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` (`id`, `author_id`, `title`, `description`, `starting_price`, `current_price`, `final_price`, `end_time`, `status`, `winner_id`, `escrow_status`, `created_at`, `updated_at`, `auction_start_time`, `auction_duration_hours`, `payment_id`, `payment_receipt_path`, `release_receipt_path`, `payment_receipt_verified`, `release_receipt_uploaded`) VALUES
(3, 28, 'uuuuuu', 'oooooo', 111.00, 111.00, NULL, '2026-01-16 12:00:00', 'stopped', NULL, NULL, '2026-01-14 09:32:06', '2026-01-19 08:31:53', '2026-01-15 12:00:00', 24.0000, 1, NULL, NULL, 0, 0),
(4, 28, 'cvbcvbcvbcvb', 'uiuiuiuiuiuiu', 100.00, 100.00, NULL, '2026-01-20 20:14:58', 'stopped', NULL, NULL, '2026-01-20 10:44:24', '2026-01-21 13:22:02', '2026-01-20 19:00:00', 1.2495, 2, NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `auction_bids`
--

CREATE TABLE `auction_bids` (
  `id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `bidder_id` int(11) NOT NULL,
  `bid_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auction_media`
--

CREATE TABLE `auction_media` (
  `id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `media_path` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auction_media`
--

INSERT INTO `auction_media` (`id`, `auction_id`, `media_path`, `created_at`) VALUES
(68, 3, 'auctions/1768383126740-images.jpg', '2026-01-14 09:32:06'),
(69, 4, 'auctions/1768905864244-Texture 6.jpg', '2026-01-20 10:44:24');

-- --------------------------------------------------------

--
-- Table structure for table `auto_replies`
--

CREATE TABLE `auto_replies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `portfolio_item_id` int(11) NOT NULL,
  `reply_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `inquiry_type` enum('price','availability','contact') DEFAULT 'price'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `escrow_releases`
--

CREATE TABLE `escrow_releases` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `buyer_confirmed` tinyint(1) DEFAULT 0,
  `admin_released` tinyint(1) DEFAULT 0,
  `released_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `follows`
--

INSERT INTO `follows` (`id`, `follower_id`, `following_id`, `created_at`) VALUES
(8, 36, 34, '2025-06-12 22:22:11'),
(12, 37, 28, '2025-06-13 13:51:41'),
(13, 28, 39, '2025-06-13 16:05:50'),
(14, 39, 34, '2025-06-14 11:53:02'),
(15, 39, 28, '2025-06-14 11:53:07'),
(16, 39, 38, '2025-06-14 11:53:24'),
(17, 40, 28, '2025-06-14 14:34:14'),
(18, 40, 34, '2025-06-14 14:41:15'),
(19, 28, 35, '2025-08-20 15:58:27'),
(23, 28, 40, '2025-09-18 18:05:11'),
(24, 35, 28, '2025-10-19 23:17:06'),
(26, 28, 34, '2025-10-21 00:47:57'),
(28, 35, 34, '2025-12-05 18:54:38'),
(29, 34, 36, '2025-12-13 18:06:35'),
(30, 34, 39, '2025-12-13 18:06:40'),
(31, 43, 28, '2025-12-13 18:07:58'),
(32, 28, 43, '2025-12-13 18:14:50'),
(33, 34, 28, '2026-01-22 08:52:47');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `province` enum('Negros Occidental','Negros Oriental') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `province`, `created_at`) VALUES
(40, 'Bacolod City', 'Negros Occidental', '2025-10-15 17:20:18'),
(41, 'Bago City', 'Negros Occidental', '2025-10-15 17:20:18'),
(42, 'Cadiz City', 'Negros Occidental', '2025-10-15 17:20:18'),
(43, 'Escalante City', 'Negros Occidental', '2025-10-15 17:20:18'),
(44, 'Himamaylan City', 'Negros Occidental', '2025-10-15 17:20:18'),
(45, 'Kabankalan City', 'Negros Occidental', '2025-10-15 17:20:18'),
(46, 'La Carlota City', 'Negros Occidental', '2025-10-15 17:20:18'),
(47, 'Sagay City', 'Negros Occidental', '2025-10-15 17:20:18'),
(48, 'San Carlos City', 'Negros Occidental', '2025-10-15 17:20:18'),
(49, 'Silay City', 'Negros Occidental', '2025-10-15 17:20:18'),
(50, 'Sipalay City', 'Negros Occidental', '2025-10-15 17:20:18'),
(51, 'Talisay City', 'Negros Occidental', '2025-10-15 17:20:18'),
(52, 'Victorias City', 'Negros Occidental', '2025-10-15 17:20:18'),
(53, 'Binalbagan', 'Negros Occidental', '2025-10-15 17:20:18'),
(54, 'Calatrava', 'Negros Occidental', '2025-10-15 17:20:18'),
(55, 'Candoni', 'Negros Occidental', '2025-10-15 17:20:18'),
(56, 'Cauayan', 'Negros Occidental', '2025-10-15 17:20:18'),
(57, 'Enrique B. Magalona', 'Negros Occidental', '2025-10-15 17:20:18'),
(58, 'Hinigaran', 'Negros Occidental', '2025-10-15 17:20:18'),
(59, 'Hinoba-an', 'Negros Occidental', '2025-10-15 17:20:18'),
(60, 'Ilog', 'Negros Occidental', '2025-10-15 17:20:18'),
(61, 'Isabela', 'Negros Occidental', '2025-10-15 17:20:18'),
(62, 'La Castellana', 'Negros Occidental', '2025-10-15 17:20:18'),
(63, 'Manapla', 'Negros Occidental', '2025-10-15 17:20:18'),
(64, 'Moises Padilla', 'Negros Occidental', '2025-10-15 17:20:18'),
(65, 'Murcia', 'Negros Occidental', '2025-10-15 17:20:18'),
(66, 'Pontevedra', 'Negros Occidental', '2025-10-15 17:20:18'),
(67, 'Pulupandan', 'Negros Occidental', '2025-10-15 17:20:18'),
(68, 'Salvador Benedicto', 'Negros Occidental', '2025-10-15 17:20:18'),
(69, 'San Enrique', 'Negros Occidental', '2025-10-15 17:20:18'),
(70, 'Toboso', 'Negros Occidental', '2025-10-15 17:20:18'),
(71, 'Valladolid', 'Negros Occidental', '2025-10-15 17:20:18'),
(72, 'Dumaguete City', 'Negros Oriental', '2025-10-15 17:20:18'),
(73, 'Bais City', 'Negros Oriental', '2025-10-15 17:20:18'),
(74, 'Bayawan City', 'Negros Oriental', '2025-10-15 17:20:18'),
(75, 'Canlaon City', 'Negros Oriental', '2025-10-15 17:20:18'),
(76, 'Guihulngan City', 'Negros Oriental', '2025-10-15 17:20:18'),
(77, 'Tanjay City', 'Negros Oriental', '2025-10-15 17:20:18'),
(78, 'Amlan', 'Negros Oriental', '2025-10-15 17:20:18'),
(79, 'Ayungon', 'Negros Oriental', '2025-10-15 17:20:18'),
(80, 'Bacong', 'Negros Oriental', '2025-10-15 17:20:18'),
(81, 'Basay', 'Negros Oriental', '2025-10-15 17:20:18'),
(82, 'Bindoy', 'Negros Oriental', '2025-10-15 17:20:18'),
(83, 'Dauin', 'Negros Oriental', '2025-10-15 17:20:18'),
(84, 'Jimalalud', 'Negros Oriental', '2025-10-15 17:20:18'),
(85, 'La Libertad', 'Negros Oriental', '2025-10-15 17:20:18'),
(86, 'Mabinay', 'Negros Oriental', '2025-10-15 17:20:18'),
(87, 'Manjuyod', 'Negros Oriental', '2025-10-15 17:20:18'),
(88, 'Pamplona', 'Negros Oriental', '2025-10-15 17:20:18'),
(89, 'San Jose', 'Negros Oriental', '2025-10-15 17:20:18'),
(90, 'Santa Catalina', 'Negros Oriental', '2025-10-15 17:20:18'),
(91, 'Siaton', 'Negros Oriental', '2025-10-15 17:20:18'),
(92, 'Sibulan', 'Negros Oriental', '2025-10-15 17:20:18'),
(93, 'Tayasan', 'Negros Oriental', '2025-10-15 17:20:18'),
(94, 'Valencia', 'Negros Oriental', '2025-10-15 17:20:18'),
(95, 'Vallehermoso', 'Negros Oriental', '2025-10-15 17:20:18'),
(96, 'Zamboanguita', 'Negros Oriental', '2025-10-15 17:20:18');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `portfolio_id` int(11) DEFAULT NULL,
  `message_text` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `related_table` varchar(50) DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `sender_id`, `type`, `related_table`, `related_id`, `message`, `is_read`, `created_at`) VALUES
(333, 28, 34, 'post_like', NULL, 46, 'xQcWOWers liked your post', 1, '2026-01-21 14:37:55'),
(334, 28, 34, 'post_like', NULL, 46, 'xQcWOWers liked your post', 1, '2026-01-21 14:41:59'),
(335, 28, 28, 'post_like', NULL, 48, 'dadarkXYZ44555 liked your post', 1, '2026-01-21 14:42:23'),
(336, 28, 28, 'post_like', NULL, 48, 'dadarkXYZ44555 liked your post', 1, '2026-01-21 14:42:36'),
(337, 28, 34, 'post_like', NULL, NULL, 'xQcWOWers liked your post', 1, '2026-01-22 00:51:22'),
(338, 28, 34, 'artwork_like', NULL, NULL, 'xQcWOWers liked your artwork', 1, '2026-01-22 00:51:56'),
(339, 28, 34, 'follow', NULL, NULL, 'xQcWOWers followed you', 1, '2026-01-22 00:52:47');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `payer_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('gcash','card','paypal') NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `auction_id`, `payer_id`, `amount`, `payment_method`, `status`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 3, 28, 100.00, 'gcash', 'pending', '2026-01-14 17:32:30', '2026-01-14 09:32:30', '2026-01-14 09:32:30'),
(2, 4, 28, 100.00, 'gcash', 'pending', '2026-01-20 18:44:50', '2026-01-20 10:44:50', '2026-01-20 10:44:50');

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_items`
--

CREATE TABLE `portfolio_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `portfolio_items`
--

INSERT INTO `portfolio_items` (`id`, `user_id`, `title`, `description`, `image_path`, `created_at`, `updated_at`) VALUES
(38, 28, 'projecttest1', 'descrrrr', '3e995b138c23a539a40de3f865cbf62a', '2026-01-14 09:57:54', '2026-01-14 09:57:54');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `media_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `post_status` enum('active','down') DEFAULT 'active',
  `visibility` enum('public','friends','private') DEFAULT 'private'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `title`, `media_path`, `created_at`, `updated_at`, `post_status`, `visibility`) VALUES
(46, 28, 'kkkkkkkyyyyyy', '2919074f960aed294d8d010a920f1a1e', '2026-01-14 09:50:34', '2026-01-19 14:13:18', 'active', 'friends'),
(48, 28, 'rrrrrrr', '9a3b9148ebaf8b90956e0ccfac153a3b', '2026-01-19 14:11:48', '2026-01-21 13:21:32', 'active', 'private');

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`id`, `user_id`, `post_id`, `created_at`) VALUES
(46, 34, 48, '2026-01-20 09:28:57'),
(53, 34, 46, '2026-01-22 00:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `reporter_id` int(11) NOT NULL,
  `content_type` enum('post','artwork','auction') NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `artwork_id` int(11) DEFAULT NULL,
  `auction_id` int(11) DEFAULT NULL,
  `content_author_id` int(11) NOT NULL,
  `report_category` enum('spam','misleading','fake_information','impersonation','inappropriate','harassment','hate_speech','intellectual_property','self_harm','scam_fraud','violence','other') NOT NULL DEFAULT 'other',
  `reason` varchar(500) NOT NULL,
  `status` enum('pending','under_review','dismissed','action_taken') DEFAULT 'pending',
  `action_notes` text DEFAULT NULL,
  `action_taken` enum('none','content_removed','user_warned','content_restricted') DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `reporter_id`, `content_type`, `post_id`, `artwork_id`, `auction_id`, `content_author_id`, `report_category`, `reason`, `status`, `action_notes`, `action_taken`, `reviewed_by`, `reviewed_at`, `created_at`) VALUES
(7, 34, 'artwork', NULL, 53, NULL, 28, 'misleading', 'dddd', 'dismissed', 'yyyyy', 'none', 7, '2026-01-14 09:45:08', '2026-01-14 09:44:51');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES
(10, 'tag1', '2026-01-14 08:20:09'),
(11, 'tag2', '2026-01-14 08:20:09'),
(12, 'tag3', '2026-01-14 08:27:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `pfp` varchar(255) DEFAULT NULL,
  `watermark_path` varchar(255) DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `account_status` enum('active','on hold','banned') DEFAULT 'active',
  `commissions` enum('open','closed') DEFAULT 'closed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified` tinyint(1) DEFAULT 0,
  `twitter_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL,
  `gcash_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `location_id`, `bio`, `birthdate`, `pfp`, `watermark_path`, `cover_photo`, `account_status`, `commissions`, `created_at`, `updated_at`, `verified`, `twitter_link`, `instagram_link`, `facebook_link`, `gcash_number`) VALUES
(28, 'dadarkXYZ44555', 'asd@gmail.com', '$2b$10$ph27ZwaqpvGpgL4qvr6Lre28AUghCdmNDkfZbO/.uKxItLkXfs8YS', 'Dark dark', 40, 'kbkbkkj', '2025-06-05', '1764348319943-barcode-1.jpg', '1764353861430-pepelaugh.png', '1764353883867-Paper_texture_3.jpg', 'active', 'closed', '2025-06-01 16:06:58', '2026-01-20 09:29:32', 1, 'https://www.youtube.com/', 'https://web.facebook.com/ralf.matthew.martinez', 'https://web.facebook.com/ralf.matthew.martinez', '09123451234'),
(34, 'xQcWOWers', 'qwerty@gmail.com', '$2b$10$rRDYKbXVUL1fWJ4ACmzFGu6A./O1FfsCIWQqMmFDMq0ZzLMh9U/ze', 'Felix Nguyan', 41, 'gamba streams', '2025-06-04', '1764639148067-rocky-shore-full-moon.jpg', '1760196515185-illura_2.png', '1760980827279-trytry.jpg', 'active', 'closed', '2025-06-01 16:23:36', '2025-12-05 04:17:17', 1, 'https://www.instagram.com/lasmeratzi/', 'https://www.instagram.com/lasmeratzi/', 'https://www.facebook.com/', '09123994833'),
(35, 'slytherinz', 'zxc@gmail.com', '$2b$10$nQDj54OV1//a2tOqzUUF1efVMKuxzCXnU4uDYhN0i9fZz4j77a2P.', 'Severus Spane', 49, 'zxzx', '2025-06-05', '1749738686711-suit1.png', NULL, '1764903383348-chill.jpg', 'active', 'closed', '2025-06-03 17:17:20', '2026-01-19 14:26:41', 1, 'https://chat.deepseek.com/a/chat/s/51645327-75d0-4e93-951d-00a8f87bc9ce', 'https://chat.deepseek.com/a/chat/s/51645327-75d0-4e93-951d-00a8f87bc9ce', 'https://chat.deepseek.com/a/chat/s/51645327-75d0-4e93-951d-00a8f87bc9ce', NULL),
(36, 'lowkeylokilang', 'xcv@gmail.com', '$2b$10$hgEKp0ebG3wvSBvQayG3ve29/u5jmQ9sk.ntoUbpgPdV0hC/cUwei', 'Loki Odinson', NULL, 'gogog', '2025-06-09', '1bb32ca017a833b2be5a727f4bfde04b', NULL, NULL, 'active', 'closed', '2025-06-08 14:30:37', '2025-06-12 07:23:31', 0, NULL, NULL, NULL, NULL),
(37, 'jimjoe', 'poi@gmail.com', '$2b$10$DnSSnZPQ5Ya9A2ZNRdarROh4gbO7XyWKKEOK6AdBF/RLxWoWOjL7W', 'Jim Jom', NULL, NULL, '2025-06-01', 'f9fb8290101fae7e86fc2c67d3d54423', NULL, NULL, 'active', 'closed', '2025-06-11 15:13:14', '2025-06-13 06:01:37', 1, 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', NULL),
(38, 'dodngslm', 'qwe@gmail.com', '$2b$10$4gG0r/B67gB6dvSrZKhl9OpFy1g0.7V9D9jePwff.OOiZzccHCZuu', 'Dodong Dodoo', NULL, '141 ra gud', '2025-06-11', '1f2931932ed4a6ccfa0131db4629826f', NULL, NULL, 'active', 'closed', '2025-06-12 03:24:33', '2025-06-12 03:25:53', 0, NULL, NULL, NULL, NULL),
(39, 'silverlilly', 'alex@gmail.com', '$2b$10$PIiZ1RBOHpWrHnbLKV1F..QsnyPt0IaV1XXCjfhrhZe6AS/u7TPW.', 'Alexandra Burningham', 40, '', '2000-07-19', '35eb49d231f325cda954df3755435bcf', '1761015655867-alex.png', '1761031625671-Screenshot_2024-07-18_205725.jpg', 'active', 'closed', '2025-06-13 08:01:00', '2025-10-21 07:27:05', 1, 'https://www.youtube.com/watch?v=j23SO29LNWE', 'https://www.youtube.com/watch?v=j23SO29LNWE', 'https://www.youtube.com/watch?v=j23SO29LNWE', NULL),
(40, 'johndoe123', 'email@gmail.com', '$2b$10$LQhCW42G2r8rNi/yiPeJ/eZAtyCAzM0TzYfVR5NCg2oIH1RMpG9km', 'John Doe', NULL, 'gfxbcjvmhv', '2025-06-11', '64844cb6f5a983635b8c95a9805843c7', NULL, NULL, 'active', 'open', '2025-06-14 06:30:56', '2025-06-14 07:18:18', 1, 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', NULL),
(41, 'john123', 'vbnm@gmail.com', '$2b$10$0rZ4rKwB3lQwRTSHmGoqiOUY3jVQB6xc0bvTKjtiKGsuPO8Endf2W', 'John Doe', NULL, 'sdvdcv dvd', '2025-08-29', '1755677083737-mechak6.jpg', NULL, NULL, 'active', 'closed', '2025-08-20 08:03:54', '2025-08-20 08:04:43', 0, NULL, NULL, NULL, NULL),
(42, 'peterpark', 'bbb@gmail.com', '$2b$10$cSYwyjNLqrS6.7fjG63uzukvfsUKcsu12qAdoLnsZQc5Hl1Busmmy', 'Peter Parker', NULL, NULL, '2003-12-12', 'f3d6a58e2f5a584b17633c39618afe14', NULL, NULL, 'active', 'closed', '2025-12-12 14:29:25', '2025-12-12 14:29:25', 0, NULL, NULL, NULL, NULL),
(43, 'user123', 'fgh@gmail.com', '$2b$10$ZeljjWLD.K9K8YPmC5AUH..AacSATKr3Ut1P5/vW6g.4IEvo7CAKW', 'Diao Diao', NULL, NULL, '2003-12-13', '67d241cceb99d09458f63b05a406bd16', NULL, NULL, 'active', 'closed', '2025-12-13 09:48:41', '2025-12-13 09:50:36', 1, 'http://localhost:5173/verifyprofile', 'http://localhost:5173/verifyprofile', 'http://localhost:5173/verifyprofile', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `verification_requests`
--

CREATE TABLE `verification_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `twitter_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `request_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verification_requests`
--

INSERT INTO `verification_requests` (`id`, `user_id`, `twitter_link`, `instagram_link`, `facebook_link`, `status`, `request_date`) VALUES
(5, 28, 'https://web.facebook.com/ralf.matthew.martinez', 'https://web.facebook.com/ralf.matthew.martinez', 'https://web.facebook.com/ralf.matthew.martinez', 'approved', '2025-06-11 21:31:11'),
(6, 34, 'https://www.instagram.com/lasmeratzi/', 'https://www.instagram.com/lasmeratzi/', 'https://www.instagram.com/lasmeratzi/', 'approved', '2025-06-11 22:31:28'),
(9, 37, 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', 'approved', '2025-06-13 06:01:00'),
(11, 40, 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', 'approved', '2025-06-14 06:33:01'),
(17, 43, 'http://localhost:5173/verifyprofile', 'http://localhost:5173/verifyprofile', 'http://localhost:5173/verifyprofile', 'approved', '2025-12-13 09:50:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `artwork_comments`
--
ALTER TABLE `artwork_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `artwork_post_id` (`artwork_post_id`);

--
-- Indexes for table `artwork_media`
--
ALTER TABLE `artwork_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `artwork_posts`
--
ALTER TABLE `artwork_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `artwork_post_likes`
--
ALTER TABLE `artwork_post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`artwork_post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `artwork_tags`
--
ALTER TABLE `artwork_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_post_tag` (`post_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `auctions`
--
ALTER TABLE `auctions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `fk_auctions_winner` (`winner_id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `auction_bids`
--
ALTER TABLE `auction_bids`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auction_id` (`auction_id`),
  ADD KEY `bidder_id` (`bidder_id`);

--
-- Indexes for table `auction_media`
--
ALTER TABLE `auction_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auction_id` (`auction_id`);

--
-- Indexes for table `auto_replies`
--
ALTER TABLE `auto_replies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_item_type` (`user_id`,`portfolio_item_id`,`inquiry_type`),
  ADD KEY `portfolio_item_id` (`portfolio_item_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `escrow_releases`
--
ALTER TABLE `escrow_releases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_follow` (`follower_id`,`following_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recipient_id` (`recipient_id`),
  ADD KEY `messages_ibfk_3` (`portfolio_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_notifications_sender` (`sender_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payer_id` (`payer_id`),
  ADD KEY `payments_ibfk_1` (`auction_id`);

--
-- Indexes for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_report` (`reporter_id`,`content_type`,`post_id`,`artwork_id`,`auction_id`),
  ADD KEY `content_author_id` (`content_author_id`),
  ADD KEY `reviewed_by` (`reviewed_by`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `artwork_id` (`artwork_id`),
  ADD KEY `auction_id` (`auction_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_location` (`location_id`);

--
-- Indexes for table `verification_requests`
--
ALTER TABLE `verification_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `artwork_comments`
--
ALTER TABLE `artwork_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `artwork_media`
--
ALTER TABLE `artwork_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `artwork_posts`
--
ALTER TABLE `artwork_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `artwork_post_likes`
--
ALTER TABLE `artwork_post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `artwork_tags`
--
ALTER TABLE `artwork_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `auction_bids`
--
ALTER TABLE `auction_bids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `auction_media`
--
ALTER TABLE `auction_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `auto_replies`
--
ALTER TABLE `auto_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `escrow_releases`
--
ALTER TABLE `escrow_releases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=340;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `verification_requests`
--
ALTER TABLE `verification_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artwork_comments`
--
ALTER TABLE `artwork_comments`
  ADD CONSTRAINT `artwork_comments_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `artwork_comments_ibfk_2` FOREIGN KEY (`artwork_post_id`) REFERENCES `artwork_posts` (`id`);

--
-- Constraints for table `artwork_media`
--
ALTER TABLE `artwork_media`
  ADD CONSTRAINT `artwork_media_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `artwork_posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `artwork_posts`
--
ALTER TABLE `artwork_posts`
  ADD CONSTRAINT `artwork_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `artwork_post_likes`
--
ALTER TABLE `artwork_post_likes`
  ADD CONSTRAINT `artwork_post_likes_ibfk_1` FOREIGN KEY (`artwork_post_id`) REFERENCES `artwork_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artwork_post_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `artwork_tags`
--
ALTER TABLE `artwork_tags`
  ADD CONSTRAINT `artwork_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `artwork_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artwork_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auctions`
--
ALTER TABLE `auctions`
  ADD CONSTRAINT `auctions_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_auctions_payment_id` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  ADD CONSTRAINT `fk_auctions_winner` FOREIGN KEY (`winner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `auction_bids`
--
ALTER TABLE `auction_bids`
  ADD CONSTRAINT `auction_bids_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auction_bids_ibfk_2` FOREIGN KEY (`bidder_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auction_media`
--
ALTER TABLE `auction_media`
  ADD CONSTRAINT `auction_media_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auto_replies`
--
ALTER TABLE `auto_replies`
  ADD CONSTRAINT `auto_replies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `auto_replies_ibfk_2` FOREIGN KEY (`portfolio_item_id`) REFERENCES `portfolio_items` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `escrow_releases`
--
ALTER TABLE `escrow_releases`
  ADD CONSTRAINT `escrow_releases_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  ADD CONSTRAINT `escrow_releases_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolio_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`payer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  ADD CONSTRAINT `portfolio_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`content_author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`reviewed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reports_ibfk_4` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_5` FOREIGN KEY (`artwork_id`) REFERENCES `artwork_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_6` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `verification_requests`
--
ALTER TABLE `verification_requests`
  ADD CONSTRAINT `verification_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
