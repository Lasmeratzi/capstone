-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 11:42 AM
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
  `role` enum('admin','super_admin') DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`, `role`) VALUES
(6, 'admin', '$2b$10$YYylHcdXoSIL1VIHVA3XTu0lk.EdAT1R4v/gL3ynBU.J9h79gUhhe', '2025-09-10 07:22:09', 'admin'),
(7, 'superadmin', '$2b$10$pdCLoSznVgA4WclA8FHdD.r831tE7LcOJIBAAdXyc0onjI9WIG1bi', '2025-09-10 07:22:09', 'super_admin');

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
(1, 28, 37, 'comment1', '2025-10-07 09:00:11'),
(2, 28, 27, 'test', '2025-10-07 09:59:53'),
(3, 28, 29, '123', '2025-10-07 10:23:14'),
(4, 28, 46, 'test', '2025-10-16 09:28:26'),
(5, 28, 46, 'aaa', '2025-10-16 16:43:56'),
(6, 28, 46, 'qweqw', '2025-10-16 16:57:00'),
(7, 34, 45, 'testcommentoct17', '2025-10-17 09:40:43');

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
(16, 25, '1749052030959-chill.jpg'),
(17, 25, '1749052030963-flw.jpg'),
(19, 27, '1749683946198-kda2.jpeg'),
(20, 27, '1749683946214-kdaBG.jpeg'),
(24, 29, '1749702465756-0530m9hgk1s41.jpg'),
(25, 29, '1749702465762-albularyos.jpg'),
(26, 29, '1749702465779-chill.jpg'),
(27, 29, '1749702465785-clem-onojeghuo-XW-Z9L930CY-unsplash.jpg'),
(28, 29, '1749702465791-django.jpg'),
(65, 37, '1759562158911-suit1safe.png'),
(66, 37, '1759562158911-wave.png'),
(78, 39, '1759853372824-oct.jpg'),
(79, 39, '1759853372830-realdimens.gif'),
(86, 46, 'watermarked-1760196546536-2nd sem SCHED.png'),
(87, 46, 'watermarked-1760196546537-2ndYEAR1stsemsched.jpg'),
(89, 45, 'watermarked-1760367384562-31258025_7573866.jpg'),
(90, 45, 'watermarked-1760367384572-codioful-formerly-gradienta-rKv4HduvzIE-unsplash.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `artwork_posts`
--

CREATE TABLE `artwork_posts` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artwork_posts`
--

INSERT INTO `artwork_posts` (`id`, `author_id`, `title`, `description`, `created_at`) VALUES
(25, 34, 'title', 'descripxc111', '2025-06-04 15:47:10'),
(27, 34, 'afafa', 'werwer', '2025-06-11 23:19:06'),
(29, 38, 'dfdg', 'dfgf', '2025-06-12 04:27:45'),
(37, 34, 'ffasdasdasd', '4444', '2025-10-04 06:18:07'),
(39, 28, 'oct7test44444', 'fghfghfg', '2025-10-07 10:08:35'),
(45, 28, 'zxczxczxc', 'yyyyyyy', '2025-10-11 14:45:30'),
(46, 34, 'test', 'test333', '2025-10-11 15:29:06');

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
(2, 37, 28, '2025-10-07 08:25:04'),
(3, 29, 28, '2025-10-07 10:23:20'),
(4, 37, 35, '2025-10-07 15:47:27'),
(6, 46, 28, '2025-10-16 09:28:21'),
(7, 45, 34, '2025-10-17 09:40:37');

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
(7, 46, 1, '2025-10-13 15:14:55'),
(8, 46, 2, '2025-10-13 15:14:55'),
(9, 46, 3, '2025-10-13 15:14:55'),
(17, 45, 3, '2025-10-16 17:00:26'),
(18, 45, 1, '2025-10-16 17:00:26');

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
  `end_time` datetime NOT NULL,
  `status` enum('pending','approved','active','ended','stopped','rejected') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` (`id`, `author_id`, `title`, `description`, `starting_price`, `current_price`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(32, 36, 'dfgdfg', 'wrewer', 1000.00, 1400.00, '2025-06-11 13:28:00', 'ended', '2025-06-11 05:26:19', '2025-06-11 05:28:00'),
(33, 36, 'testaya', 'ayades', 1000.00, 1400.00, '2025-06-11 15:17:00', 'ended', '2025-06-11 07:15:45', '2025-06-11 07:17:00'),
(34, 36, 'tetete', 'dfgdfg', 1000.00, 1400.00, '2025-06-11 15:52:00', 'ended', '2025-06-11 07:50:23', '2025-06-11 07:52:00'),
(35, 28, 'wefw', 'sdfsf', 1000.00, 1000.00, '2025-06-11 16:30:00', 'ended', '2025-06-11 08:28:05', '2025-06-11 08:30:00'),
(36, 36, 'Auction testt', 'description', 1000.00, 1800.00, '2025-06-11 20:10:00', 'ended', '2025-06-11 12:08:53', '2025-06-11 12:10:00'),
(37, 38, 'qweqwe', 'qweqwe', 1400.00, 10000.00, '2025-06-19 12:00:00', 'ended', '2025-06-12 04:48:37', '2025-08-05 05:52:00'),
(38, 40, 'Auction', 'Description', 2000.00, 2500.00, '2025-06-14 14:36:00', 'ended', '2025-06-14 06:34:58', '2025-06-14 06:36:00'),
(39, 28, 'asdasd', 'efvrfvf', 1000.00, 1000.00, '2025-08-20 16:01:00', 'pending', '2025-08-20 07:59:41', '2025-08-20 07:59:41'),
(40, 28, 'asdasdasdsa', 'vbvbvbvb', 1000.00, 1000.00, '2025-09-11 15:08:00', 'ended', '2025-09-11 07:07:06', '2025-09-11 07:08:00'),
(41, 34, 'qwdqwe', 'qweqwe', 1000.00, 2000.00, '2025-09-18 18:07:00', 'stopped', '2025-09-18 10:00:47', '2025-09-18 10:02:02');

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
(33, 32, 28, 1400.00, '2025-06-11 05:26:39'),
(34, 33, 28, 1400.00, '2025-06-11 07:16:09'),
(35, 34, 28, 1400.00, '2025-06-11 07:51:10'),
(36, 36, 34, 1800.00, '2025-06-11 12:09:34'),
(37, 37, 39, 5000.00, '2025-06-13 08:14:16'),
(38, 37, 39, 10000.00, '2025-06-13 08:14:29'),
(39, 38, 28, 2500.00, '2025-06-14 06:35:32'),
(40, 41, 28, 2000.00, '2025-09-18 10:01:31');

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
(30, 32, 'auctions/1749619579735-0530m9hgk1s41.jpg', '2025-06-11 05:26:19'),
(31, 33, 'auctions/1749626145523-1.png', '2025-06-11 07:15:45'),
(32, 34, 'auctions/1749628223359-chill.jpg', '2025-06-11 07:50:23'),
(33, 35, 'auctions/1749630485637-2nd sem SCHED.png', '2025-06-11 08:28:05'),
(34, 36, 'auctions/1749643733660-finaldimens.gif', '2025-06-11 12:08:54'),
(35, 37, 'auctions/1749703718038-albularyos.jpg', '2025-06-12 04:48:38'),
(36, 37, 'auctions/1749703718048-dirtblock.png', '2025-06-12 04:48:38'),
(37, 38, 'auctions/1749882898963-0ebbfd90d33893624f58f103037727af.jpg', '2025-06-14 06:34:58'),
(38, 39, 'auctions/1755676781617-chill.jpg', '2025-08-20 07:59:41'),
(39, 39, 'auctions/1755676781623-clem-onojeghuo-XW-Z9L930CY-unsplash.jpg', '2025-08-20 07:59:41'),
(40, 40, 'auctions/1757574426852-images.jpg', '2025-09-11 07:07:06'),
(41, 41, 'auctions/1758189647968-515439595_1268024798005997_3173417703994605885_n.jpg', '2025-09-18 10:00:48');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auto_replies`
--

INSERT INTO `auto_replies` (`id`, `user_id`, `portfolio_item_id`, `reply_text`, `created_at`, `updated_at`) VALUES
(1, 28, 29, '1000$', '2025-09-14 15:53:54', '2025-09-14 15:53:54'),
(2, 34, 34, '300$', '2025-09-16 06:41:59', '2025-09-16 06:41:59'),
(3, 34, 35, '600', '2025-09-16 06:46:10', '2025-09-16 06:46:10'),
(4, 28, 36, '200', '2025-09-16 06:47:57', '2025-09-16 06:47:57'),
(5, 40, 32, '400', '2025-09-18 10:04:35', '2025-09-18 10:04:35');

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
(16, 34, 38, 'comment test', '2025-06-01 16:26:09'),
(17, 28, 38, 'commenttoo', '2025-06-01 16:26:41'),
(18, 35, 39, 'comment', '2025-06-08 07:25:24'),
(19, 28, 39, 'commetn lang', '2025-06-08 16:14:09'),
(20, 34, 39, 'comment pag may time', '2025-06-08 16:35:04'),
(21, 36, 39, 'commentnew', '2025-06-12 17:01:02'),
(22, 37, 39, 'postcomment', '2025-06-13 06:02:32'),
(23, 39, 39, 'comment', '2025-06-13 08:07:14'),
(24, 40, 39, 'cmoments', '2025-06-14 06:33:49'),
(25, 40, 42, 'afdsfd', '2025-06-14 07:13:29'),
(26, 28, 42, 'hi it\'s me', '2025-08-05 06:02:24'),
(27, 28, 38, 'comment', '2025-08-20 07:57:56'),
(28, 28, 39, 'asdasdsa', '2025-09-11 07:01:46'),
(29, 28, 38, 'adasd', '2025-09-16 06:49:39'),
(30, 28, 39, 'xcvcbcx', '2025-09-18 09:57:20'),
(34, 28, 42, 'asd', '2025-09-20 03:44:14'),
(35, 28, 42, '213', '2025-10-07 09:51:22');

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
(3, 28, 34, '2025-06-12 21:06:35'),
(8, 36, 34, '2025-06-12 22:22:11'),
(12, 37, 28, '2025-06-13 13:51:41'),
(13, 28, 39, '2025-06-13 16:05:50'),
(14, 39, 34, '2025-06-14 11:53:02'),
(15, 39, 28, '2025-06-14 11:53:07'),
(16, 39, 38, '2025-06-14 11:53:24'),
(17, 40, 28, '2025-06-14 14:34:14'),
(18, 40, 34, '2025-06-14 14:41:15'),
(19, 28, 35, '2025-08-20 15:58:27'),
(20, 35, 40, '2025-09-09 15:34:26'),
(22, 34, 28, '2025-09-15 00:10:47'),
(23, 28, 40, '2025-09-18 18:05:11');

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
(10, 28, 39, NULL, 'hello', 1, '2025-09-09 07:43:12'),
(11, 28, 39, NULL, 'alex123', 1, '2025-09-09 07:44:47'),
(12, 39, 28, NULL, 'yes yes yes', 1, '2025-09-09 07:47:36'),
(57, 34, 28, NULL, 'sdvsv', 1, '2025-09-16 06:58:26'),
(58, 28, 39, NULL, 'kaon kana lex?', 1, '2025-09-18 09:57:42'),
(59, 28, 34, NULL, 'dasdasd', 1, '2025-09-18 09:58:47'),
(60, 28, 40, 32, 'Hi, I’m interested in this portfolio item!', 1, '2025-09-18 10:04:56'),
(61, 40, 28, 32, '400', 1, '2025-09-18 10:04:56'),
(62, 28, 40, 32, 'Hi, I’m interested in this portfolio item!', 1, '2025-09-18 10:05:15'),
(63, 40, 28, 32, '400', 1, '2025-09-18 10:05:15'),
(64, 34, 28, NULL, 'test lang bai', 1, '2025-10-17 09:41:50');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(59, 28, 'You won the auction \"dfgdfg\" with ₱1400.00. Congratulations!', 1, '2025-06-11 05:28:00'),
(64, 28, 'You won the auction \"testaya\" with ₱1400.00. Congratulations!', 1, '2025-06-11 07:17:00'),
(69, 28, 'You won the auction \"tetete\" with ₱1400.00. Congratulations!', 1, '2025-06-11 07:52:00'),
(70, 28, 'Your auction \"wefw\" has been created and is pending approval.', 1, '2025-06-11 08:28:05'),
(71, 28, 'Your auction \"wefw\" status has been updated to \"approved\".', 1, '2025-06-11 08:28:30'),
(72, 28, 'Your auction \"wefw\" status has been updated to \"active\".', 1, '2025-06-11 08:28:42'),
(73, 28, 'Your auction \"wefw\" has ended with no bids placed.', 1, '2025-06-11 08:30:00'),
(74, 36, 'Your auction \"Auction testt\" has been created and is pending approval.', 1, '2025-06-11 12:08:53'),
(75, 36, 'Your auction \"Auction testt\" status has been updated to \"approved\".', 1, '2025-06-11 12:09:02'),
(76, 36, 'Your auction \"Auction testt\" status has been updated to \"active\".', 1, '2025-06-11 12:09:06'),
(77, 36, 'Your auction \"Auction testt\" has ended. Highest bidder: @xqcccc with ₱1800.00.', 1, '2025-06-11 12:10:00'),
(78, 34, 'You won the auction \"Auction testt\" with ₱1800.00. Congratulations!', 1, '2025-06-11 12:10:00'),
(79, 38, 'Your auction \"qweqwe\" has been created and is pending approval.', 1, '2025-06-12 04:48:38'),
(80, 38, 'Your auction \"qweqwe\" status has been updated to \"approved\".', 1, '2025-06-12 04:49:07'),
(81, 28, 'xQcWOWers followed you', 1, '2025-06-12 13:00:25'),
(82, 34, 'dadarkDDD followed you', 1, '2025-06-12 13:06:35'),
(83, 34, 'lowkeylokilang followed you', 1, '2025-06-12 13:30:23'),
(84, 34, 'lowkeylokilang followed you', 1, '2025-06-12 14:03:17'),
(85, 34, 'lowkeylokilang followed you', 1, '2025-06-12 14:22:11'),
(86, 35, 'xQcWOWers followed you', 1, '2025-06-12 14:27:04'),
(87, 34, 'Someone liked your post: \"adadadad\"', 1, '2025-06-12 18:08:45'),
(89, 28, 'lowkeylokilang liked your post', 1, '2025-06-12 18:58:38'),
(94, 28, 'jimjoe liked your post', 1, '2025-06-13 05:37:32'),
(95, 36, 'dadarkDDD followed you', 1, '2025-06-13 05:38:36'),
(96, 28, 'jimjoe liked your post', 1, '2025-06-13 05:51:29'),
(97, 28, 'jimjoe followed you', 1, '2025-06-13 05:51:41'),
(98, 39, 'dadarkDDD followed you', 1, '2025-06-13 08:05:50'),
(99, 28, 'silverlilly liked your post', 1, '2025-06-13 08:09:12'),
(100, 38, 'Your auction \"qweqwe\" status has been updated to \"active\".', 1, '2025-06-13 08:14:03'),
(101, 34, 'silverlilly followed you', 1, '2025-06-14 03:53:02'),
(102, 28, 'silverlilly followed you', 1, '2025-06-14 03:53:07'),
(103, 38, 'silverlilly followed you', 0, '2025-06-14 03:53:24'),
(104, 28, 'lowkeylokilang liked your post', 1, '2025-06-14 04:52:19'),
(105, 28, 'johndoe liked your post', 1, '2025-06-14 06:33:50'),
(106, 28, 'johndoe followed you', 1, '2025-06-14 06:34:14'),
(107, 40, 'Your auction \"Auction\" has been created and is pending approval.', 1, '2025-06-14 06:34:58'),
(108, 40, 'Your auction \"Auction\" status has been updated to \"approved\".', 1, '2025-06-14 06:35:08'),
(109, 40, 'Your auction \"Auction\" status has been updated to \"active\".', 1, '2025-06-14 06:35:11'),
(110, 40, 'Your auction \"Auction\" has ended. Highest bidder: @dadarkDDD with ₱2500.00.', 1, '2025-06-14 06:36:00'),
(111, 28, 'You won the auction \"Auction\" with ₱2500.00. Congratulations!', 1, '2025-06-14 06:36:00'),
(112, 34, 'johndoe followed you', 1, '2025-06-14 06:41:15'),
(114, 40, 'lowkeylokilang liked your post', 1, '2025-06-14 07:13:39'),
(115, 38, 'Your auction \"qweqwe\" has ended. Highest bidder: @silverlilly with ₱10000.00.', 0, '2025-08-05 05:52:00'),
(116, 39, 'You won the auction \"qweqwe\" with ₱10000.00. Congratulations!', 1, '2025-08-05 05:52:00'),
(117, 40, 'dadarkDDD liked your post', 1, '2025-08-05 05:53:12'),
(118, 28, 'slytherinz liked your post', 1, '2025-08-14 06:28:53'),
(119, 34, 'dadarkXYZ123 liked your post', 1, '2025-08-20 07:57:46'),
(120, 35, 'dadarkXYZ123 followed you', 1, '2025-08-20 07:58:27'),
(121, 28, 'Your auction \"asdasd\" has been created and is pending approval.', 1, '2025-08-20 07:59:41'),
(122, 40, 'slytherinz followed you', 1, '2025-09-09 07:34:26'),
(123, 28, 'dadarkXYZ123 liked your post', 1, '2025-09-11 07:01:41'),
(124, 28, 'Your auction \"asdasdasdsa\" has been created and is pending approval.', 1, '2025-09-11 07:07:06'),
(125, 28, 'Your auction \"asdasdasdsa\" status has been updated to \"approved\".', 1, '2025-09-11 07:07:35'),
(126, 28, 'Your auction \"asdasdasdsa\" status has been updated to \"active\".', 1, '2025-09-11 07:07:40'),
(127, 28, 'Your auction \"asdasdasdsa\" has ended with no bids placed.', 1, '2025-09-11 07:08:00'),
(128, 28, 'xQcWOWers followed you', 1, '2025-09-14 16:10:44'),
(129, 28, 'xQcWOWers followed you', 1, '2025-09-14 16:10:47'),
(130, 34, 'Your auction \"qwdqwe\" has been created and is pending approval.', 1, '2025-09-18 10:00:47'),
(131, 34, 'Your auction \"qwdqwe\" status has been updated to \"approved\".', 1, '2025-09-18 10:01:15'),
(132, 34, 'Your auction \"qwdqwe\" status has been updated to \"active\".', 1, '2025-09-18 10:01:18'),
(133, 34, 'Your auction \"qwdqwe\" status has been updated to \"stopped\".', 1, '2025-09-18 10:02:02'),
(134, 40, 'xQcWOWers liked your post', 1, '2025-09-18 10:03:34'),
(135, 40, 'dadarkXYZ123 followed you', 1, '2025-09-18 10:05:11'),
(136, 40, 'dadarkXYZ123 liked your post', 1, '2025-09-20 03:42:03'),
(137, 34, 'xQcWOWers liked your post', 1, '2025-10-01 14:16:53'),
(138, 34, 'xQcWOWers liked your post', 1, '2025-10-01 14:36:59'),
(139, 34, 'xQcWOWers liked your post', 1, '2025-10-01 14:37:01'),
(140, 34, 'dadarkXYZ123 liked your post', 1, '2025-10-01 14:40:42'),
(141, 34, 'dadarkXYZ123 liked your artwork', 1, '2025-10-07 07:59:15'),
(142, 34, 'dadarkXYZ123 liked your artwork', 1, '2025-10-07 08:25:04'),
(143, 38, 'dadarkXYZ123 liked your artwork', 0, '2025-10-07 10:23:20'),
(144, 34, 'slytherinz liked your artwork', 1, '2025-10-07 15:47:27'),
(145, 28, 'dadarkXYZ123 liked your artwork', 1, '2025-10-13 15:05:59'),
(146, 34, 'dadarkXYZ123 liked your artwork', 1, '2025-10-16 09:28:21'),
(147, 28, 'xQcWOWers liked your artwork', 1, '2025-10-17 09:40:37');

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
(29, 28, 'crystals', 'Ray of hopes123456', '489b2fcd80c584ca129d1059b0dcdf98', '2025-06-01 16:27:19', '2025-09-14 15:41:24'),
(30, 34, 'Portfolio', 'aaa', '42c3f05eef18dc5d33314c2e3685ff71', '2025-06-02 04:32:08', '2025-06-02 04:32:08'),
(31, 39, 'Portfolio 1', 'First Project', 'e1f0eba9770be3be8fce3f3550ef0bce', '2025-06-13 08:12:14', '2025-06-13 08:12:14'),
(32, 40, 'POrtfolio Item', 'adas', '3d07397a2964e94d733425ae9cb537be', '2025-06-14 06:32:33', '2025-06-14 06:32:33'),
(33, 28, 'test', 'zxczczxczxc', '92fb5cd1ba6b0fdfc255e2c3e171ea04', '2025-09-14 15:41:47', '2025-09-14 15:41:47'),
(34, 34, 'Portofolo', 'qwertyasdfgh', '11ff565938d0d15aa984437fc7b53a3b', '2025-09-16 06:41:44', '2025-09-16 06:41:44'),
(35, 34, 'TitlPORTO', 'desczczx', '666a99536ccde0545872239a14bd8631', '2025-09-16 06:46:01', '2025-09-16 06:46:01'),
(36, 28, 'ZXC', 'asdadas', '697cef5aeb12f1148e433a7cdeb1a428', '2025-09-16 06:47:50', '2025-09-16 06:47:50');

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
  `post_status` enum('active','down') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `title`, `media_path`, `created_at`, `updated_at`, `post_status`) VALUES
(38, 34, 'sept30edited', '2026da0f53159f06ec83082bac9919fc', '2025-06-01 16:25:58', '2025-09-30 09:59:00', 'active'),
(39, 28, 'potspost', 'c3f6fcce3e45ac196d783827c92d05fb', '2025-06-06 15:49:13', '2025-06-14 04:15:11', 'active'),
(42, 40, 'adad', '9abffd17a302b07997be47f1dbf98c11', '2025-06-14 06:37:27', '2025-10-04 04:28:15', 'active'),
(44, 28, 'zxczc', '1c93457283d10699d83fa1ea3005cd76', '2025-10-04 05:07:38', '2025-10-13 15:31:03', 'active');

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
(16, 34, 39, '2025-06-12 18:46:34'),
(26, 37, 39, '2025-06-13 05:51:29'),
(27, 39, 39, '2025-06-13 08:09:12'),
(28, 36, 39, '2025-06-14 04:52:19'),
(30, 40, 39, '2025-06-14 07:03:56'),
(31, 36, 42, '2025-06-14 07:13:39'),
(33, 35, 39, '2025-08-14 06:28:53'),
(35, 28, 39, '2025-09-11 07:01:41'),
(36, 34, 42, '2025-09-18 10:03:34'),
(37, 28, 42, '2025-09-20 03:42:03'),
(41, 28, 38, '2025-10-01 14:40:42');

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
(1, 'digital', '2025-10-11 15:29:06'),
(2, 'traditional', '2025-10-11 15:29:06'),
(3, 'artwork', '2025-10-13 15:14:55');

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
  `account_status` enum('active','on hold','banned') DEFAULT 'active',
  `commissions` enum('open','closed') DEFAULT 'closed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified` tinyint(1) DEFAULT 0,
  `twitter_link` varchar(255) DEFAULT NULL,
  `instagram_link` varchar(255) DEFAULT NULL,
  `facebook_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `location_id`, `bio`, `birthdate`, `pfp`, `watermark_path`, `account_status`, `commissions`, `created_at`, `updated_at`, `verified`, `twitter_link`, `instagram_link`, `facebook_link`) VALUES
(28, 'dadarkXYZ123', 'asd@gmail.com', '$2b$10$ph27ZwaqpvGpgL4qvr6Lre28AUghCdmNDkfZbO/.uKxItLkXfs8YS', 'Dark dark', 40, 'to be testing', '2025-06-05', '1759384976806-mechak6.jpg', '1760030865405-Qwen.png', 'active', 'closed', '2025-06-01 16:06:58', '2025-10-17 09:39:49', 1, 'https://web.facebook.com/ralf.matthew.martinez', 'https://web.facebook.com/ralf.matthew.martinez', 'https://web.facebook.com/ralf.matthew.martinez'),
(34, 'xQcWOWers', 'qwerty@gmail.com', '$2b$10$rRDYKbXVUL1fWJ4ACmzFGu6A./O1FfsCIWQqMmFDMq0ZzLMh9U/ze', 'Felix Nguyan', NULL, 'GAMBA streams', '2025-06-04', '1749683009262-3d-mountain-landscape-with-moonlit-sky.jpg', '1760196515185-illura_2.png', 'active', 'closed', '2025-06-01 16:23:36', '2025-10-11 15:28:35', 1, 'https://www.instagram.com/lasmeratzi/', 'https://www.instagram.com/lasmeratzi/', 'https://www.instagram.com/lasmeratzi/'),
(35, 'slytherinz', 'zxc@gmail.com', '$2b$10$nQDj54OV1//a2tOqzUUF1efVMKuxzCXnU4uDYhN0i9fZz4j77a2P.', 'Severus Spane', NULL, 'zxzx', '2025-06-05', '1749738686711-suit1.png', NULL, 'active', 'closed', '2025-06-03 17:17:20', '2025-06-12 14:31:41', 0, NULL, NULL, NULL),
(36, 'lowkeylokilang', 'xcv@gmail.com', '$2b$10$hgEKp0ebG3wvSBvQayG3ve29/u5jmQ9sk.ntoUbpgPdV0hC/cUwei', 'Loki Odinson', NULL, 'gogog', '2025-06-09', '1bb32ca017a833b2be5a727f4bfde04b', NULL, 'active', 'closed', '2025-06-08 14:30:37', '2025-06-12 07:23:31', 0, NULL, NULL, NULL),
(37, 'jimjoe', 'poi@gmail.com', '$2b$10$DnSSnZPQ5Ya9A2ZNRdarROh4gbO7XyWKKEOK6AdBF/RLxWoWOjL7W', 'Jim Jom', NULL, NULL, '2025-06-01', 'f9fb8290101fae7e86fc2c67d3d54423', NULL, 'active', 'closed', '2025-06-11 15:13:14', '2025-06-13 06:01:37', 1, 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile', 'https://www.twitch.tv/settings/profile'),
(38, 'dodngslm', 'qwe@gmail.com', '$2b$10$4gG0r/B67gB6dvSrZKhl9OpFy1g0.7V9D9jePwff.OOiZzccHCZuu', 'Dodong Dodoo', NULL, '141 ra gud', '2025-06-11', '1f2931932ed4a6ccfa0131db4629826f', NULL, 'active', 'closed', '2025-06-12 03:24:33', '2025-06-12 03:25:53', 0, NULL, NULL, NULL),
(39, 'silverlilly', 'alex@gmail.com', '$2b$10$PIiZ1RBOHpWrHnbLKV1F..QsnyPt0IaV1XXCjfhrhZe6AS/u7TPW.', 'Alexandra Burningham', NULL, NULL, '2000-07-19', '35eb49d231f325cda954df3755435bcf', NULL, 'active', 'closed', '2025-06-13 08:01:00', '2025-10-09 15:57:29', 1, 'https://www.youtube.com/watch?v=j23SO29LNWE', 'https://www.youtube.com/watch?v=j23SO29LNWE', 'https://www.youtube.com/watch?v=j23SO29LNWE'),
(40, 'johndoe123', 'email@gmail.com', '$2b$10$LQhCW42G2r8rNi/yiPeJ/eZAtyCAzM0TzYfVR5NCg2oIH1RMpG9km', 'John Doe', NULL, 'gfxbcjvmhv', '2025-06-11', '64844cb6f5a983635b8c95a9805843c7', NULL, 'active', 'open', '2025-06-14 06:30:56', '2025-06-14 07:18:18', 1, 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/'),
(41, 'john123', 'vbnm@gmail.com', '$2b$10$0rZ4rKwB3lQwRTSHmGoqiOUY3jVQB6xc0bvTKjtiKGsuPO8Endf2W', 'John Doe', NULL, 'sdvdcv dvd', '2025-08-29', '1755677083737-mechak6.jpg', NULL, 'active', 'closed', '2025-08-20 08:03:54', '2025-08-20 08:04:43', 0, NULL, NULL, NULL);

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
(11, 40, 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', 'approved', '2025-06-14 06:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `user_id`, `balance`, `created_at`, `updated_at`) VALUES
(1, 28, 0.00, '2025-06-08 14:15:38', '2025-06-08 14:15:38'),
(2, 35, 0.00, '2025-06-08 14:24:55', '2025-06-08 14:24:55'),
(3, 36, 0.00, '2025-06-08 14:30:54', '2025-06-08 14:30:54'),
(4, 34, 0.00, '2025-06-08 16:33:25', '2025-06-08 16:33:25'),
(5, 40, 0.00, '2025-06-14 06:48:02', '2025-06-14 06:48:02');

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
  ADD KEY `author_id` (`author_id`);

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
  ADD UNIQUE KEY `user_item` (`user_id`,`portfolio_item_id`),
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
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auction_id` (`auction_id`),
  ADD KEY `payer_id` (`payer_id`);

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
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `artwork_media`
--
ALTER TABLE `artwork_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `artwork_posts`
--
ALTER TABLE `artwork_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `artwork_post_likes`
--
ALTER TABLE `artwork_post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `artwork_tags`
--
ALTER TABLE `artwork_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `auction_bids`
--
ALTER TABLE `auction_bids`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `auction_media`
--
ALTER TABLE `auction_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `auto_replies`
--
ALTER TABLE `auto_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `escrow_releases`
--
ALTER TABLE `escrow_releases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `verification_requests`
--
ALTER TABLE `verification_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `auctions_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `auto_replies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auto_replies_ibfk_2` FOREIGN KEY (`portfolio_item_id`) REFERENCES `portfolio_items` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`),
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
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `verification_requests`
--
ALTER TABLE `verification_requests`
  ADD CONSTRAINT `verification_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
