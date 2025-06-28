-- Insert some sample food items for testing
INSERT INTO food_items (name, category, expiry_date) VALUES
  ('Bananas', 'Fruits', CURRENT_DATE + INTERVAL '2 days'),
  ('Milk', 'Dairy', CURRENT_DATE + INTERVAL '5 days'),
  ('Spinach', 'Vegetables', CURRENT_DATE + INTERVAL '3 days'),
  ('Yogurt', 'Dairy', CURRENT_DATE + INTERVAL '7 days'),
  ('Bread', 'Grains', CURRENT_DATE + INTERVAL '4 days'),
  ('Tomatoes', 'Vegetables', CURRENT_DATE + INTERVAL '6 days');
