-- Create the food_items table
CREATE TABLE IF NOT EXISTS food_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on expiry_date for faster queries
CREATE INDEX IF NOT EXISTS idx_food_items_expiry_date ON food_items(expiry_date);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category);
