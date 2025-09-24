CREATE DATABASE IF NOT EXISTS greendrop_db;

USE greendrop_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    points INT DEFAULT 0,
    badges INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    youtube_id VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    points_on_completion INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS user_completed_videos (
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES training_videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    correct_answer ENUM('a', 'b', 'c') NOT NULL,
    points INT DEFAULT 5
);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shop_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0
);

-- Insert some initial data for training videos
INSERT INTO training_videos (title, youtube_id, description, points_on_completion) VALUES
('Eco-Friendly Living Tips', '0UbzpjiJg8g', 'Learn simple tips for an eco-friendly lifestyle.', 10),
('How to Compost at Home', 'iPMSqMX-csA', 'A guide to composting kitchen waste.', 15),
('Reduce, Reuse, Recycle', 'yGb9nnOGryk', 'Understanding the 3 Rs of waste management.', 10),
('Waste Management', '07ym6iZNMQU', 'Comprehensive overview of waste management practices.', 12),
('Sustainable Waste Solutions', '8ufiQlrosCM', 'Innovative solutions for sustainable waste.', 18),
('EcoBricks - A Solution To Plastic Pollution', 'lNgAW4VRcKo', 'How to make and use EcoBricks.', 20),
('Zero Waste Colony', 'astag10OjGk', 'Inspiring story of a zero-waste community.', 25),
('Convert Our Wrapper Waste into these Amazing things', 'ufyLuCWeNco', 'Creative ways to reuse wrapper waste.', 15),
('Convert your waste plastic bottles into clothes', 'tPwY8y9A6fA', 'The process of turning plastic bottles into fabric.', 20);

-- Insert some initial data for quiz questions
INSERT INTO quiz_questions (question, option_a, option_b, option_c, correct_answer, points) VALUES
('Which item is NOT recyclable?', 'Glass Bottle', 'Plastic Bag', 'Aluminum Can', 'b', 5),
('Composting is best for which type of waste?', 'Wet/Kitchen Waste', 'Metals', 'Glass', 'a', 5),
('Which bin color is used for dry waste in India?', 'Green', 'Blue', 'Black', 'b', 5),
('Which bin color is used for wet waste in India?', 'Green', 'Blue', 'Black', 'a', 5),
('Which bin color is used for hazardous waste in India?', 'Red', 'Yellow', 'Black', 'c', 5),
('Which item should go in the hazardous waste bin?', 'Batteries', 'Food Scraps', 'Plastic Bottles', 'a', 5),
('What does the recycling symbol with three arrows represent?', 'Reduce, Reuse, Recycle', 'Buy New Products', 'Throw Away Waste', 'a', 5),
('Which of these is a renewable energy source?', 'Solar Power', 'Coal', 'Natural Gas', 'a', 5),
('What is the main purpose of composting?', 'To reduce landfill waste', 'To create plastic', 'To burn waste', 'a', 5),
('Which type of waste is an apple core?', 'Dry Waste', 'Wet Waste', 'E-waste', 'b', 5),
('Which of the following can be composted?', 'Orange Peels', 'Glass Jar', 'Metal Wire', 'a', 5),
('Recycling plastic reduces:', 'Water Pollution', 'Land Pollution', 'All of the above', 'c', 5),
('Paper can be recycled up to how many times?', '2–3', '5–7', '10–15', 'b', 5),
('Which gas is produced if wet waste is not properly disposed?', 'Oxygen', 'Methane', 'Nitrogen', 'b', 5),
('Which is the best way to manage food waste?', 'Burning', 'Composting', 'Throwing in landfill', 'b', 5);

-- Insert some initial data for shop items
INSERT INTO shop_items (name, description, image_url, price, stock) VALUES
('Compost Kit', 'Turn kitchen waste into rich compost for your garden. Includes bin, starter, and guide.', '../images/1.png', 49.99, 50),
('Dustbin', 'Durable, eco-friendly dustbins for home and office. Separate wet and dry waste easily.', '../images/dustbin.avif', 29.99, 100),
('Reusable Bag', 'Say goodbye to plastic! Carry groceries and essentials in style with our reusable bags.', '../images/Reusable-bag.png', 9.99, 200);