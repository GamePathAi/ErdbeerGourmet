-- Script para adicionar a coluna weight_grams à tabela products
-- Execute este script no SQL Editor do Supabase

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS weight_grams INTEGER;

-- Adicionar comentário para documentar a coluna
COMMENT ON COLUMN products.weight_grams IS 'Peso do produto em gramas';

-- Criar índice para melhor performance se necessário
CREATE INDEX IF NOT EXISTS idx_products_weight ON products(weight_grams);