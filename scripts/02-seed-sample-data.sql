-- Insert some sample food items for testing
-- This helps you see the app working immediately
INSERT INTO food_items (name, category, expiry_date) VALUES
  ('Bananas', 'Fruits', CURRENT_DATE + INTERVAL '2 days'),
  ('Whole Milk', 'Dairy', CURRENT_DATE + INTERVAL '5 days'),
  ('Fresh Spinach', 'Vegetables', CURRENT_DATE + INTERVAL '3 days'),
  ('Greek Yogurt', 'Dairy', CURRENT_DATE + INTERVAL '7 days'),
  ('Sourdough Bread', 'Grains', CURRENT_DATE + INTERVAL '4 days'),
  ('Cherry Tomatoes', 'Vegetables', CURRENT_DATE + INTERVAL '6 days'),
  ('Avocados', 'Fruits', CURRENT_DATE + INTERVAL '3 days'),
  ('Cheddar Cheese', 'Dairy', CURRENT_DATE + INTERVAL '14 days');
