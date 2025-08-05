-- 🚨 EMERGÊNCIA: Liberar acesso manual para cliente
-- Execute IMEDIATAMENTE no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'ebook_purchases';

-- 2. Inserir acesso manual para o cliente
INSERT INTO ebook_purchases (
  stripe_session_id,
  customer_name,
  customer_email,
  status,
  access_granted,
  expires_at,
  created_at,
  updated_at
) VALUES (
  'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM',
  'IGOR ANTONIO GARCIA BONAFE',
  'igor.antonio.garcia.bonafe@gmail.com',
  'completed',
  true,
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
) ON CONFLICT (stripe_session_id) DO UPDATE SET
  access_granted = true,
  status = 'completed',
  updated_at = NOW();

-- 3. Verificar se foi inserido
SELECT * FROM ebook_purchases 
WHERE customer_email = 'igor.antonio.garcia.bonafe@gmail.com';

-- 4. Se a tabela não existir, usar esta alternativa:
-- CREATE TABLE IF NOT EXISTS ebook_sessions (
--   id SERIAL PRIMARY KEY,
--   stripe_session_id TEXT UNIQUE NOT NULL,
--   customer_name TEXT NOT NULL,
--   customer_email TEXT NOT NULL,
--   access_granted BOOLEAN DEFAULT false,
--   expires_at TIMESTAMP WITH TIME ZONE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
-- 
-- INSERT INTO ebook_sessions (
--   stripe_session_id,
--   customer_name,
--   customer_email,
--   access_granted,
--   expires_at,
--   created_at
-- ) VALUES (
--   'cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM',
--   'IGOR ANTONIO GARCIA BONAFE',
--   'igor.antonio.garcia.bonafe@gmail.com',
--   true,
--   NOW() + INTERVAL '1 year',
--   NOW()
-- ) ON CONFLICT (stripe_session_id) DO UPDATE SET
--   access_granted = true;

-- ✅ APÓS EXECUTAR:
-- 1. Envie email manual para: igor.antonio.garcia.bonafe@gmail.com
-- 2. Link de acesso: https://erdbeergourmet.ch/ebook-acesso.html?session_id=cs_live_a1TiCiuLm1h1Of4jXEbThatMJAGyLUBB3ZQYK2U2SZxftS6KyfPmrWHRfM
-- 3. Execute os diagnósticos abaixo para corrigir o sistema