-- Create a function to get items expiring soon
-- This will be useful for notifications later
CREATE OR REPLACE FUNCTION get_expiring_items(days_ahead INTEGER DEFAULT 3)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  category VARCHAR,
  expiry_date DATE,
  days_until_expiry INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fi.id,
    fi.name,
    fi.category,
    fi.expiry_date,
    (fi.expiry_date - CURRENT_DATE)::INTEGER as days_until_expiry
  FROM food_items fi
  WHERE fi.expiry_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
  ORDER BY fi.expiry_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW food_stats AS
SELECT 
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE expiry_date <= CURRENT_DATE) as expired_items,
  COUNT(*) FILTER (WHERE expiry_date <= CURRENT_DATE + INTERVAL '3 days' AND expiry_date > CURRENT_DATE) as expiring_soon,
  COUNT(*) FILTER (WHERE expiry_date > CURRENT_DATE + INTERVAL '3 days') as fresh_items
FROM food_items;
