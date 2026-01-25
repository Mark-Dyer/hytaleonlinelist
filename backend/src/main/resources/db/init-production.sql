-- ============================================================================
-- Hytale Online List - Production Database Initialization Script
-- ============================================================================
-- This script combines all Flyway migrations (V1-V12) into a single file
-- for initial production database setup.
--
-- Usage:
--   psql -h <host> -U <user> -d <database> -f init-production.sql
--
-- Or via Docker:
--   docker exec -i <container> psql -U <user> -d <database> < init-production.sql
--
-- IMPORTANT: This script should only be run on a fresh database.
--            For existing databases, use Flyway migrations instead.
--
-- Generated from migrations: V1 through V12
-- Last updated: 2026-01-24
-- ============================================================================

-- ============================================================================
-- V1: Users Table
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),  -- Nullable for OAuth users
    avatar_url VARCHAR(500),
    bio TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    oauth_provider VARCHAR(20),
    oauth_id VARCHAR(255),
    email_verification_token VARCHAR(255),
    email_verification_token_expiry TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_token_expiry TIMESTAMP WITH TIME ZONE,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    banned_at TIMESTAMP WITH TIME ZONE,
    banned_reason TEXT,

    -- Audit and security fields
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_active_at TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(45),  -- Supports IPv6
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_password_change_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_id)
    WHERE oauth_provider IS NOT NULL;
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token)
    WHERE email_verification_token IS NOT NULL;
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token)
    WHERE password_reset_token IS NOT NULL;

-- ============================================================================
-- V2: Categories Table
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================================================
-- V3: Servers Table
-- ============================================================================
CREATE TABLE servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    ip_address VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL DEFAULT 5520,
    short_description VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    banner_url VARCHAR(500),
    icon_url VARCHAR(500),
    website_url VARCHAR(500),
    discord_url VARCHAR(500),
    category_id UUID NOT NULL REFERENCES categories(id),
    version VARCHAR(20) NOT NULL,

    -- Status fields (nullable player_count to distinguish 0 from unknown)
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    player_count INTEGER,  -- NULL = unknown (QUIC/BasicPing), number = confirmed
    max_players INTEGER,
    uptime_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    last_pinged_at TIMESTAMP WITH TIME ZONE,
    preferred_query_protocol VARCHAR(20),
    query_port INTEGER,

    -- Engagement metrics
    vote_count INTEGER NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(2,1),

    -- Flags
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Ownership and claiming (owner_id nullable for unclaimed servers)
    owner_id UUID REFERENCES users(id),
    claim_token VARCHAR(20),
    claim_token_expiry TIMESTAMP WITH TIME ZONE,
    verification_method VARCHAR(20),
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_category_id ON servers(category_id);
CREATE INDEX idx_servers_owner_id ON servers(owner_id);
CREATE INDEX idx_servers_is_featured ON servers(is_featured);
CREATE INDEX idx_servers_is_online ON servers(is_online);
CREATE INDEX idx_servers_vote_count ON servers(vote_count DESC);
CREATE INDEX idx_servers_player_count ON servers(player_count DESC);
CREATE INDEX idx_servers_created_at ON servers(created_at DESC);
CREATE INDEX idx_servers_last_pinged_at ON servers(last_pinged_at NULLS FIRST);
CREATE INDEX idx_servers_claim_token ON servers(claim_token) WHERE claim_token IS NOT NULL;

COMMENT ON COLUMN servers.player_count IS 'NULL = unknown (QUIC/BasicPing only check connectivity), number = confirmed count from HyQuery/Nitrado';
COMMENT ON COLUMN servers.verification_method IS 'Method used to verify ownership: MOTD, DNS_TXT, FILE_UPLOAD, EMAIL';

-- ============================================================================
-- V4: Server Tags Table
-- ============================================================================
CREATE TABLE server_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);

CREATE INDEX idx_server_tags_server_id ON server_tags(server_id);
CREATE INDEX idx_server_tags_tag ON server_tags(tag);

-- ============================================================================
-- V5: Reviews Table
-- ============================================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_reviews_server_user UNIQUE (server_id, user_id)
);

CREATE INDEX idx_reviews_server_id ON reviews(server_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================================================
-- V6: Votes Table
-- ============================================================================
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uk_votes_server_user_date UNIQUE (server_id, user_id, vote_date)
);

CREATE INDEX idx_votes_server_id ON votes(server_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_voted_at ON votes(voted_at DESC);

-- ============================================================================
-- V7: Seed Categories
-- ============================================================================
INSERT INTO categories (id, name, slug, description, icon) VALUES
    (gen_random_uuid(), 'Survival', 'survival', 'Classic survival gameplay with resource gathering and building', 'shield'),
    (gen_random_uuid(), 'PvP', 'pvp', 'Player versus player combat servers', 'swords'),
    (gen_random_uuid(), 'Creative', 'creative', 'Building and creativity focused servers', 'brush'),
    (gen_random_uuid(), 'RPG', 'rpg', 'Role-playing game servers with quests and storylines', 'scroll'),
    (gen_random_uuid(), 'Minigames', 'minigames', 'Various mini-games and competitive modes', 'gamepad'),
    (gen_random_uuid(), 'Adventure', 'adventure', 'Story-driven adventure and exploration', 'map'),
    (gen_random_uuid(), 'Modded', 'modded', 'Servers with custom modifications and plugins', 'puzzle');

-- ============================================================================
-- V8: Refresh Tokens Table
-- ============================================================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================================================
-- V9: Admin Actions Table (Audit Log)
-- ============================================================================
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    target_id UUID NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- ============================================================================
-- V10: Server Status History Table
-- ============================================================================
CREATE TABLE server_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    is_online BOOLEAN NOT NULL,
    player_count INTEGER,  -- NULL = unknown (QUIC/BasicPing), number = confirmed
    max_players INTEGER,
    response_time_ms INTEGER,
    query_protocol VARCHAR(20),
    error_message VARCHAR(255),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_history_server_id ON server_status_history(server_id);
CREATE INDEX idx_status_history_recorded_at ON server_status_history(recorded_at DESC);
CREATE INDEX idx_status_history_server_recorded ON server_status_history(server_id, recorded_at DESC);

COMMENT ON COLUMN server_status_history.player_count IS 'NULL = unknown (QUIC/BasicPing only check connectivity), number = confirmed count';

-- ============================================================================
-- V11: Server Claim Attempts Table
-- ============================================================================
CREATE TABLE server_claim_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_method VARCHAR(20) NOT NULL,
    is_successful BOOLEAN NOT NULL DEFAULT FALSE,
    failure_reason VARCHAR(255),
    ip_address VARCHAR(45),
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_claim_attempts_server_id ON server_claim_attempts(server_id);
CREATE INDEX idx_claim_attempts_user_id ON server_claim_attempts(user_id);
CREATE INDEX idx_claim_attempts_attempted_at ON server_claim_attempts(attempted_at DESC);

-- ============================================================================
-- V12: Server Claim Initiations Table
-- ============================================================================
CREATE TABLE server_claim_initiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    initiated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_claim_init_server_user UNIQUE (server_id, user_id)
);

CREATE INDEX idx_claim_init_server_id ON server_claim_initiations(server_id);
CREATE INDEX idx_claim_init_user_id ON server_claim_initiations(user_id);
CREATE INDEX idx_claim_init_status ON server_claim_initiations(status);
CREATE INDEX idx_claim_init_expires_at ON server_claim_initiations(expires_at);
CREATE INDEX idx_claim_init_status_expires ON server_claim_initiations(status, expires_at);

COMMENT ON TABLE server_claim_initiations IS 'Tracks server claim attempts by users. Multiple users can claim simultaneously; first to verify wins.';
COMMENT ON COLUMN server_claim_initiations.status IS 'PENDING, VERIFIED, EXPIRED, CANCELLED, CLAIMED_BY_OTHER';