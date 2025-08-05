-- Fix RLS policies for ebook_purchases table
-- Execute this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow ebook_purchases inserts" ON ebook_purchases;
DROP POLICY IF EXISTS "Allow ebook_purchases updates" ON ebook_purchases;
DROP POLICY IF EXISTS "Allow ebook_purchases selects" ON ebook_purchases;

-- Create new policies for ebook_purchases
CREATE POLICY "Allow ebook_purchases inserts" ON ebook_purchases
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow ebook_purchases updates" ON ebook_purchases
    FOR UPDATE USING (true);

CREATE POLICY "Allow ebook_purchases selects" ON ebook_purchases
    FOR SELECT USING (true);

CREATE POLICY "Allow ebook_purchases deletes" ON ebook_purchases
    FOR DELETE USING (true);

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON ebook_purchases TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;