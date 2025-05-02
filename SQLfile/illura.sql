-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2025 at 09:10 AM
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
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(200) NOT NULL,
  `author_id` int(200) NOT NULL,
  `content` varchar(200) NOT NULL,
  `media` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `content`, `media`, `created_at`) VALUES
(1, 32, 'aacacac', '/uploads/1744251505688-crystal.jpg', '2025-04-10 10:18:25'),
(2, 35, 'awafafafaf', '/uploads/1744251769173-goodr.png', '2025-04-10 10:22:49'),
(3, 32, 'aweafafawd', '/uploads/1744296766629-328268681_5076664875769381_8857517064904560034_n.jpg', '2025-04-10 22:52:46'),
(4, 35, 'POST', '/uploads/1744351658572-ravknoif.jpg', '2025-04-11 14:07:38');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `fullname` text NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `bio` varchar(200) NOT NULL,
  `pfp` varchar(200) NOT NULL,
  `birthdate` date NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `account_status` enum('active','on_hold') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `username`, `fullname`, `password`, `email`, `bio`, `pfp`, `birthdate`, `created_at`, `account_status`) VALUES
(32, 'sanca_re', 'Carlos Son', '$2b$10$4zy8RLlXylyIkUhl8i6gneVqspdo.LzDo7t3P.YFYwQz239KVmk3y', 'asd@gmail.com', 'asacac', '1743920208412-573106917-omexqc.jpg', '2025-04-06', '2025-04-06 14:16:48.477351', 'active'),
(33, 'gratelex', 'Alexander Grate', '$2b$10$aYTYqdXyJPByCipHu9UScutEJytxc8FPw6HOo24qC6BbxtsN6Tj4a', 'zxc@gmail.com', 'sdfsdffsdf', '1744098983801-136090730-salutmoji.jpg', '2025-04-08', '2025-04-08 15:56:23.872925', 'active'),
(34, 'marc_pol', 'Marco Polo', '$2b$10$G/7g8Jqi9s/yFZKFlRFPkewDTN69vCtvtsFIZtx7liltiB/1UPSPi', 'qwerty@gmail.com', 'zxcvbm lorep omsim', '1744176997606-585981206-pepelaugh.png', '2025-04-09', '2025-04-09 13:36:37.784622', 'active'),
(35, 'xwpL', 'Felix Nguyan', '$2b$10$25H.oSdRzdHxTcWquF/Jo.wHNumU1.cMrDaKspnd2WMcIeyRL92QC', 'vbn@gmail.com', 'omsim lorep yoink', '1744177069337-198078158-huh.jpg', '2025-04-08', '2025-04-09 13:37:49.472479', 'active'),
(36, 'graveh', 'Graves English', '$2b$10$hSJOLYXzDZey4ZRJS1tYNOKFY0sC1e2gFWsWExAuYKyxhDD2vLrrm', 'fgh@gmail.com', 'adasfdf', '1744179348286-995219497-Soyjack Pointing.png', '2025-04-07', '2025-04-09 14:15:48.345042', 'active'),
(37, 'dafgr', 'Dafr Gafr', '$2b$10$VUJtpUtYzxNjhJU4ibHjj.uBhpbkQ1iF.fZgPvw/GVFtxBlqn/fSq', 'werty@gmail.com', 'afsdfs', '1744247874027-270900214-kainray.jpg', '2025-04-09', '2025-04-10 09:17:54.205964', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(200) NOT NULL,
  `tag_name` varchar(200) NOT NULL,
  `tag_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `tag_name`, `tag_created`) VALUES
(27, 'tattooart', '2025-04-01'),
(28, 'digitalart', '2025-04-02'),
(29, 'traditionalart', '2025-04-02'),
(31, 'illustration', '2025-04-06'),
(32, '3dmodel', '2025-04-08'),
(33, 'sculpture', '2025-04-08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `profiles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
