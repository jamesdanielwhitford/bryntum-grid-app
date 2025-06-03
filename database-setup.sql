-- Create the people table with auto-incrementing ID
CREATE TABLE people (
  id BIGSERIAL PRIMARY KEY,
  name text NOT NULL,
  age int4,
  city text,
  food text,
  color text
);

-- Insert sample data (IDs will auto-increment)
INSERT INTO people (name, age, city, food, color) VALUES
('Don A Taylor', 30, 'Dubai', 'Salad', 'Black'),
('John B Adams', 64, 'Paris', 'Bolognese', 'Orange'),
('Doug C Jones', 30, 'Stockholm', 'Pancake', 'Pink'),
('James D Davis', 87, 'Barcelona', 'Pancake', 'Green'),
('Mike E Johnson', 14, 'Dubai', 'Pancake', 'Green'),
('Don F Johnson', 18, 'Dubai', 'Fish n chips', 'Red'),
('Jane G McGregor', 78, 'Stockholm', 'Fish n chips', 'Green'),
('Jane H Thomas', 65, 'New York', 'Fish n chips', 'Black'),
('Lisa I Anderson', 14, 'New York', 'Burger', 'Orange'),
('Don J Thomas', 45, 'Stockholm', 'Salad', 'Black'),
('Doug K Jackson', 16, 'Barcelona', 'Fish n chips', 'Red'),
('James L Ewans', 30, 'Dubai', 'Salad', 'Black'),
('Jenny M Brown', 56, 'Dubai', 'Waffles', 'Orange'),
('Doug N Ewans', 61, 'Barcelona', 'Pancake', 'Teal'),
('Mike O Ewans', 78, 'Stockholm', 'Burger', 'Green'),
('Sarah P Wilson', 25, 'London', 'Sushi', 'Blue'),
('Alex Q Rodriguez', 32, 'Madrid', 'Pizza', 'Purple'),
('Emma R Davis', 28, 'Berlin', 'Pasta', 'Yellow'),
('Chris S Johnson', 41, 'Tokyo', 'Ramen', 'Red'),
('Maria T Garcia', 35, 'Mexico City', 'Tacos', 'Green');

-- Reset the sequence to start from 21 for new records
SELECT setval('people_id_seq', (SELECT MAX(id) FROM people));

-- Disable Row Level Security (recommended for development)
ALTER TABLE people DISABLE ROW LEVEL SECURITY;
