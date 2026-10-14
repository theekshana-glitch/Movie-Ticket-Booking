-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2026 at 11:30 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movie_booking_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `guest_name` varchar(100) NOT NULL,
  `guest_email` varchar(100) NOT NULL,
  `guest_phone` varchar(20) DEFAULT NULL,
  `show_id` int(11) NOT NULL,
  `seats_booked` int(11) NOT NULL DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('confirmed','cancelled') DEFAULT 'confirmed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `guest_name`, `guest_email`, `guest_phone`, `show_id`, `seats_booked`, `total_amount`, `booking_date`, `status`) VALUES
(1, 'John Doe', 'john@example.com', '555-0101', 1, 2, 25.00, '2026-10-13 19:05:45', 'confirmed'),
(2, 'Jane Smith', 'jane@example.com', '555-0102', 3, 3, 45.00, '2026-10-13 19:05:45', 'confirmed'),
(3, 'Mike Johnson', 'mike@example.com', '555-0103', 4, 1, 14.00, '2026-10-13 19:05:45', 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `genre` varchar(80) NOT NULL,
  `language` varchar(50) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `rating` varchar(10) DEFAULT 'PG-13',
  `release_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `genre`, `language`, `duration_minutes`, `rating`, `release_date`, `description`, `poster_url`, `created_at`) VALUES
(1, 'Inception', 'Sci-Fi', 'English', 148, 'PG-13', '2010-07-16', 'A thief who steals secrets through dream-sharing technology.', NULL, '2026-10-13 19:05:45'),
(2, 'Interstellar', 'Sci-Fi', 'English', 169, 'PG-13', '2014-11-07', 'A team of explorers travels through a wormhole in space.', NULL, '2026-10-13 19:05:45'),
(3, 'The Dark Knight', 'Action', 'English', 152, 'PG-13', '2008-07-18', 'Batman battles the Joker in Gotham City.', NULL, '2026-10-13 19:05:45'),
(4, 'Parasite', 'Thriller', 'Korean', 132, 'R', '2019-05-30', 'Greed and class discrimination.', NULL, '2026-10-13 19:05:45'),
(5, 'Spirited Away', 'Animation', 'Japanese', 125, 'PG', '2001-07-20', 'A girl enters the spirit world.', NULL, '2026-10-13 19:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `mode` enum('cash','card','upi','netbanking') DEFAULT 'card',
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `transaction_ref` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `amount`, `mode`, `status`, `transaction_ref`, `paid_at`) VALUES
(1, 1, 25.00, 'card', 'paid', 'TXN-1001', '2026-10-13 19:05:47'),
(2, 2, 45.00, 'upi', 'paid', 'TXN-1002', '2026-10-13 19:05:47'),
(3, 3, 14.00, 'cash', 'pending', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shows`
--

CREATE TABLE `shows` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `screen_name` varchar(50) NOT NULL,
  `show_date` date NOT NULL,
  `show_time` time NOT NULL,
  `ticket_price` decimal(10,2) NOT NULL,
  `total_seats` int(11) DEFAULT 100,
  `available_seats` int(11) DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shows`
--

INSERT INTO `shows` (`id`, `movie_id`, `screen_name`, `show_date`, `show_time`, `ticket_price`, `total_seats`, `available_seats`) VALUES
(1, 1, 'Screen 1', '2026-10-14', '18:00:00', 12.50, 100, 100),
(2, 1, 'Screen 2', '2026-10-14', '21:00:00', 12.50, 100, 100),
(3, 2, 'Screen 1', '2026-10-15', '19:30:00', 15.00, 120, 120),
(4, 3, 'Screen 3', '2026-10-14', '20:00:00', 14.00, 80, 80),
(5, 4, 'Screen 2', '2026-10-16', '17:00:00', 11.00, 90, 90),
(6, 5, 'Screen 1', '2026-10-15', '16:00:00', 10.00, 100, 100);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','staff') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin', 'admin@moviebook.com', '$2b$10$Y8TqJf8FeYcFoJlL.mYAreOXhtj9UI1EJ1LLSJuL3lZttDF.ds1QW', 'admin', '2026-10-13 19:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `watch_history`
--

CREATE TABLE `watch_history` (
  `id` int(11) NOT NULL,
  `guest_email` varchar(100) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `watched_on` date NOT NULL,
  `rating` int(11) DEFAULT 0,
  `review` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `watch_history`
--

INSERT INTO `watch_history` (`id`, `guest_email`, `movie_id`, `watched_on`, `rating`, `review`) VALUES
(1, 'john@example.com', 2, '2024-01-15', 5, 'Mind-blowing visuals!'),
(2, 'jane@example.com', 1, '2024-02-20', 4, 'Great plot twist.'),
(3, 'mike@example.com', 3, '2024-03-05', 5, 'Best Batman movie.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `show_id` (`show_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `shows`
--
ALTER TABLE `shows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `watch_history`
--
ALTER TABLE `watch_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shows`
--
ALTER TABLE `shows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `watch_history`
--
ALTER TABLE `watch_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shows`
--
ALTER TABLE `shows`
  ADD CONSTRAINT `shows_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watch_history`
--
ALTER TABLE `watch_history`
  ADD CONSTRAINT `watch_history_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
