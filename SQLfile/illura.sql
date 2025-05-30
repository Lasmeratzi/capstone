-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 11:20 AM
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
(10, 24, 13, 'nice', '2025-05-21 09:07:05'),
(11, 24, 13, 'nice', '2025-05-21 09:07:25');

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
(19, 16, 'Pocahontas', 'Colors of the Wind', 'fb312e10444c1b7e5698d69219af580e', '2025-05-02 06:41:00', '2025-05-13 06:48:22'),
(20, 16, 'Interstelling', 'Time Space sanaol', 'a48a20e6cec49e8546df2020f3a4c694', '2025-05-02 06:41:42', '2025-05-02 06:41:42'),
(21, 16, 'Pearl', 'Red Flag hahaha', '49a67bee6d5b0a4e92017452c5ad4c9e', '2025-05-02 06:42:05', '2025-05-02 06:42:05'),
(22, 15, 'The Raven', 'One of Earth\'s intelligent species', '41c181db30f5c722aec68f2aaeb4a8ca', '2025-05-02 06:48:39', '2025-05-02 06:48:39'),
(23, 15, 'Hope', 'There will always be hope.', '07af81c014641341ab84c496e8dc56c6', '2025-05-02 06:49:06', '2025-05-02 06:49:06'),
(26, 22, 'Portfolio1', 'qweqwe', 'e647428484125576384a8cb64bdb6a75', '2025-05-02 10:31:46', '2025-05-02 10:33:43'),
(28, 16, 'Thins', 'gfh', '691efffd5c869900cafc397a5c09216c', '2025-05-13 06:50:51', '2025-05-13 06:50:51');

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
(6, 14, 'Cat of the Albularyo', 'bc8405cae816bf8c0e01189ece2c379a', '2025-05-02 06:43:38', '2025-05-13 08:11:16', 'active'),
(7, 15, 'The sun Rises', 'e3b2feef7b4ca08326e42d7c1f786f93', '2025-05-02 06:47:34', '2025-05-02 06:47:34', 'active'),
(13, 16, 'Kenshining lang in the wayyy hmmmmmm', '6cd72ecaa99775057d71e5b411716855', '2025-05-21 08:36:23', '2025-05-21 09:02:29', 'active');

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
(14, 'theprofessor', 'zxc@gmail.com', '$2b$10$dqILzYxLACpn612b4SsGkO.yyY1TxbjCGA0ZIGwHuzeKMPs/0w3Yq', 'Charles Xavier', 'The Hope', '2025-05-02', 'c906c6819c5778ea0a2e4480e02a69c8', 'active', 'closed', '2025-05-02 06:38:26', '2025-05-12 10:15:39'),
(15, 'no1reddington', 'qwerty@gmail.com', '$2b$10$AN5pYFNBtV7.R.L5txtBluabu1IwOtxlypSlWXxMoXe2ORgYCOORW', 'Raymond Reddington', 'Ultron Profile', '2025-05-03', 'dd9e140bcea5aa4af27f44b2b0af0cd5', 'active', 'open', '2025-05-02 06:39:24', '2025-05-15 18:33:34'),
(16, 'mikegaliya', 'vbn@gmail.com', '$2b$10$hD9SpJh.//k84LFSHQveFuf61/Jf1En7ZEM.qzfD8.NO52ZsjYKj2', 'Mark Wazowski', 'Univeristy kuan', '2025-05-07', '02a5579e943ea6e2588e9107804a69fc', 'active', 'closed', '2025-05-02 06:40:25', '2025-05-21 08:17:00'),
(22, 'davechester', 'rty@gmail.com', '$2b$10$jvkT8KDa/9nRpNg0KvCxdOpx3OTQX9d1bkUX2A5I2d8eOOmion/BC', 'Davechester', 'adadasdfs', '2025-05-08', '05c9468d9979ee1224a6b1b979fcebe9', 'active', 'closed', '2025-05-02 10:29:24', '2025-05-13 07:20:15'),
(23, 'Sandra', 'alexandraledesma215@gmail.com', '$2b$10$VWFrZrlv7lCNhh2pleE9fO4EEscYETfqReFVwKMwvpAdeH1UxlySG', 'Alexandra ledesma', 'Im simple Artist', '2000-07-19', '6ed30ca8dfdb7ea96e38fd62114fef32', 'active', 'closed', '2025-05-09 06:37:56', '2025-05-13 07:20:05'),
(24, 'darker', 'asd@gmail.com', '$2b$10$EfZYrCVOyFCol4ZOCnnRgegSZsk.cFWb9zMvM2c8v7nRIpb6ppwR6', 'Dark dark', 'asdasd', '2025-05-14', '3452dd6cae03c73133dda9436699073b', 'active', 'closed', '2025-05-13 07:47:42', '2025-05-14 15:41:41');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `portfolio_items`
--
ALTER TABLE `portfolio_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

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
