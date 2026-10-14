CREATE DATABASE IF NOT EXISTS movie_booking;
USE movie_booking;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(50),
    duration INT,
    language VARCHAR(50),
    release_date DATE,
    description TEXT,
    poster_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    screen_no INT,
    show_date DATE,
    show_time TIME,
    price DECIMAL(10,2),
    total_seats INT DEFAULT 50,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    show_id INT,
    seats VARCHAR(255),
    total_amount DECIMAL(10,2),
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id)
);
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10,2),
    method VARCHAR(50),
    card_last4 VARCHAR(4),
    status ENUM('success','failed') DEFAULT 'success',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
INSERT INTO users (name,email,password,role) VALUES
('Admin','admin@movie.com','$2b$10$abcdefghijklmnopqrstuv','admin');

INSERT INTO movies (title,genre,duration,language,release_date,description) VALUES
('Avengers Endgame','Action',181,'English','2019-04-26','Marvel superhero movie'),
('Inception','Sci-Fi',148,'English','2010-07-16','Dream thriller'),
('Kanchana','Horror',150,'Tamil','2011-07-15','Horror comedy');