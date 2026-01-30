-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2026 at 03:20 AM
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
(14, 34, 53, 'commenttest', '2026-01-22 01:14:23'),
(15, 34, 56, 'comment', '2026-01-24 09:48:23');

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
(98, 53, 'watermarked-1768382844433-istockphoto-532051977-612x612.jpg'),
(99, 54, 'watermarked-1769230777042-trytry.jpg'),
(100, 55, 'watermarked-1769233446744-suit2.png'),
(101, 56, 'watermarked-1769244216263-chill.jpg');

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
(53, 28, 'asdasdads', '12312313', '2026-01-14 09:27:24', 'friends'),
(54, 34, 'Title Artwork', 'Description Artwork test asd of the gjl moon sun grass gunnah', '2026-01-24 04:59:36', 'public'),
(55, 35, 'Decmber 31', 'gin kawat ang selpon ni alex', '2026-01-24 05:44:06', 'friends'),
(56, 28, 'Artwork post test', 'Abc 123 fghh ', '2026-01-24 08:43:36', 'friends');

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
(15, 53, 34, '2026-01-22 00:51:56'),
(16, 56, 34, '2026-01-24 09:48:19');

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
(69, 53, 10, '2026-01-24 03:24:43'),
(70, 53, 11, '2026-01-24 03:24:43'),
(71, 53, 12, '2026-01-24 03:24:43'),
(75, 55, 13, '2026-01-24 05:44:06'),
(76, 55, 14, '2026-01-24 05:44:06'),
(77, 54, 14, '2026-01-24 08:28:32'),
(78, 54, 13, '2026-01-24 08:28:32'),
(79, 54, 15, '2026-01-24 08:28:32'),
(80, 54, 16, '2026-01-24 08:28:32'),
(81, 56, 17, '2026-01-24 08:43:36'),
(82, 56, 18, '2026-01-24 08:43:36'),
(83, 56, 19, '2026-01-24 08:43:36');

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
  `release_receipt_uploaded` tinyint(1) DEFAULT 0,
  `use_increment` tinyint(1) DEFAULT 0,
  `bid_increment` decimal(10,2) DEFAULT 100.00,
  `portfolio_item_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` (`id`, `author_id`, `title`, `description`, `starting_price`, `current_price`, `final_price`, `end_time`, `status`, `winner_id`, `escrow_status`, `created_at`, `updated_at`, `auction_start_time`, `auction_duration_hours`, `payment_id`, `payment_receipt_path`, `release_receipt_path`, `payment_receipt_verified`, `release_receipt_uploaded`, `use_increment`, `bid_increment`, `portfolio_item_id`) VALUES
(1, 28, '676767', '1738', 100.00, 1700.00, 1700.00, '2026-01-24 22:20:00', 'ended', 44, 'pending_payment', '2026-01-23 14:01:48', '2026-01-28 01:19:00', '2026-01-23 22:20:00', 24.0000, 16, NULL, NULL, 0, 0, 0, 100.00, NULL),
(2, 28, '89898989', 'lklklklkl', 200.00, 300.00, 300.00, '2026-01-24 13:10:00', 'ended', 34, 'completed', '2026-01-24 04:52:12', '2026-01-24 05:12:38', '2026-01-24 13:00:00', 0.1667, 17, '1769231483941-896755651.jpg', '1769231558141-223601480.jpg', 1, 1, 0, 100.00, NULL),
(3, 34, 'Auction Test', '123123123', 1000.00, 4000.00, 4000.00, '2026-01-24 17:37:00', 'ended', 45, 'completed', '2026-01-24 09:25:41', '2026-01-24 09:40:43', '2026-01-24 17:27:00', 0.1667, 18, '1769247562981-822693447.jpg', '1769247643143-493204145.jpg', 1, 1, 1, 500.00, NULL),
(4, 28, 'Jan28', 'jan28', 100.00, 200.00, 200.00, '2026-01-28 09:44:00', 'ended', 34, 'pending_payment', '2026-01-28 01:31:06', '2026-01-28 01:44:00', '2026-01-28 09:34:00', 0.1667, 19, NULL, NULL, 0, 0, 0, 100.00, NULL),
(5, 34, '44444', '66666', 1000.00, 1200.00, 1200.00, '2026-01-28 10:17:00', 'ended', 28, 'pending_payment', '2026-01-28 01:46:03', '2026-01-28 02:17:00', '2026-01-28 09:47:00', 0.5000, 20, NULL, NULL, 0, 0, 1, 100.00, NULL),
(6, 28, '6677', '8888', 200.00, 400.00, 400.00, '2026-01-29 09:56:00', 'ended', 34, 'pending_payment', '2026-01-28 01:54:50', '2026-01-29 07:36:00', '2026-01-28 09:56:00', 24.0000, 21, NULL, NULL, 0, 0, 0, 100.00, NULL),
(7, 28, 'projecttest1', 'descrrrr', 100.00, 200.00, 200.00, '2026-01-30 08:05:00', 'ended', 34, 'pending_payment', '2026-01-29 23:33:11', '2026-01-30 00:05:00', '2026-01-30 07:35:00', 0.5000, 22, NULL, NULL, 0, 0, 0, 100.00, NULL),
(8, 34, 'XQCwow', 'descrption', 100.00, 100.00, NULL, '2026-01-30 08:20:00', 'draft', NULL, NULL, '2026-01-30 00:08:58', '2026-01-30 00:08:58', '2026-01-30 08:10:00', 0.1667, NULL, NULL, NULL, 0, 0, 0, 100.00, NULL),
(9, 34, 'XQCwow', 'descrption', 100.00, 100.00, NULL, '2026-01-31 08:25:00', 'draft', NULL, NULL, '2026-01-30 00:10:18', '2026-01-30 00:10:18', '2026-01-31 08:15:00', 0.1667, NULL, NULL, NULL, 0, 0, 0, 100.00, NULL),
(10, 34, 'XQCwow', 'descrption', 100.00, 100.00, NULL, '2026-01-30 08:25:00', 'draft', NULL, NULL, '2026-01-30 00:11:45', '2026-01-30 00:11:45', '2026-01-30 08:15:00', 0.1667, NULL, NULL, NULL, 0, 0, 0, 100.00, NULL),
(11, 34, 'XQCwow', 'descrption', 99.98, 99.98, NULL, '2026-01-30 08:27:00', 'draft', NULL, NULL, '2026-01-30 00:14:27', '2026-01-30 00:14:27', '2026-01-30 08:17:00', 0.1667, NULL, NULL, NULL, 0, 0, 0, 100.00, NULL),
(12, 34, 'XQCwow', 'descrption', 99.97, 99.97, NULL, '2026-01-30 08:28:00', 'draft', NULL, NULL, '2026-01-30 00:15:04', '2026-01-30 00:15:04', '2026-01-30 08:18:00', 0.1667, NULL, NULL, NULL, 0, 0, 0, 100.00, NULL),
(13, 34, 'XQCwow', 'descrption', 100.00, 100.00, NULL, '2026-01-30 08:31:00', 'ended', NULL, NULL, '2026-01-30 00:18:22', '2026-01-30 00:31:00', '2026-01-30 08:21:00', 0.1667, 23, NULL, NULL, 0, 0, 0, 100.00, NULL),
(14, 28, 'PORTFOLIOAUCTTEST', 'UUUUUU', 100.00, 100.00, NULL, '2026-01-30 08:35:00', 'ended', NULL, NULL, '2026-01-30 00:23:16', '2026-01-30 00:35:00', '2026-01-30 08:25:00', 0.1667, 24, NULL, NULL, 0, 0, 0, 100.00, NULL),
(15, 28, 'PORTAUCTTEST2', 'fgfgfgfgfgfg', 100.00, 200.00, 200.00, '2026-01-30 08:47:00', 'ended', 34, 'completed', '2026-01-30 00:34:40', '2026-01-30 01:55:22', '2026-01-30 08:37:00', 0.1667, 25, '1769738079684-378224153.jpg', '1769738122157-394807607.jpg', 1, 1, 0, 100.00, 42),
(16, 28, '34343434', 'sdsdsdsd', 200.00, 200.00, NULL, '2026-01-30 10:15:59', 'active', NULL, NULL, '2026-01-30 02:08:56', '2026-01-30 02:11:00', '2026-01-30 10:11:00', 0.0833, 26, NULL, NULL, 0, 0, 0, 100.00, NULL);

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

--
-- Dumping data for table `auction_bids`
--

INSERT INTO `auction_bids` (`id`, `auction_id`, `bidder_id`, `bid_amount`, `created_at`) VALUES
(66, 1, 34, 120.00, '2026-01-23 14:29:44'),
(67, 1, 34, 1300.00, '2026-01-23 14:35:20'),
(68, 1, 34, 1450.00, '2026-01-23 14:47:26'),
(69, 1, 35, 1500.00, '2026-01-23 21:20:58'),
(70, 1, 34, 1650.00, '2026-01-23 21:34:37'),
(71, 2, 34, 300.00, '2026-01-24 05:00:24'),
(72, 1, 44, 1700.00, '2026-01-24 09:12:06'),
(73, 3, 45, 1500.00, '2026-01-24 09:27:18'),
(74, 3, 28, 2500.00, '2026-01-24 09:27:50'),
(75, 3, 45, 3000.00, '2026-01-24 09:28:54'),
(76, 3, 45, 4000.00, '2026-01-24 09:32:09'),
(77, 4, 34, 200.00, '2026-01-28 01:35:59'),
(78, 5, 28, 1100.00, '2026-01-28 01:47:14'),
(79, 5, 28, 1200.00, '2026-01-28 01:47:26'),
(80, 6, 34, 300.00, '2026-01-28 01:56:52'),
(81, 6, 34, 400.00, '2026-01-28 01:57:03'),
(82, 7, 34, 200.00, '2026-01-29 23:53:44'),
(83, 15, 34, 200.00, '2026-01-30 00:37:20');

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
(83, 1, 'auctions/1769176908844-Texture 1.jpg', '2026-01-23 14:01:48'),
(84, 2, 'auctions/1769230332348-Texture 2.jpg', '2026-01-24 04:52:12'),
(85, 3, 'auctions/1769246741374-barcode-1.jpg', '2026-01-24 09:25:41'),
(86, 4, 'auctions/1769563866614-Texture 5.jpg', '2026-01-28 01:31:06'),
(87, 5, 'auctions/1769564763401-aesthetic-minimal-white-grid-pattern-wallpaper.jpg', '2026-01-28 01:46:03'),
(88, 6, 'auctions/1769565290610-Texture 6.jpg', '2026-01-28 01:54:50'),
(89, 7, 'auctions/1769729591460-3e995b138c23a539a40de3f865cbf62a', '2026-01-29 23:33:11'),
(90, 13, 'auctions/1769732302392-b9039298a3df303a098d99841a6ac2bb', '2026-01-30 00:18:22'),
(91, 14, 'auctions/1769732596902-0ab838fdd1f51d3cc4d3bd5a8241698e', '2026-01-30 00:23:17'),
(92, 15, 'auctions/1769733280595-d71271fc18a492ef07f386b90f9062bf', '2026-01-30 00:34:40'),
(93, 16, 'auctions/1769738936808-kn.jpg', '2026-01-30 02:08:56');

-- --------------------------------------------------------

--
-- Table structure for table `auction_reminders`
--

CREATE TABLE `auction_reminders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `auction_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auction_reminders`
--

INSERT INTO `auction_reminders` (`id`, `user_id`, `auction_id`, `created_at`) VALUES
(12, 34, 1, '2026-01-23 14:02:24'),
(13, 34, 2, '2026-01-24 04:52:55'),
(14, 45, 3, '2026-01-24 09:26:11');

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

--
-- Dumping data for table `auto_replies`
--

INSERT INTO `auto_replies` (`id`, `user_id`, `portfolio_item_id`, `reply_text`, `created_at`, `updated_at`, `inquiry_type`) VALUES
(13, 45, 39, '2000.00', '2026-01-24 09:33:55', '2026-01-24 09:37:36', 'price'),
(14, 45, 39, 'N/A', '2026-01-24 09:33:55', '2026-01-24 09:37:36', 'availability'),
(15, 45, 39, '123123123', '2026-01-24 09:33:55', '2026-01-24 09:37:36', 'contact');

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

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `author_id`, `post_id`, `comment_text`, `created_at`) VALUES
(40, 34, 46, 'tetetete', '2026-01-23 21:17:21');

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
(33, 34, 28, '2026-01-22 08:52:47'),
(34, 28, 45, '2026-01-24 17:34:22'),
(35, 45, 28, '2026-01-24 17:36:06');

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

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `recipient_id`, `portfolio_id`, `message_text`, `is_read`, `created_at`) VALUES
(93, 28, 34, NULL, 'fhghgh', 1, '2026-01-23 12:55:52'),
(94, 34, 28, NULL, 'asdasd', 1, '2026-01-23 12:56:01'),
(95, 34, 28, NULL, 'message message', 1, '2026-01-24 08:28:48'),
(96, 28, 45, 39, 'Hi! I\'m interested in \"Painting\". How much does this cost?', 1, '2026-01-24 09:34:14'),
(97, 45, 28, 39, '2000.00', 1, '2026-01-24 09:34:14'),
(98, 28, 45, 39, 'Hi! Is \"Painting\" still available?', 1, '2026-01-24 09:35:30'),
(99, 45, 28, 39, 'Yes', 1, '2026-01-24 09:35:30'),
(100, 28, 45, 39, 'Hi! Could you share your contact details for \"Painting\"?', 1, '2026-01-24 09:35:42'),
(101, 45, 28, 39, '123123123', 1, '2026-01-24 09:35:42'),
(102, 28, 45, NULL, 'is this available?', 1, '2026-01-24 09:35:55');

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
(339, 28, 34, 'follow', NULL, NULL, 'xQcWOWers followed you', 1, '2026-01-22 00:52:47'),
(340, 28, NULL, NULL, NULL, NULL, 'Your auction \"qweqweqwe\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 05:56:12'),
(341, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"qweqweqwe\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 05:56:14'),
(342, 28, NULL, NULL, NULL, NULL, 'Your auction \"qweqweqwe\" status has been updated to \"approved\".', 1, '2026-01-22 05:57:11'),
(343, 28, NULL, NULL, NULL, NULL, 'Your auction \"qweqweqwe\" status has been updated to \"active\".', 1, '2026-01-22 05:57:47'),
(344, 28, NULL, NULL, NULL, NULL, 'Your auction \"qweqweqwe\" has ended. Highest bidder: @xQcWOWers with ₱120.00. Check your auctions.', 1, '2026-01-22 06:02:00'),
(345, 34, NULL, NULL, NULL, NULL, 'You won the auction \"qweqweqwe\" with ₱120.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-22 06:02:00'),
(346, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"qweqweqwe\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-22 06:03:00'),
(347, 28, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"qweqweqwe\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-22 06:03:30'),
(348, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"qweqweqwe\" has been verified! The seller will now ship your item.', 1, '2026-01-22 06:03:30'),
(349, 28, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"qweqweqwe\". Payment will be released to you shortly.', 1, '2026-01-22 06:04:19'),
(350, 28, NULL, NULL, NULL, NULL, 'Payment of ₱120 for your auction \"qweqweqwe\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-22 06:04:38'),
(351, 34, NULL, NULL, NULL, NULL, 'Transaction completed for \"qweqweqwe\". Thank you for using Illura!', 1, '2026-01-22 06:04:38'),
(352, 28, NULL, NULL, NULL, NULL, 'Your auction \"nmnmnmn\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 07:41:11'),
(353, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"nmnmnmn\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 07:41:15'),
(354, 28, NULL, NULL, NULL, NULL, 'Your auction \"nmnmnmn\" status has been updated to \"approved\".', 1, '2026-01-22 07:41:31'),
(355, 28, NULL, NULL, NULL, NULL, '???? Your auction \"nmnmnmn\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 15:47:59 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 07:43:00'),
(356, 28, NULL, NULL, NULL, NULL, 'Your auction \"nmnmnmn\" has ended. Highest bidder: @xQcWOWers with ₱1500.00. Check your auctions.', 1, '2026-01-22 07:48:00'),
(357, 34, NULL, NULL, NULL, NULL, 'You won the auction \"nmnmnmn\" with ₱1500.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-22 07:48:00'),
(358, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"nmnmnmn\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-22 07:48:28'),
(359, 28, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"nmnmnmn\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-22 07:48:49'),
(360, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"nmnmnmn\" has been verified! The seller will now ship your item.', 1, '2026-01-22 07:48:49'),
(361, 28, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"nmnmnmn\". Payment will be released to you shortly.', 1, '2026-01-22 07:49:22'),
(362, 28, NULL, NULL, NULL, NULL, 'Payment of ₱1500 for your auction \"nmnmnmn\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-22 07:49:43'),
(363, 34, NULL, NULL, NULL, NULL, 'Your auction \"rtrtrt\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 10:59:26'),
(364, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"rtrtrt\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 10:59:29'),
(365, 34, NULL, NULL, NULL, NULL, 'Your auction \"rtrtrt\" status has been updated to \"approved\".', 1, '2026-01-22 10:59:46'),
(366, 34, NULL, NULL, NULL, NULL, '???? Your auction \"rtrtrt\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 19:06:59 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 11:02:00'),
(367, 34, NULL, NULL, NULL, NULL, 'Your auction \"rtrtrt\" has ended. Highest bidder: @dadarkXYZ44555 with ₱120.00. Check your auctions.', 1, '2026-01-22 11:07:00'),
(368, 28, NULL, NULL, NULL, NULL, 'You won the auction \"rtrtrt\" with ₱120.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-22 11:07:00'),
(369, 28, NULL, NULL, NULL, NULL, 'Your payment receipt for \"rtrtrt\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-22 11:07:26'),
(370, 34, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"rtrtrt\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-22 11:07:40'),
(371, 28, NULL, NULL, NULL, NULL, 'Your payment receipt for \"rtrtrt\" has been verified! The seller will now ship your item.', 1, '2026-01-22 11:07:40'),
(372, 34, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"rtrtrt\". Payment will be released to you shortly.', 1, '2026-01-22 11:08:17'),
(373, 34, NULL, NULL, NULL, NULL, 'Payment of ₱120 for your auction \"rtrtrt\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-22 11:08:28'),
(374, 34, NULL, NULL, NULL, NULL, 'Your auction \"lklklklklk\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 12:29:39'),
(375, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"lklklklklk\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 12:29:42'),
(376, 34, NULL, NULL, NULL, NULL, 'Your auction \"lklklklklk\" status has been updated to \"approved\".', 1, '2026-01-22 12:29:58'),
(377, 34, NULL, NULL, NULL, NULL, '???? Your auction \"lklklklklk\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 20:34:59 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 12:30:00'),
(378, 34, NULL, NULL, NULL, NULL, 'Your auction \"lklklklklk\" status has been updated to \"stopped\".', 1, '2026-01-22 12:31:25'),
(379, 34, NULL, NULL, NULL, NULL, 'Your auction \"vbvbvb\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 12:32:24'),
(380, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"vbvbvb\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 12:32:25'),
(381, 34, NULL, NULL, NULL, NULL, 'Your auction \"vbvbvb\" status has been updated to \"approved\".', 1, '2026-01-22 12:32:37'),
(382, 34, NULL, NULL, NULL, NULL, '???? Your auction \"vbvbvb\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 20:38:59 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 12:34:00'),
(383, 34, NULL, NULL, NULL, NULL, 'Your auction \"vbvbvb\" status has been updated to \"stopped\".', 1, '2026-01-22 12:36:20'),
(384, 34, NULL, NULL, NULL, NULL, 'Your auction \"ccccc\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 12:41:17'),
(385, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"ccccc\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 12:41:18'),
(386, 34, NULL, NULL, NULL, NULL, 'Your auction \"ccccc\" status has been updated to \"approved\".', 1, '2026-01-22 12:41:29'),
(387, 34, NULL, NULL, NULL, NULL, '???? Your auction \"ccccc\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 20:47:59 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 12:43:00'),
(388, 34, NULL, NULL, NULL, NULL, 'Your auction \"ccccc\" status has been updated to \"stopped\".', 1, '2026-01-22 12:45:43'),
(389, 35, NULL, NULL, NULL, NULL, 'Your auction \"[][][][][\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 12:55:48'),
(390, 35, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"[][][][][\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 12:55:49'),
(391, 35, NULL, NULL, NULL, NULL, 'Your auction \"[][][][][\" status has been updated to \"approved\".', 1, '2026-01-22 12:56:04'),
(392, 35, NULL, 'auction_start', NULL, NULL, '???? Your auction \"[][][][][\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 21:13:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 12:58:00'),
(393, 35, NULL, NULL, NULL, NULL, 'Your auction \"[][][][][\" status has been updated to \"stopped\".', 1, '2026-01-22 13:01:08'),
(394, 35, NULL, NULL, NULL, NULL, 'Your auction \"yyyy\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 13:01:39'),
(395, 35, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"yyyy\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 13:01:41'),
(396, 35, NULL, NULL, NULL, NULL, 'Your auction \"yyyy\" status has been updated to \"approved\".', 1, '2026-01-22 13:01:49'),
(397, 35, NULL, 'auction_start', NULL, NULL, '???? Your auction \"yyyy\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 21:18:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 13:03:00'),
(398, 35, NULL, NULL, NULL, NULL, 'Your auction \"yyyy\" status has been updated to \"stopped\".', 1, '2026-01-22 13:04:19'),
(399, 35, NULL, NULL, NULL, NULL, 'Your auction \"yyyy\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 13:08:08'),
(400, 35, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"yyyy\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 13:08:10'),
(401, 35, NULL, NULL, NULL, NULL, 'Your auction \"yyyy\" status has been updated to \"approved\".', 1, '2026-01-22 13:08:20'),
(402, 35, NULL, 'auction_start', NULL, NULL, '???? Your auction \"yyyy\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 21:25:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 13:10:00'),
(403, 35, NULL, NULL, NULL, NULL, 'Your auction \"yyyy\" status has been updated to \"stopped\".', 1, '2026-01-22 13:12:23'),
(404, 35, NULL, NULL, NULL, NULL, 'Your auction \"ghghghg\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 13:13:07'),
(405, 35, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"ghghghg\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 13:13:08'),
(406, 35, NULL, NULL, NULL, NULL, 'Your auction \"ghghghg\" status has been updated to \"approved\".', 1, '2026-01-22 13:13:21'),
(407, 28, NULL, NULL, NULL, NULL, 'Your auction \"77777\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 13:27:07'),
(408, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"77777\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 13:27:09'),
(409, 28, NULL, NULL, NULL, NULL, 'Your auction \"77777\" status has been updated to \"approved\".', 1, '2026-01-22 13:27:18'),
(410, 35, NULL, 'auction_start', NULL, NULL, '???? Your auction \"ghghghg\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 21:44:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 13:29:00'),
(411, 35, NULL, 'auction_end', NULL, NULL, '⏰ Your auction \"ghghghg\" ends in 10 minutes! No bids yet.', 1, '2026-01-22 13:34:00'),
(412, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"77777\" starts in 5 minutes! (Jan 22, 09:46 PM)', 1, '2026-01-22 13:41:00'),
(413, 28, NULL, NULL, NULL, NULL, 'Your auction \"121212\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 13:41:24'),
(414, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"121212\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 13:41:26'),
(415, 28, NULL, NULL, NULL, NULL, 'Your auction \"121212\" status has been updated to \"approved\".', 1, '2026-01-22 13:41:35'),
(416, 35, NULL, NULL, NULL, NULL, 'Your auction \"ghghghg\" status has been updated to \"stopped\".', 1, '2026-01-22 13:41:38'),
(417, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"77777\" starts in 4 minutes! (Jan 22, 09:46 PM)', 1, '2026-01-22 13:42:00'),
(418, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"77777\" starts in 3 minutes! (Jan 22, 09:46 PM)', 1, '2026-01-22 13:43:00'),
(419, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"77777\" starts in 2 minutes! (Jan 22, 09:46 PM)', 1, '2026-01-22 13:44:00'),
(420, 34, NULL, 'auction_start', NULL, NULL, '⏰ Auction \"77777\" is starting NOW!', 1, '2026-01-22 13:45:00'),
(421, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"77777\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 22:01:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 13:46:00'),
(422, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 10 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:49:00'),
(423, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 9 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:50:00'),
(424, 28, NULL, 'auction_end', NULL, NULL, '⏰ Your auction \"77777\" ends in 10 minutes! No bids yet.', 1, '2026-01-22 13:51:00'),
(425, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 8 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:51:00'),
(426, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 7 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:52:00'),
(427, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 6 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:53:00'),
(428, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 5 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:54:00'),
(429, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 4 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:55:00'),
(430, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 3 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:56:00'),
(431, 35, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"121212\" starts in 2 minutes! (Jan 22, 09:59 PM)', 1, '2026-01-22 13:57:00'),
(432, 35, NULL, 'auction_start', NULL, NULL, '⏰ Auction \"121212\" is starting NOW!', 1, '2026-01-22 13:58:00'),
(433, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"121212\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 22:14:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 13:59:00'),
(434, 28, NULL, 'auction_end', NULL, NULL, 'Your auction \"77777\" has ended with no bids placed.', 1, '2026-01-22 14:01:00'),
(435, 34, NULL, 'auction_end', NULL, NULL, '⏰ Auction \"121212\" ends in 10 minutes! Current bid: ₱400.00. (Ends: Jan 22, 10:14 PM)', 1, '2026-01-22 14:04:00'),
(436, 35, NULL, 'auction_end', NULL, NULL, '⏰ Auction \"121212\" ends in 10 minutes! Current bid: ₱400.00. (Ends: Jan 22, 10:14 PM)', 1, '2026-01-22 14:04:00'),
(437, 28, NULL, 'auction_end', NULL, NULL, '⏰ Your auction \"121212\" ends in 10 minutes! Current highest bid: ₱400.00.', 1, '2026-01-22 14:04:00'),
(438, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"121212\" has ended. Highest bidder: @slytherinz with ₱400.00. Check your auctions.', 1, '2026-01-22 14:14:00'),
(439, 35, NULL, 'auction_win', NULL, NULL, 'You won the auction \"121212\" with ₱400.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-22 14:14:00'),
(440, 35, NULL, NULL, NULL, NULL, 'Your payment receipt for \"121212\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-22 14:21:25'),
(441, 28, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"121212\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-22 14:21:43'),
(442, 35, NULL, NULL, NULL, NULL, 'Your payment receipt for \"121212\" has been verified! The seller will now ship your item.', 1, '2026-01-22 14:21:43'),
(443, 28, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"121212\". Payment will be released to you shortly.', 1, '2026-01-22 14:21:57'),
(444, 28, NULL, NULL, NULL, NULL, 'Payment of ₱400 for your auction \"121212\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-22 14:22:16'),
(445, 35, NULL, NULL, NULL, NULL, 'Transaction completed for \"121212\". Thank you for using Illura!', 1, '2026-01-22 14:22:16'),
(446, 35, NULL, NULL, NULL, NULL, 'Your auction \"cxcvxcvxcv\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-22 14:45:31'),
(447, 35, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"cxcvxcvxcv\" has been recorded. Waiting for admin approval.', 1, '2026-01-22 14:45:32'),
(448, 35, NULL, NULL, NULL, NULL, 'Your auction \"cxcvxcvxcv\" status has been updated to \"approved\".', 1, '2026-01-22 14:45:48'),
(449, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 10 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:50:00'),
(450, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 9 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:51:00'),
(451, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 8 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:52:00'),
(452, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 7 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:53:00'),
(453, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 6 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:54:00'),
(454, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 5 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:55:00'),
(455, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 4 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:56:00'),
(456, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 3 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:57:00'),
(457, 28, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"cxcvxcvxcv\" starts in 2 minutes! (Jan 22, 11:00 PM)', 1, '2026-01-22 14:58:00'),
(458, 28, NULL, 'auction_start', NULL, NULL, '⏰ Auction \"cxcvxcvxcv\" is starting NOW!', 1, '2026-01-22 14:59:00'),
(459, 35, NULL, 'auction_start', NULL, NULL, '???? Your auction \"cxcvxcvxcv\" is now LIVE! The bidding has started and will end on Thu Jan 22 2026 23:15:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-22 15:00:00'),
(460, 28, NULL, 'auction_end', NULL, NULL, '⏰ Auction \"cxcvxcvxcv\" ends in 10 minutes! Current bid: ₱400.00. (Ends: Jan 22, 11:15 PM)', 1, '2026-01-22 15:05:00'),
(461, 34, NULL, 'auction_end', NULL, NULL, '⏰ Auction \"cxcvxcvxcv\" ends in 10 minutes! Current bid: ₱400.00. (Ends: Jan 22, 11:15 PM)', 1, '2026-01-22 15:05:00'),
(462, 35, NULL, 'auction_end', NULL, NULL, '⏰ Your auction \"cxcvxcvxcv\" ends in 10 minutes! Current highest bid: ₱400.00.', 1, '2026-01-22 15:05:00'),
(463, 35, NULL, 'auction_win', NULL, NULL, 'Your auction \"cxcvxcvxcv\" has ended. Highest bidder: @xQcWOWers with ₱400.00. Check your auctions.', 1, '2026-01-22 15:15:00'),
(464, 34, NULL, 'auction_win', NULL, NULL, 'You won the auction \"cxcvxcvxcv\" with ₱400.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-22 15:15:00'),
(465, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"cxcvxcvxcv\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-22 15:22:19'),
(466, 35, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"cxcvxcvxcv\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-22 15:22:30'),
(467, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"cxcvxcvxcv\" has been verified! The seller will now ship your item.', 1, '2026-01-22 15:22:30'),
(468, 35, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"cxcvxcvxcv\". Payment will be released to you shortly.', 1, '2026-01-22 15:22:40'),
(469, 35, NULL, NULL, NULL, NULL, 'Payment of ₱400 for your auction \"cxcvxcvxcv\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-22 15:22:51'),
(470, 34, NULL, NULL, NULL, NULL, 'Transaction completed for \"cxcvxcvxcv\". Thank you for using Illura!', 1, '2026-01-22 15:22:51'),
(471, 28, NULL, NULL, NULL, NULL, 'Your auction \"676767\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-23 14:01:48'),
(472, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"676767\" has been recorded. Waiting for admin approval.', 1, '2026-01-23 14:01:51'),
(473, 28, NULL, NULL, NULL, NULL, 'Your auction \"676767\" status has been updated to \"approved\".', 1, '2026-01-23 14:02:05'),
(474, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 10 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:10:00'),
(475, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 9 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:11:00'),
(476, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 8 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:12:00'),
(477, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 7 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:13:00'),
(478, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 6 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:14:00'),
(479, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 5 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:15:00'),
(480, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 4 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:16:00'),
(481, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 3 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:17:00'),
(482, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"676767\" starts in 2 minutes! (Jan 23, 10:20 PM)', 1, '2026-01-23 14:18:00'),
(483, 34, NULL, 'auction_start', NULL, NULL, '⏰ Auction \"676767\" is starting NOW!', 1, '2026-01-23 14:19:00'),
(484, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"676767\" is now LIVE! The bidding has started and will end on Sat Jan 24 2026 22:20:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-23 14:20:00'),
(485, 28, NULL, NULL, NULL, NULL, 'Your auction \"89898989\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-24 04:52:12'),
(486, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"89898989\" has been recorded. Waiting for admin approval.', 1, '2026-01-24 04:52:14'),
(487, 28, NULL, NULL, NULL, NULL, 'Your auction \"89898989\" status has been updated to \"approved\".', 1, '2026-01-24 04:52:37'),
(488, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"89898989\" starts in 5 minutes! (Jan 24, 01:00 PM)', 1, '2026-01-24 04:55:00'),
(489, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"89898989\" starts in 4 minutes! (Jan 24, 01:00 PM)', 1, '2026-01-24 04:56:00'),
(490, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"89898989\" starts in 3 minutes! (Jan 24, 01:00 PM)', 1, '2026-01-24 04:57:00'),
(491, 34, NULL, 'auction_start', NULL, NULL, '⏰ Reminder: Auction \"89898989\" starts in 2 minutes! (Jan 24, 01:00 PM)', 1, '2026-01-24 04:58:00'),
(492, 34, NULL, 'auction_start', NULL, NULL, '⏰ Auction \"89898989\" is starting NOW!', 1, '2026-01-24 04:59:00'),
(493, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"89898989\" is now LIVE! The bidding has started and will end on Sat Jan 24 2026 13:10:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-24 05:00:00'),
(494, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"89898989\" has ended. Highest bidder: @xQcWOWers with ₱300.00. Check your auctions.', 1, '2026-01-24 05:10:00'),
(495, 34, NULL, 'auction_win', NULL, NULL, 'You won the auction \"89898989\" with ₱300.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-24 05:10:00'),
(496, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"89898989\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-24 05:11:23'),
(497, 28, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"89898989\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-24 05:11:31'),
(498, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"89898989\" has been verified! The seller will now ship your item.', 1, '2026-01-24 05:11:31'),
(499, 28, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"89898989\". Payment will be released to you shortly.', 1, '2026-01-24 05:11:44'),
(500, 28, NULL, NULL, NULL, NULL, 'Payment of ₱300 for your auction \"89898989\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-24 05:12:38'),
(501, 34, NULL, NULL, NULL, NULL, 'Transaction completed for \"89898989\". Thank you for using Illura!', 1, '2026-01-24 05:12:38'),
(502, 34, NULL, NULL, NULL, NULL, 'Your auction \"Auction Test\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-24 09:25:41'),
(503, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"Auction Test\" has been recorded. Waiting for admin approval.', 1, '2026-01-24 09:25:43'),
(504, 34, NULL, NULL, NULL, NULL, 'Your auction \"Auction Test\" status has been updated to \"approved\".', 1, '2026-01-24 09:25:54'),
(505, 34, NULL, 'auction_start', NULL, NULL, '???? Your auction \"Auction Test\" is now LIVE! The bidding has started and will end on Sat Jan 24 2026 17:37:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-24 09:27:00'),
(506, 45, 28, 'follow', NULL, NULL, 'dadarkXYZ44555 followed you', 1, '2026-01-24 09:34:22'),
(507, 28, 45, 'follow', NULL, NULL, 'kingmen followed you', 1, '2026-01-24 09:36:07'),
(508, 34, NULL, 'auction_win', NULL, NULL, 'Your auction \"Auction Test\" has ended. Highest bidder: @kingmen with ₱4000.00. Check your auctions.', 1, '2026-01-24 09:37:00'),
(509, 45, NULL, 'auction_win', NULL, NULL, 'You won the auction \"Auction Test\" with ₱4000.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-24 09:37:00'),
(510, 45, NULL, NULL, NULL, NULL, 'Your payment receipt for \"Auction Test\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-24 09:39:23'),
(511, 34, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"Auction Test\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-24 09:39:40'),
(512, 45, NULL, NULL, NULL, NULL, 'Your payment receipt for \"Auction Test\" has been verified! The seller will now ship your item.', 1, '2026-01-24 09:39:40'),
(513, 34, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"Auction Test\". Payment will be released to you shortly.', 1, '2026-01-24 09:40:24'),
(514, 34, NULL, NULL, NULL, NULL, 'Payment of ₱4000 for your auction \"Auction Test\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-24 09:40:43'),
(515, 45, NULL, NULL, NULL, NULL, 'Transaction completed for \"Auction Test\". Thank you for using Illura!', 1, '2026-01-24 09:40:43'),
(516, 28, 34, 'artwork_like', NULL, NULL, 'xQcWOWers liked your artwork', 1, '2026-01-24 09:48:19'),
(517, 28, NULL, NULL, NULL, NULL, 'A report on your artwork \"Artwork post test\" has been reviewed by admin. Admin notes: Report marked for review.', 1, '2026-01-24 09:48:43'),
(518, 28, NULL, NULL, NULL, NULL, 'You have received a warning regarding your artwork \"Artwork post test\". Admin notes: aeqd', 1, '2026-01-24 09:50:12'),
(519, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"676767\" has ended. Highest bidder: @zzzworrior with ₱1700.00. Check your auctions.', 1, '2026-01-28 01:19:00'),
(520, 44, NULL, 'auction_win', NULL, NULL, 'You won the auction \"676767\" with ₱1700.00. Check your Auction Wins section to proceed with payment.', 0, '2026-01-28 01:19:00'),
(521, 28, NULL, NULL, NULL, NULL, 'Your auction \"Jan28\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-28 01:31:06'),
(522, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"Jan28\" has been recorded. Waiting for admin approval.', 1, '2026-01-28 01:31:08'),
(523, 28, NULL, NULL, NULL, NULL, 'Your auction \"Jan28\" status has been updated to \"approved\".', 1, '2026-01-28 01:31:13'),
(524, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"Jan28\" is now LIVE! The bidding has started and will end on Wed Jan 28 2026 09:44:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-28 01:34:00'),
(525, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"Jan28\" has ended. Highest bidder: @xQcWOWers with ₱200.00. Check your auctions.', 1, '2026-01-28 01:44:00'),
(526, 34, NULL, 'auction_win', NULL, NULL, 'You won the auction \"Jan28\" with ₱200.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-28 01:44:00'),
(527, 34, NULL, NULL, NULL, NULL, 'Your auction \"44444\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-28 01:46:03'),
(528, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"44444\" has been recorded. Waiting for admin approval.', 1, '2026-01-28 01:46:04'),
(529, 34, NULL, NULL, NULL, NULL, 'Your auction \"44444\" status has been updated to \"approved\".', 1, '2026-01-28 01:46:13'),
(530, 34, NULL, 'auction_start', NULL, NULL, '???? Your auction \"44444\" is now LIVE! The bidding has started and will end on Wed Jan 28 2026 10:17:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-28 01:47:00'),
(531, 28, NULL, NULL, NULL, NULL, 'Your auction \"6677\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-28 01:54:50'),
(532, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"6677\" has been recorded. Waiting for admin approval.', 1, '2026-01-28 01:54:51'),
(533, 28, NULL, NULL, NULL, NULL, 'Your auction \"6677\" status has been updated to \"approved\".', 1, '2026-01-28 01:54:58'),
(534, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"6677\" is now LIVE! The bidding has started and will end on Thu Jan 29 2026 09:56:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-28 01:56:00'),
(535, 28, NULL, 'auction_end', NULL, NULL, '⏰ Auction \"44444\" ends in 10 minutes! Current bid: ₱1200.00. (Ends: Jan 28, 10:17 AM)', 1, '2026-01-28 02:07:00'),
(536, 34, NULL, 'auction_end', NULL, NULL, '⏰ Your auction \"44444\" ends in 10 minutes! Current highest bid: ₱1200.00.', 1, '2026-01-28 02:07:00'),
(537, 34, NULL, 'auction_win', NULL, NULL, 'Your auction \"44444\" has ended. Highest bidder: @dadarkXYZ44555 with ₱1200.00. Check your auctions.', 1, '2026-01-28 02:17:00'),
(538, 28, NULL, 'auction_win', NULL, NULL, 'You won the auction \"44444\" with ₱1200.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-28 02:17:00'),
(539, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"6677\" has ended. Highest bidder: @xQcWOWers with ₱400.00. Check your auctions.', 1, '2026-01-29 07:36:00'),
(540, 34, NULL, 'auction_win', NULL, NULL, 'You won the auction \"6677\" with ₱400.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-29 07:36:00'),
(541, 28, NULL, NULL, NULL, NULL, 'Your auction \"projecttest1\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-29 23:33:11'),
(542, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"projecttest1\" has been recorded. Waiting for admin approval.', 1, '2026-01-29 23:33:14'),
(543, 28, NULL, NULL, NULL, NULL, 'Your auction \"projecttest1\" status has been updated to \"approved\".', 1, '2026-01-29 23:33:35'),
(544, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"projecttest1\" is now LIVE! The bidding has started and will end on Fri Jan 30 2026 08:05:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-29 23:35:00'),
(545, 34, NULL, 'auction_end', NULL, NULL, '⏰ Auction \"projecttest1\" ends in 10 minutes! Current bid: ₱200.00. (Ends: Jan 30, 08:05 AM)', 1, '2026-01-29 23:55:00'),
(546, 28, NULL, 'auction_end', NULL, NULL, '⏰ Your auction \"projecttest1\" ends in 10 minutes! Current highest bid: ₱200.00.', 1, '2026-01-29 23:55:00'),
(547, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"projecttest1\" has ended. Highest bidder: @xQcWOWers with ₱200.00. Check your auctions.', 1, '2026-01-30 00:05:00'),
(548, 34, NULL, 'auction_win', NULL, NULL, 'You won the auction \"projecttest1\" with ₱200.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-30 00:05:00'),
(549, 34, NULL, NULL, NULL, NULL, 'Your auction \"XQCwow\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-30 00:18:22'),
(550, 34, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"XQCwow\" has been recorded. Waiting for admin approval.', 1, '2026-01-30 00:18:28'),
(551, 34, NULL, NULL, NULL, NULL, 'Your auction \"XQCwow\" status has been updated to \"approved\".', 1, '2026-01-30 00:18:36'),
(552, 34, NULL, 'auction_start', NULL, NULL, '???? Your auction \"XQCwow\" is now LIVE! The bidding has started and will end on Fri Jan 30 2026 08:31:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-30 00:21:00'),
(553, 28, NULL, NULL, NULL, NULL, 'Your auction \"PORTFOLIOAUCTTEST\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-30 00:23:16'),
(554, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"PORTFOLIOAUCTTEST\" has been recorded. Waiting for admin approval.', 1, '2026-01-30 00:23:19'),
(555, 28, NULL, NULL, NULL, NULL, 'Your auction \"PORTFOLIOAUCTTEST\" status has been updated to \"approved\".', 1, '2026-01-30 00:23:23'),
(556, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"PORTFOLIOAUCTTEST\" is now LIVE! The bidding has started and will end on Fri Jan 30 2026 08:35:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-30 00:25:00'),
(557, 34, NULL, 'auction_end', NULL, NULL, 'Your auction \"XQCwow\" has ended with no bids placed.', 1, '2026-01-30 00:31:00'),
(558, 28, NULL, NULL, NULL, NULL, 'Your auction \"PORTAUCTTEST2\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-30 00:34:40'),
(559, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"PORTAUCTTEST2\" has been recorded. Waiting for admin approval.', 1, '2026-01-30 00:34:42'),
(560, 28, NULL, 'auction_end', NULL, NULL, 'Your auction \"PORTFOLIOAUCTTEST\" has ended with no bids placed.', 1, '2026-01-30 00:35:00'),
(561, 28, NULL, NULL, NULL, NULL, 'Your auction \"PORTAUCTTEST2\" status has been updated to \"approved\".', 1, '2026-01-30 00:35:38'),
(562, 34, NULL, 'auction_start', NULL, NULL, '⏰ Auction \"PORTAUCTTEST2\" is starting NOW!', 1, '2026-01-30 00:36:00'),
(563, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"PORTAUCTTEST2\" is now LIVE! The bidding has started and will end on Fri Jan 30 2026 08:47:00 GMT+0800 (Philippine Standard Time).', 1, '2026-01-30 00:37:00'),
(564, 28, NULL, 'auction_win', NULL, NULL, 'Your auction \"PORTAUCTTEST2\" has ended. Highest bidder: @xQcWOWers with ₱200.00. Check your auctions.', 1, '2026-01-30 00:47:00'),
(565, 34, NULL, 'auction_win', NULL, NULL, 'You won the auction \"PORTAUCTTEST2\" with ₱200.00. Check your Auction Wins section to proceed with payment.', 1, '2026-01-30 00:47:00'),
(566, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"PORTAUCTTEST2\" has been uploaded successfully. Please wait for Illura to verify.', 1, '2026-01-30 01:54:39'),
(567, 28, NULL, NULL, NULL, NULL, 'Payment receipt for your auction \"PORTAUCTTEST2\" has been verified by Illura. Please ship the item to the buyer.', 1, '2026-01-30 01:55:00'),
(568, 34, NULL, NULL, NULL, NULL, 'Your payment receipt for \"PORTAUCTTEST2\" has been verified! The seller will now ship your item.', 1, '2026-01-30 01:55:00'),
(569, 28, NULL, NULL, NULL, NULL, 'The buyer has confirmed receiving \"PORTAUCTTEST2\". Payment will be released to you shortly.', 1, '2026-01-30 01:55:10'),
(570, 28, NULL, NULL, NULL, NULL, 'Payment of ₱200 for your auction \"PORTAUCTTEST2\" has been released. Check your sold auctions for the receipt.', 1, '2026-01-30 01:55:22'),
(571, 34, NULL, NULL, NULL, NULL, 'Transaction completed for \"PORTAUCTTEST2\". Thank you for using Illura!', 1, '2026-01-30 01:55:22'),
(572, 28, NULL, NULL, NULL, NULL, 'Your auction \"34343434\" is created. Please pay ₱100 to submit it for approval. Check your auctions to proceed with payment.', 1, '2026-01-30 02:08:56'),
(573, 28, NULL, NULL, NULL, NULL, 'Your ₱100 payment for auction \"34343434\" has been recorded. Waiting for admin approval.', 1, '2026-01-30 02:08:57'),
(574, 28, NULL, NULL, NULL, NULL, 'Your auction \"34343434\" status has been updated to \"approved\".', 1, '2026-01-30 02:09:04'),
(575, 28, NULL, 'auction_start', NULL, NULL, '???? Your auction \"34343434\" is now LIVE! The bidding has started and will end on Fri Jan 30 2026 10:15:59 GMT+0800 (Philippine Standard Time).', 1, '2026-01-30 02:11:00');

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
(16, 1, 28, 100.00, 'gcash', 'pending', '2026-01-23 22:01:51', '2026-01-23 14:01:51', '2026-01-23 14:01:51'),
(17, 2, 28, 100.00, 'gcash', 'pending', '2026-01-24 12:52:14', '2026-01-24 04:52:14', '2026-01-24 04:52:14'),
(18, 3, 34, 100.00, 'gcash', 'pending', '2026-01-24 17:25:43', '2026-01-24 09:25:43', '2026-01-24 09:25:43'),
(19, 4, 28, 100.00, 'gcash', 'pending', '2026-01-28 09:31:07', '2026-01-28 01:31:07', '2026-01-28 01:31:07'),
(20, 5, 34, 100.00, 'gcash', 'pending', '2026-01-28 09:46:04', '2026-01-28 01:46:04', '2026-01-28 01:46:04'),
(21, 6, 28, 100.00, 'gcash', 'pending', '2026-01-28 09:54:51', '2026-01-28 01:54:51', '2026-01-28 01:54:51'),
(22, 7, 28, 100.00, 'gcash', 'pending', '2026-01-30 07:33:14', '2026-01-29 23:33:14', '2026-01-29 23:33:14'),
(23, 13, 34, 100.00, 'gcash', 'pending', '2026-01-30 08:18:27', '2026-01-30 00:18:27', '2026-01-30 00:18:27'),
(24, 14, 28, 100.00, 'gcash', 'pending', '2026-01-30 08:23:18', '2026-01-30 00:23:18', '2026-01-30 00:23:18'),
(25, 15, 28, 100.00, 'gcash', 'pending', '2026-01-30 08:34:42', '2026-01-30 00:34:42', '2026-01-30 00:34:42'),
(26, 16, 28, 100.00, 'gcash', 'pending', '2026-01-30 10:08:57', '2026-01-30 02:08:57', '2026-01-30 02:08:57');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_sold` tinyint(1) DEFAULT 0,
  `auction_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `portfolio_items`
--

INSERT INTO `portfolio_items` (`id`, `user_id`, `title`, `description`, `image_path`, `created_at`, `updated_at`, `is_sold`, `auction_id`) VALUES
(38, 28, 'projecttest1', 'descrrrr', '3e995b138c23a539a40de3f865cbf62a', '2026-01-14 09:57:54', '2026-01-14 09:57:54', 0, NULL),
(39, 45, 'Painting', 'Painting', '09c3263928a013ff2016123bcd071411', '2026-01-24 09:33:47', '2026-01-24 09:33:47', 0, NULL),
(40, 34, 'XQCwow', 'descrption', 'b9039298a3df303a098d99841a6ac2bb', '2026-01-28 02:49:20', '2026-01-30 00:18:22', 0, 13),
(41, 28, 'PORTFOLIOAUCTTEST', 'UUUUUU', '0ab838fdd1f51d3cc4d3bd5a8241698e', '2026-01-30 00:22:50', '2026-01-30 00:23:16', 0, 14),
(42, 28, 'PORTAUCTTEST2', 'fgfgfgfgfgfg', 'd71271fc18a492ef07f386b90f9062bf', '2026-01-30 00:26:16', '2026-01-30 00:47:00', 1, 15);

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
(48, 28, 'rrrrrrr', '9a3b9148ebaf8b90956e0ccfac153a3b', '2026-01-19 14:11:48', '2026-01-24 05:09:05', 'active', 'friends'),
(49, 34, 'post tralalero tralala crocadilololeliro', '10d098cd60c58c54f403ab76e713d2bc', '2026-01-24 05:41:45', '2026-01-24 05:41:45', 'active', 'friends');

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
(7, 34, 'artwork', NULL, 53, NULL, 28, 'misleading', 'dddd', 'dismissed', 'yyyyy', 'none', 7, '2026-01-14 09:45:08', '2026-01-14 09:44:51'),
(8, 34, 'artwork', NULL, 56, NULL, 28, 'intellectual_property', 'description', 'action_taken', 'aeqd', 'user_warned', 7, '2026-01-24 09:50:12', '2026-01-24 09:48:35');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `rating`, `review_text`, `created_at`) VALUES
(1, 28, 5, 'Illura is nice! A nice starting place for small artists in the Philippines. Giving opportunities to small artists to grow!', '2026-01-24 06:56:14'),
(2, 44, 4, 'Just created my account, and so far, it\'s not bad. Most artists are from the Philippines. Artists that you haven\'t heard about yet, trying to grow and connect to other fellow filipino artists.', '2026-01-24 06:59:47'),
(3, 34, 4, 'A nice social platform for beginners! A nice start for artists who wants to sell their artworks!', '2026-01-24 07:02:23');

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
(12, 'tag3', '2026-01-14 08:27:09'),
(13, 'digital', '2026-01-24 04:59:36'),
(14, 'art', '2026-01-24 04:59:36'),
(15, 'wallpaper', '2026-01-24 04:59:36'),
(16, 'lasttwo', '2026-01-24 08:28:32'),
(17, 'popart', '2026-01-24 08:43:36'),
(18, 'lol', '2026-01-24 08:43:36'),
(19, 'fyp', '2026-01-24 08:43:36');

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
(28, 'dadarkXYZ44555', 'asd@gmail.com', '$2b$10$ph27ZwaqpvGpgL4qvr6Lre28AUghCdmNDkfZbO/.uKxItLkXfs8YS', 'Dark dark', 49, 'kbkbkkj', '2025-06-05', '1764348319943-barcode-1.jpg', '1764353861430-pepelaugh.png', '1764353883867-Paper_texture_3.jpg', 'active', 'closed', '2025-06-01 16:06:58', '2026-01-24 09:49:08', 1, 'https://www.youtube.com/', 'https://web.facebook.com/ralf.matthew.martinez', 'https://web.facebook.com/ralf.matthew.martinez', '09123451239'),
(34, 'xQcWOWers', 'qwerty@gmail.com', '$2b$10$rRDYKbXVUL1fWJ4ACmzFGu6A./O1FfsCIWQqMmFDMq0ZzLMh9U/ze', 'Felix Nguyan', 40, 'gamba streams', '2025-06-04', '1764639148067-rocky-shore-full-moon.jpg', '1760196515185-illura_2.png', '1760980827279-trytry.jpg', 'active', 'closed', '2025-06-01 16:23:36', '2026-01-24 05:05:29', 1, 'https://www.instagram.com/lasmeratzi/', 'https://www.instagram.com/lasmeratzi/', 'https://www.facebook.com/', '09123994867'),
(35, 'slytherinz', 'zxc@gmail.com', '$2b$10$nQDj54OV1//a2tOqzUUF1efVMKuxzCXnU4uDYhN0i9fZz4j77a2P.', 'Severus Spane', 49, 'zxzx', '2025-06-05', '1749738686711-suit1.png', '1769233401146-Qwen.png', '1764903383348-chill.jpg', 'active', 'closed', '2025-06-03 17:17:20', '2026-01-24 05:43:21', 1, 'https://chat.deepseek.com/a/chat/s/51645327-75d0-4e93-951d-00a8f87bc9ce', 'https://chat.deepseek.com/a/chat/s/51645327-75d0-4e93-951d-00a8f87bc9ce', 'https://chat.deepseek.com/a/chat/s/51645327-75d0-4e93-951d-00a8f87bc9ce', NULL),
(36, 'lowkeylokilang', 'xcv@gmail.com', '$2b$10$hgEKp0ebG3wvSBvQayG3ve29/u5jmQ9sk.ntoUbpgPdV0hC/cUwei', 'Loki Odinson', NULL, 'gogog', '2025-06-09', '1bb32ca017a833b2be5a727f4bfde04b', NULL, NULL, 'active', 'closed', '2025-06-08 14:30:37', '2026-01-24 04:37:08', 0, NULL, NULL, NULL, NULL),
(37, 'jimjoe', 'poi@gmail.com', '$2b$10$DnSSnZPQ5Ya9A2ZNRdarROh4gbO7XyWKKEOK6AdBF/RLxWoWOjL7W', 'Jim Jom', NULL, NULL, '2025-06-01', 'f9fb8290101fae7e86fc2c67d3d54423', NULL, NULL, 'active', 'closed', '2025-06-11 15:13:14', '2026-01-24 05:39:45', 1, 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', NULL),
(38, 'dodngslm', 'qwe@gmail.com', '$2b$10$4gG0r/B67gB6dvSrZKhl9OpFy1g0.7V9D9jePwff.OOiZzccHCZuu', 'Dodong Dodoo', NULL, '141 ra gud', '2025-06-11', '1f2931932ed4a6ccfa0131db4629826f', NULL, NULL, 'active', 'closed', '2025-06-12 03:24:33', '2025-06-12 03:25:53', 0, NULL, NULL, NULL, NULL),
(39, 'silverlilly', 'alex@gmail.com', '$2b$10$PIiZ1RBOHpWrHnbLKV1F..QsnyPt0IaV1XXCjfhrhZe6AS/u7TPW.', 'Alexandra Burningham', 40, '', '2000-07-19', '35eb49d231f325cda954df3755435bcf', '1761015655867-alex.png', '1761031625671-Screenshot_2024-07-18_205725.jpg', 'active', 'closed', '2025-06-13 08:01:00', '2025-10-21 07:27:05', 1, 'https://www.youtube.com/watch?v=j23SO29LNWE', 'https://www.youtube.com/watch?v=j23SO29LNWE', 'https://www.youtube.com/watch?v=j23SO29LNWE', NULL),
(40, 'johndoe123', 'email@gmail.com', '$2b$10$LQhCW42G2r8rNi/yiPeJ/eZAtyCAzM0TzYfVR5NCg2oIH1RMpG9km', 'John Doe', NULL, 'gfxbcjvmhv', '2025-06-11', '64844cb6f5a983635b8c95a9805843c7', NULL, NULL, 'active', 'open', '2025-06-14 06:30:56', '2025-06-14 07:18:18', 1, 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', NULL),
(41, 'john123', 'vbnm@gmail.com', '$2b$10$0rZ4rKwB3lQwRTSHmGoqiOUY3jVQB6xc0bvTKjtiKGsuPO8Endf2W', 'John Doe', NULL, 'sdvdcv dvd', '2025-08-29', '1755677083737-mechak6.jpg', NULL, NULL, 'active', 'closed', '2025-08-20 08:03:54', '2025-08-20 08:04:43', 0, NULL, NULL, NULL, NULL),
(42, 'peterpark', 'bbb@gmail.com', '$2b$10$cSYwyjNLqrS6.7fjG63uzukvfsUKcsu12qAdoLnsZQc5Hl1Busmmy', 'Peter Parker', NULL, NULL, '2003-12-12', 'f3d6a58e2f5a584b17633c39618afe14', NULL, NULL, 'active', 'closed', '2025-12-12 14:29:25', '2025-12-12 14:29:25', 0, NULL, NULL, NULL, NULL),
(43, 'user123', 'fgh@gmail.com', '$2b$10$ZeljjWLD.K9K8YPmC5AUH..AacSATKr3Ut1P5/vW6g.4IEvo7CAKW', 'Diao Diao', NULL, NULL, '2003-12-13', '67d241cceb99d09458f63b05a406bd16', NULL, NULL, 'active', 'closed', '2025-12-13 09:48:41', '2025-12-13 09:50:36', 1, 'http://localhost:5173/verifyprofile', 'http://localhost:5173/verifyprofile', 'http://localhost:5173/verifyprofile', NULL),
(44, 'zzzworrior', 'zzz@gmail.com', '$2b$10$6IQjikXGF60yJlqy6BZqVOp/F8D1zwmcOXDaaREUmrynQMzlOZJ.y', 'adawdawd', NULL, NULL, '2004-07-24', 'c9591af4fb768446ca8ef727e99618f8', NULL, NULL, 'active', 'closed', '2026-01-23 17:03:31', '2026-01-24 08:09:45', 1, 'http://localhost:5173/profile', 'http://localhost:5173/profile', 'http://localhost:5173/profile', NULL),
(45, 'kingmen', 'yyy@gmail.com', '$2b$10$U9/DEEfY2CEdSMwEgSxEXOIX5mBgE2ortfqBFchUF.AOlQnp83yXq', 'Skuda Dor', NULL, NULL, '1999-05-04', 'a6cabc61e3ff8236b4897221d04b54d7', NULL, NULL, 'active', 'closed', '2026-01-24 08:12:37', '2026-01-24 08:12:37', 0, NULL, NULL, NULL, NULL),
(46, 'usernamefinaldef', 'emailtest123@gmail.com', '$2b$10$4bj2LG9D8V.tEt34827Yu.KuAM0cJLyn1ZEpukV15yHHkMmuHDCqq', 'Harry Potter', NULL, NULL, '2017-02-01', '328d49e0987e68a20f3f041c16fbe9a5', NULL, NULL, 'active', 'closed', '2026-01-24 09:20:03', '2026-01-24 09:20:03', 0, NULL, NULL, NULL, NULL);

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
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `fk_auctions_portfolio_item` (`portfolio_item_id`);

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
-- Indexes for table `auction_reminders`
--
ALTER TABLE `auction_reminders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_auction` (`user_id`,`auction_id`),
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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_portfolio_auction` (`auction_id`);

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
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `artwork_media`
--
ALTER TABLE `artwork_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `artwork_posts`
--
ALTER TABLE `artwork_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `artwork_post_likes`
--
ALTER TABLE `artwork_post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `artwork_tags`
--
ALTER TABLE `artwork_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `auction_bids`
--
ALTER TABLE `auction_bids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `auction_media`
--
ALTER TABLE `auction_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `auction_reminders`
--
ALTER TABLE `auction_reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `auto_replies`
--
ALTER TABLE `auto_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `escrow_releases`
--
ALTER TABLE `escrow_releases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=576;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

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
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `verification_requests`
--
ALTER TABLE `verification_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  ADD CONSTRAINT `fk_auctions_portfolio_item` FOREIGN KEY (`portfolio_item_id`) REFERENCES `portfolio_items` (`id`) ON DELETE SET NULL,
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
-- Constraints for table `auction_reminders`
--
ALTER TABLE `auction_reminders`
  ADD CONSTRAINT `auction_reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `auction_reminders_ibfk_2` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`);

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
  ADD CONSTRAINT `fk_portfolio_auction` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE SET NULL,
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
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
