-- Database Schema for NutriHealth Gen

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_data (
    user_id INT PRIMARY KEY,
    profile_json JSON,
    daily_goals_json JSON,
    preferences_json JSON,
    gamification_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS history_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    log_date DATE NOT NULL,
    log_type VARCHAR(50) NOT NULL, -- 'calorie', 'weight', 'mood', 'sleep', 'activity'
    data_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id, log_date)
);

CREATE TABLE IF NOT EXISTS saved_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
