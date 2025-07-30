-- Script para atualizar produtos de morango com as quantidades e preços corretos
-- Execute este script no SQL Editor do Supabase

-- Primeiro, limpar produtos existentes de morango
DELETE FROM products WHERE name LIKE '%Strawberry%' OR name LIKE '%Morango%';

-- Inserir os 4 produtos de morango com quantidades específicas
INSERT INTO products (name, description, price_cents, currency, is_active, category) VALUES
('Morango Gourmet - 1 Unidade', 'Morango premium selecionado individualmente', 1000, 'CHF', true, 'morangos'),
('Morango Gourmet - 2 Unidades', 'Dois morangos premium em embalagem especial', 1800, 'CHF', true, 'morangos'),
('Morango Gourmet - 5 Unidades', 'Cinco morangos premium em caixa gourmet', 4100, 'CHF', true, 'morangos'),
('Morango Gourmet - 10 Unidades', 'Dez morangos premium em caixa de presente', 8000, 'CHF', true, 'morangos');

-- Verificar os produtos inseridos
SELECT 
    name, 
    description, 
    price_cents/100.0 as price_chf, 
    currency,
    is_active
FROM products 
WHERE category = 'morangos'
ORDER BY price_cents;