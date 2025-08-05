-- Re-enable RLS after sync is complete
-- Execute this in Supabase SQL Editor AFTER running sync

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Add proper policies for future operations
DROP POLICY IF EXISTS "Allow product inserts for sync" ON products;
DROP POLICY IF EXISTS "Allow product updates for sync" ON products;

-- Create service role policies (more secure)
CREATE POLICY "Service role can manage products" ON products
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage customers" ON customers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage order_items" ON order_items
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage payment_events" ON payment_events
    FOR ALL USING (auth.role() = 'service_role');