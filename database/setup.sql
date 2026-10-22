-- Optional: run this in MySQL if you prefer to create the database manually.
-- (The app also creates it automatically thanks to createDatabaseIfNotExist=true.)

CREATE DATABASE IF NOT EXISTS lost_found_db;
USE lost_found_db;

-- The "items" table is created automatically by Hibernate (ddl-auto=update).
-- For reference, this is the equivalent SQL:
CREATE TABLE IF NOT EXISTS items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    category    VARCHAR(50)  NOT NULL,
    location    VARCHAR(100) NOT NULL,
    date        DATE         NOT NULL,
    status      VARCHAR(20)  NOT NULL,
    report_type VARCHAR(20)  NOT NULL
);

-- Optional sample rows (the app inserts similar rows automatically if the table is empty).
-- INSERT INTO items (name, description, category, location, date, status, report_type) VALUES
-- ('Black Backpack', 'Black Wildcraft backpack with a laptop charger', 'Bags', 'Library, 2nd floor', CURDATE() - INTERVAL 5 DAY, 'OPEN', 'LOST');
