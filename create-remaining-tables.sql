-- Criar tabelas restantes para o sistema de e-commerce
-- Execute este script no SQL Editor do Supabase após criar a tabela products

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

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Trigger para atualizar updated_at em orders
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (usuários podem ver apenas seus próprios pedidos)
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND auth.uid()::text = orders.customer_id::text
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

COMMENT ON TABLE orders IS 'Pedidos do sistema de e-commerce';
COMMENT ON TABLE order_items IS 'Itens individuais de cada pedido';
COMMENT ON TABLE payment_events IS 'Eventos de webhook do Stripe para auditoria';