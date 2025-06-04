-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2025 at 05:13 PM
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
(8, 21, 'uploads/1748994999800-0530m9hgk1s41.jpg'),
(9, 21, 'uploads/1748994999806-albularyos.jpg'),
(14, 24, '1748997637717-Screenshot 2024-07-18 152542.jpg'),
(15, 24, '1748997637718-Screenshot 2024-07-18 205725.jpg');

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
(21, 28, 'asd', 'cvb', '2025-06-03 23:56:39'),
(24, 28, 'qwert', 'asd', '2025-06-04 00:40:37');

-- --------------------------------------------------------

--
-- Table structure for table `auctions`
--

CREATE TABLE `auctions` (
  `id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('pending','active','ended','stopped') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
(17, 28, 38, 'commenttoo', '2025-06-01 16:26:41');

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
(29, 28, 'The sun', 'Ray of hopes', '3963d29054aae3e3ac9dbb7a89756289', '2025-06-01 16:27:19', '2025-06-01 16:27:40'),
(30, 34, 'Portfolio', 'aaa', '42c3f05eef18dc5d33314c2e3685ff71', '2025-06-02 04:32:08', '2025-06-02 04:32:08');

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
(38, 34, 'adadadad', '2026da0f53159f06ec83082bac9919fc', '2025-06-01 16:25:58', '2025-06-01 16:25:58', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(200) NOT NULL,
  `tag_name` varchar(200) NOT NULL,
  `tag_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `bio` text DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `pfp` varchar(255) DEFAULT NULL,
  `account_status` enum('active','on hold','banned') DEFAULT 'active',
  `commissions` enum('open','closed') DEFAULT 'closed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `bio`, `birthdate`, `pfp`, `account_status`, `commissions`, `created_at`, `updated_at`) VALUES
(28, 'dadark', 'asd@gmail.com', '$2b$10$ph27ZwaqpvGpgL4qvr6Lre28AUghCdmNDkfZbO/.uKxItLkXfs8YS', 'Dark dark', 'qqqqq', '2025-06-05', '0c3412d38261746fbdef16782b2da2fb', 'active', 'closed', '2025-06-01 16:06:58', '2025-06-01 16:06:58'),
(34, 'xqcccc', 'qwerty@gmail.com', '$2b$10$rRDYKbXVUL1fWJ4ACmzFGu6A./O1FfsCIWQqMmFDMq0ZzLMh9U/ze', 'Felix Nguyan', '1111', '2025-06-04', 'e392a8ff44dd05d5401b051ae9bb1e38', 'active', 'closed', '2025-06-01 16:23:36', '2025-06-01 16:23:53'),
(35, 'slytherin', 'zxc@gmail.com', '$2b$10$nQDj54OV1//a2tOqzUUF1efVMKuxzCXnU4uDYhN0i9fZz4j77a2P.', 'Severus Spane', 'zxzx', '2025-06-05', '08b514258a46adcc92183279a607833d', 'active', 'closed', '2025-06-03 17:17:20', '2025-06-03 17:17:20');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `auctions`
--
ALTER TABLE `auctions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `auction_media`
--
ALTER TABLE `auction_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auction_id` (`auction_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `post_id` (`post_id`);

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
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artwork_media`
--
ALTER TABLE `artwork_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `artwork_posts`
--
ALTER TABLE `artwork_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `auctions`
--
ALTER TABLE `auctions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auction_media`
--
ALTER TABLE `auction_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `auctions`
--
ALTER TABLE `auctions`
  ADD CONSTRAINT `auctions_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auction_media`
--
ALTER TABLE `auction_media`
  ADD CONSTRAINT `auction_media_ibfk_1` FOREIGN KEY (`auction_id`) REFERENCES `auctions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
