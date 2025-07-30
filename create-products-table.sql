-- Criar tabela de produtos e inserir produtos de morango gourmet
-- Execute este script no SQL Editor do Supabase

-- Criar tabela products
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_product_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'CHF',
    image_url VARCHAR(500),
    category VARCHAR(100),
    weight_grams INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública de produtos ativos
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir produtos de morango gourmet com IDs do Stripe
INSERT INTO products (stripe_product_id, name, description, price_cents, category, weight_grams, image_url) VALUES
('prod_SlJhFlcqk91ae8', 'Morango Gourmet - 1 Unidade', 'Morango suíço premium selecionado à mão - 1 unidade', 1000, 'gourmet', 100, '/images/morango-1un.jpg'),
('prod_SlJiCevrXOPhYV', 'Morango Gourmet - 2 Unidades', 'Morangos suíços premium selecionados à mão - 2 unidades', 1800, 'gourmet', 200, '/images/morango-2un.jpg'),
('prod_SlJjaVyIKv8L1L', 'Morango Gourmet - 4 Unidades', 'Morangos suíços premium selecionados à mão - 4 unidades', 3400, 'gourmet', 400, '/images/morango-4un.jpg'),
('prod_SlJjt03xRlmLKl', 'Morango Gourmet - 6 Unidades', 'Morangos suíços premium selecionados à mão - 6 unidades', 4800, 'gourmet', 600, '/images/morango-6un.jpg'),
('prod_Sm1jbiClKuLUsk', 'Morango Gourmet - 10 Unidades', 'Morangos suíços premium selecionados à mão - 10 unidades', 8000, 'gourmet', 1000, '/images/morango-10un.jpg')
ON CONFLICT (stripe_product_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_cents = EXCLUDED.price_cents,
    category = EXCLUDED.category,
    weight_grams = EXCLUDED.weight_grams,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON products(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_products_price_id ON products(stripe_price_id);

COMMENT ON TABLE products IS 'Catálogo de produtos de morango gourmet';