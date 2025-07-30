-- Script para atualizar produtos existentes com os IDs corretos do Stripe
-- Execute este script no SQL Editor do Supabase

-- Atualizar os produtos existentes com os novos IDs do Stripe e preços corretos
UPDATE products 
SET 
    stripe_product_id = 'prod_SlJhFlcqk91ae8',
    name = '01 Erdbeer Gourmet',
    price_cents = 1000
WHERE stripe_product_id = 'prod_strawberry_classic' OR name LIKE '%Classic%';

UPDATE products 
SET 
    stripe_product_id = 'prod_SlJiCevrXOPhYV',
    name = '02 Erdbeere Gourmet',
    price_cents = 1800
WHERE stripe_product_id = 'prod_strawberry_deluxe' OR name LIKE '%Deluxe%';

UPDATE products 
SET 
    stripe_product_id = 'prod_SlJjaVyIKv8L1L',
    name = '05 Erdbeere Gourmet',
    price_cents = 4100
WHERE stripe_product_id = 'prod_strawberry_luxury' OR name LIKE '%Luxury%';

-- Inserir o quarto produto se não existir
INSERT INTO products (stripe_product_id, name, description, price_cents, currency, is_active, category)
SELECT 'prod_Sm1jbiClKuLUsk', '10 Erdbeere Gourmet', 'Dez morangos premium em caixa de presente', 8000, 'CHF', true, 'morangos'
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE stripe_product_id = 'prod_Sm1jbiClKuLUsk'
);

-- Verificar os produtos atualizados
SELECT 
    stripe_product_id,
    name, 
    price_cents/100.0 as price_chf, 
    currency,
    is_active
FROM products 
WHERE stripe_product_id IN (
    'prod_SlJhFlcqk91ae8',
    'prod_SlJiCevrXOPhYV', 
    'prod_SlJjaVyIKv8L1L',
    'prod_Sm1jbiClKuLUsk'
)
ORDER BY price_cents;