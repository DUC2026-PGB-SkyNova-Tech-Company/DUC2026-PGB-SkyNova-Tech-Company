-- =====================================================
-- SkyNova Tech Company - Bakong Vendor Bot
-- Database Schema Definition
-- =====================================================
-- Description: PostgreSQL database schema for the Telegram-based
--              Bakong payment system with multi-branch support
-- Created: 2026
-- Version: 1.0
-- =====================================================

-- Drop existing tables if they exist (for fresh installation)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- Drop existing ENUM types if they exist
DROP TYPE IF EXISTS verification_status_enum CASCADE;
DROP TYPE IF EXISTS payment_method_enum CASCADE;

-- =====================================================
-- CREATE ENUM TYPES
-- =====================================================

-- Verification status for transactions
CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'failed');

-- Payment method types
CREATE TYPE payment_method_enum AS ENUM ('QR', 'CASH');

-- =====================================================
-- TABLE: branches
-- =====================================================
-- Description: Stores information about different business branches
-- Relationships: 
--   - One-to-Many with transactions
--   - One-to-Many with users (current branch)
-- =====================================================

CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) DEFAULT 'Phnom Penh',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for active branches lookup
CREATE INDEX idx_branches_active ON branches("isActive");

-- =====================================================
-- TABLE: users
-- =====================================================
-- Description: Stores Telegram user information and preferences
-- Relationships: 
--   - Many-to-One with branches (current branch)
--   - One-to-Many with transactions (implicit)
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    "telegramId" BIGINT NOT NULL UNIQUE,
    username VARCHAR(255),
    "firstName" VARCHAR(255),
    "currentBranchId" INTEGER,
    "isAdmin" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_users_branch 
        FOREIGN KEY ("currentBranchId") 
        REFERENCES branches(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Indexes for user lookups
CREATE INDEX idx_users_telegram_id ON users("telegramId");
CREATE INDEX idx_users_current_branch ON users("currentBranchId");
CREATE INDEX idx_users_admin ON users("isAdmin");

-- =====================================================
-- TABLE: transactions
-- =====================================================
-- Description: Stores all payment transaction records
-- Relationships: 
--   - Many-to-One with branches
--   - Many-to-One with users (via userId/telegramId)
-- =====================================================

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'KHR',
    "transactionId" VARCHAR(255) UNIQUE,
    description TEXT,
    "branchId" INTEGER NOT NULL,
    "userId" BIGINT NOT NULL,
    "photoFileId" VARCHAR(255),
    "verificationStatus" verification_status_enum DEFAULT 'pending',
    "paymentMethod" payment_method_enum DEFAULT 'CASH',
    "bakongReference" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_transactions_branch 
        FOREIGN KEY ("branchId") 
        REFERENCES branches(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Indexes for transaction queries and performance
CREATE INDEX idx_transactions_created_at ON transactions("createdAt");
CREATE INDEX idx_transactions_branch_date ON transactions("branchId", "createdAt");
CREATE INDEX idx_transactions_payment_method ON transactions("paymentMethod");
CREATE INDEX idx_transactions_user ON transactions("userId");
CREATE INDEX idx_transactions_status ON transactions("verificationStatus");
CREATE INDEX idx_transactions_currency ON transactions(currency);

-- =====================================================
-- TRIGGER FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

-- Function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to branches table
CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to transactions table
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default branches
INSERT INTO branches (name, location, "isActive") VALUES
    ('SkyNova-Tech-Company A', 'Phnom Penh', true),
    ('SkyNova-Tech-Company B', 'Phnom Penh', true),
    ('SkyNova-Tech-Company C', 'Phnom Penh', true);

-- =====================================================
-- USEFUL VIEWS FOR REPORTING
-- =====================================================

-- View: Daily transaction summary by branch
CREATE OR REPLACE VIEW daily_branch_summary AS
SELECT 
    DATE("createdAt") as transaction_date,
    "branchId",
    b.name as branch_name,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    currency,
    "paymentMethod"
FROM transactions t
JOIN branches b ON t."branchId" = b.id
GROUP BY DATE("createdAt"), "branchId", b.name, currency, "paymentMethod"
ORDER BY transaction_date DESC, "branchId";

-- View: Branch performance overview
CREATE OR REPLACE VIEW branch_performance AS
SELECT 
    b.id as branch_id,
    b.name as branch_name,
    b.location,
    COUNT(t.id) as total_transactions,
    SUM(CASE WHEN t."paymentMethod" = 'QR' THEN 1 ELSE 0 END) as qr_transactions,
    SUM(CASE WHEN t."paymentMethod" = 'CASH' THEN 1 ELSE 0 END) as cash_transactions,
    SUM(t.amount) as total_revenue,
    AVG(t.amount) as average_transaction,
    MAX(t."createdAt") as last_transaction_date
FROM branches b
LEFT JOIN transactions t ON b.id = t."branchId"
WHERE b."isActive" = true
GROUP BY b.id, b.name, b.location;

-- View: User activity summary
CREATE OR REPLACE VIEW user_activity AS
SELECT 
    u."telegramId",
    u.username,
    u."firstName",
    u."isAdmin",
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    MAX(t."createdAt") as last_transaction_date
FROM users u
LEFT JOIN transactions t ON u."telegramId" = t."userId"
GROUP BY u."telegramId", u.username, u."firstName", u."isAdmin";

-- =====================================================
-- GRANT PERMISSIONS (for application user)
-- =====================================================
-- Note: Uncomment and modify if using a specific application user

-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bakong_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO bakong_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO bakong_app_user;

-- =====================================================
-- SCHEMA VERIFICATION QUERIES
-- =====================================================

-- List all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- List all columns in transactions table
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'transactions';

-- List all indexes
-- SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public';

-- List all foreign keys
-- SELECT constraint_name, table_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
