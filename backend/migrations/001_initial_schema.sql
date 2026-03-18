-- ============================================================
-- ROLLON Casino — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Users & Authentication
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  username        VARCHAR(50)  UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  salt            VARCHAR(255) NOT NULL,
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  date_of_birth   DATE,
  country         VARCHAR(2),
  phone           VARCHAR(20),
  role            VARCHAR(20)  DEFAULT 'player',    -- player, admin, support
  is_verified     BOOLEAN      DEFAULT false,
  is_active       BOOLEAN      DEFAULT true,
  is_locked       BOOLEAN      DEFAULT false,
  two_factor_enabled BOOLEAN   DEFAULT false,
  two_factor_secret  VARCHAR(100),
  kyc_status      VARCHAR(20)  DEFAULT 'pending',   -- pending, verified, rejected
  kyc_documents   JSONB,
  last_login      TIMESTAMP,
  last_ip         INET,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================================
-- User Sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token   VARCHAR(512) UNIQUE NOT NULL,
  refresh_token   VARCHAR(512) UNIQUE,
  ip_address      INET,
  user_agent      TEXT,
  device_info     JSONB,
  expires_at      TIMESTAMP    NOT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token   ON user_sessions(session_token);

-- ============================================================
-- Game Providers
-- ============================================================
CREATE TABLE IF NOT EXISTS providers (
  id              VARCHAR(50)  PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  api_endpoint    TEXT,
  api_key         VARCHAR(255),
  api_secret      VARCHAR(255),
  callback_url    TEXT,
  is_active       BOOLEAN      DEFAULT true,
  config          JSONB,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO providers (id, name, is_active) VALUES
  ('BNG', 'BGaming',        true),
  ('PP',  'Pragmatic Play', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Games Catalog
-- ============================================================
CREATE TABLE IF NOT EXISTS games (
  id              VARCHAR(100) PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  genre           VARCHAR(50),
  rtp             DECIMAL(5,2),
  volatility      VARCHAR(20),
  provider        VARCHAR(50)  REFERENCES providers(id),
  is_active       BOOLEAN      DEFAULT true,
  image_url       TEXT,
  demo_url        TEXT,
  real_play_url   TEXT,
  metadata        JSONB,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_games_provider ON games(provider);
CREATE INDEX idx_games_genre    ON games(genre);

-- ============================================================
-- Player Balances (Critical — DECIMAL, optimistic locking)
-- ============================================================
CREATE TABLE IF NOT EXISTS balances (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID         REFERENCES users(id) ON DELETE CASCADE,
  currency            VARCHAR(10)  DEFAULT 'USDT',
  real_balance        DECIMAL(20,8) DEFAULT 0.00000000,
  bonus_balance       DECIMAL(20,8) DEFAULT 0.00000000,
  locked_balance      DECIMAL(20,8) DEFAULT 0.00000000,
  total_deposited     DECIMAL(20,8) DEFAULT 0.00000000,
  total_withdrawn     DECIMAL(20,8) DEFAULT 0.00000000,
  total_bonus         DECIMAL(20,8) DEFAULT 0.00000000,
  last_transaction_id UUID,
  version             INTEGER      DEFAULT 0,           -- optimistic locking
  updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, currency)
);

CREATE INDEX idx_balances_user ON balances(user_id);

-- ============================================================
-- Transaction Ledger (Immutable audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_uuid UUID         UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  user_id          UUID         REFERENCES users(id),
  type             VARCHAR(50)  NOT NULL,  -- deposit, withdrawal, bet, win, bonus, adjustment
  amount           DECIMAL(20,8) NOT NULL,
  currency         VARCHAR(10),
  balance_before   DECIMAL(20,8),
  balance_after    DECIMAL(20,8),
  status           VARCHAR(20)  DEFAULT 'pending',  -- pending, completed, failed, cancelled
  provider_id      VARCHAR(50),
  game_id          VARCHAR(100),
  round_id         VARCHAR(100),
  transaction_ref  VARCHAR(255),
  metadata         JSONB,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tx_user_created  ON transactions(user_id, created_at DESC);
CREATE INDEX idx_tx_provider_ref  ON transactions(provider_id, transaction_ref);
CREATE INDEX idx_tx_type          ON transactions(type);

-- ============================================================
-- Game Rounds (Session tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS game_rounds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id    VARCHAR(100) UNIQUE NOT NULL,
  user_id     UUID         REFERENCES users(id),
  game_id     VARCHAR(100) REFERENCES games(id),
  provider_id VARCHAR(50),
  bet_amount  DECIMAL(20,8),
  win_amount  DECIMAL(20,8),
  currency    VARCHAR(10),
  status      VARCHAR(20),  -- active, completed, cancelled
  started_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  ended_at    TIMESTAMP,
  game_data   JSONB
);

CREATE INDEX idx_rounds_user   ON game_rounds(user_id);
CREATE INDEX idx_rounds_game   ON game_rounds(game_id);
CREATE INDEX idx_rounds_status ON game_rounds(status);

-- ============================================================
-- Bet History
-- ============================================================
CREATE TABLE IF NOT EXISTS bet_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id          UUID         REFERENCES game_rounds(id),
  user_id           UUID         REFERENCES users(id),
  game_id           VARCHAR(100),
  bet_amount        DECIMAL(20,8),
  win_amount        DECIMAL(20,8),
  payout_multiplier DECIMAL(10,2),
  transaction_id    UUID         REFERENCES transactions(id),
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bets_user    ON bet_history(user_id, created_at DESC);
CREATE INDEX idx_bets_game    ON bet_history(game_id);

-- ============================================================
-- Bonuses & Promotions
-- ============================================================
CREATE TABLE IF NOT EXISTS bonuses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                  VARCHAR(50) UNIQUE,
  name                  VARCHAR(255),
  description           TEXT,
  bonus_type            VARCHAR(50),   -- welcome, deposit, free_spins, cashback
  bonus_value           DECIMAL(10,2),
  max_bonus             DECIMAL(20,8),
  min_deposit           DECIMAL(20,8),
  wagering_requirements DECIMAL(10,2),
  valid_from            TIMESTAMP,
  valid_to              TIMESTAMP,
  max_uses              INTEGER,
  current_uses          INTEGER      DEFAULT 0,
  game_restrictions     JSONB,
  is_active             BOOLEAN      DEFAULT true,
  created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bonuses_code ON bonuses(code);

-- ============================================================
-- User Bonuses
-- ============================================================
CREATE TABLE IF NOT EXISTS user_bonuses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID         REFERENCES users(id),
  bonus_id              UUID         REFERENCES bonuses(id),
  amount                DECIMAL(20,8),
  wagering_remaining    DECIMAL(20,8),
  wagering_requirement  DECIMAL(20,8),
  status                VARCHAR(20),   -- active, completed, expired, cancelled
  expires_at            TIMESTAMP,
  created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_bonuses_user   ON user_bonuses(user_id);
CREATE INDEX idx_user_bonuses_status ON user_bonuses(status);

-- ============================================================
-- KYC / Documents
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_documents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID         REFERENCES users(id),
  document_type    VARCHAR(50),   -- passport, id_card, drivers_license, proof_of_address
  document_number  VARCHAR(100),
  file_path        TEXT,
  status           VARCHAR(20)  DEFAULT 'pending',  -- pending, verified, rejected
  verified_by      UUID         REFERENCES users(id),
  verified_at      TIMESTAMP,
  rejection_reason TEXT,
  metadata         JSONB,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_user   ON kyc_documents(user_id);
CREATE INDEX idx_kyc_status ON kyc_documents(status);

-- ============================================================
-- Withdrawal Requests
-- ============================================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         REFERENCES users(id),
  amount          DECIMAL(20,8),
  currency        VARCHAR(10),
  payment_method  VARCHAR(50),
  payment_details JSONB,  -- encrypted wallet/card info
  status          VARCHAR(20)  DEFAULT 'pending',  -- pending, approved, processing, completed, rejected
  processed_by    UUID         REFERENCES users(id),
  processed_at    TIMESTAMP,
  transaction_id  UUID         REFERENCES transactions(id),
  notes           TEXT,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_withdrawals_user   ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

-- ============================================================
-- Deposit Records
-- ============================================================
CREATE TABLE IF NOT EXISTS deposits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID         REFERENCES users(id),
  amount           DECIMAL(20,8),
  currency         VARCHAR(10),
  payment_method   VARCHAR(50),
  payment_provider VARCHAR(50),
  transaction_id   VARCHAR(255),
  status           VARCHAR(20)  DEFAULT 'pending',  -- pending, confirmed, failed
  confirmed_at     TIMESTAMP,
  metadata         JSONB,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deposits_user   ON deposits(user_id);
CREATE INDEX idx_deposits_status ON deposits(status);

-- ============================================================
-- Settings & Configuration
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       JSONB        NOT NULL,
  description TEXT,
  updated_by  UUID         REFERENCES users(id),
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (key, value, description) VALUES
  ('maintenance_mode', 'false',                    'Site maintenance mode'),
  ('min_deposit',      '10',                       'Minimum deposit amount USDT'),
  ('max_withdrawal',   '10000',                    'Maximum withdrawal per day USDT'),
  ('kyc_required',     'true',                     'KYC required for withdrawal'),
  ('supported_currencies', '["USDT","BTC","ETH","SOL","BNB"]', 'Supported currencies')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Audit Log (Critical for compliance)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   VARCHAR(100),
  old_value   JSONB,
  new_value   JSONB,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user    ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_action  ON audit_log(action);
CREATE INDEX idx_audit_entity  ON audit_log(entity_type, entity_id);

-- ============================================================
-- Email Logs (for audit)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient   VARCHAR(255),
  subject     VARCHAR(255),
  status      VARCHAR(20),  -- success, failed
  message_id  VARCHAR(255),
  error       TEXT,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Email Verifications
-- ============================================================
CREATE TABLE IF NOT EXISTS email_verifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(100) UNIQUE NOT NULL,
  used       BOOLEAN      DEFAULT false,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Password Resets
-- ============================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID         REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(100) UNIQUE NOT NULL,
  used       BOOLEAN      DEFAULT false,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Update trigger for users.updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_balances_updated_at
  BEFORE UPDATE ON balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
