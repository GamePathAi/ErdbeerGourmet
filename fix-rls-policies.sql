-- Fix RLS policies to allow product synchronization
-- Execute this in your Supabase SQL Editor

-- Add INSERT policy for products (for sync scripts)
CREATE POLICY "Allow product inserts for sync" ON products
    FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for products (for sync scripts)
CREATE POLICY "Allow product updates for sync" ON products
    FOR UPDATE USING (true);

-- Add INSERT policy for customers (for checkout process)
CREATE POLICY "Allow customer inserts" ON customers
    FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for customers
CREATE POLICY "Allow customer updates" ON customers
    FOR UPDATE USING (true);

-- Add INSERT policy for orders (for checkout process)
CREATE POLICY "Allow order inserts" ON orders
    FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for orders
CREATE POLICY "Allow order updates" ON orders
    FOR UPDATE USING (true);

-- Add INSERT policy for order_items
CREATE POLICY "Allow order_items inserts" ON order_items
    FOR INSERT WITH CHECK (true);

-- Add INSERT policy for payment_events (for webhooks)
CREATE POLICY "Allow payment_events inserts" ON payment_events
    FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for payment_events
CREATE POLICY "Allow payment_events updates" ON payment_events
    FOR UPDATE USING (true);

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE ON products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON customers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON order_items TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON payment_events TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;