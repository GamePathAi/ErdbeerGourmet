-- Create ebook_purchases table
CREATE TABLE IF NOT EXISTS ebook_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  access_token TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_customer_id ON ebook_purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_stripe_session_id ON ebook_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_access_token ON ebook_purchases(access_token);
CREATE INDEX IF NOT EXISTS idx_ebook_purchases_status ON ebook_purchases(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ebook_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ebook_purchases_updated_at
  BEFORE UPDATE ON ebook_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_ebook_purchases_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE ebook_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for service role" ON ebook_purchases
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert access for service role" ON ebook_purchases
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role" ON ebook_purchases
  FOR UPDATE USING (auth.role() = 'service_role');

-- Grant permissions to service role
GRANT ALL ON ebook_purchases TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Add comment
COMMENT ON TABLE ebook_purchases IS 'Stores ebook purchase records with access tokens for digital product delivery';