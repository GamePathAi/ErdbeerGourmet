-- Schema completo do banco de dados ErdbeerGourmet
-- Execute este script no SQL Editor do Supabase para criar todas as tabelas

-- Função para atualizar updated_at (necessária para triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_customer_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela products
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_product_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    image_url TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_session_id VARCHAR(255) UNIQUE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    shipping_address JSONB,
    billing_address JSONB,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela order_items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela payment_events para webhook tracking
CREATE TABLE IF NOT EXISTS payment_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    order_id UUID REFERENCES orders(id),
    customer_id UUID REFERENCES customers(id),
    data JSONB,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_products_stripe_product_id ON products(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_stripe_id ON payment_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_processed ON payment_events(processed);

-- Função para gerar números de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get current date in YYYYMMDD format
    new_number := 'EG' || TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Get count of orders today
    SELECT COUNT(*) + 1 INTO counter
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Append counter with leading zeros
    new_number := new_number || LPAD(counter::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-gerar números de pedido
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover triggers existentes se houver
DROP TRIGGER IF EXISTS trigger_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;

-- Criar triggers
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para customers
CREATE POLICY "Users can view own profile" ON customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON customers
    FOR UPDATE USING (auth.uid() = id);

-- Políticas de segurança para products (acesso público para produtos ativos)
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

-- Políticas de segurança para orders (usuários podem ver apenas seus próprios pedidos)
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND auth.uid() = orders.customer_id
        )
    );

-- Criar view para resumo de pedidos
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total_amount_cents,
    o.currency,
    o.created_at,
    c.email,
    c.first_name,
    c.last_name,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.email, c.first_name, c.last_name;

-- Insert gourmet strawberry products
INSERT INTO products (stripe_product_id, name, description, price_cents, currency, is_active) VALUES
('prod_strawberry_classic', 'Classic Strawberry Box', 'Fresh premium strawberries, carefully selected', 2500, 'CHF', true),
('prod_strawberry_deluxe', 'Deluxe Strawberry Box', 'Premium strawberries with chocolate dip', 3500, 'CHF', true),
('prod_strawberry_luxury', 'Luxury Strawberry Gift Box', 'Premium strawberries with assorted gourmet toppings', 4500, 'CHF', true);