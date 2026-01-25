-- Users table with all authentication, profile, moderation, and audit fields
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

-- Basic indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- OAuth unique constraint
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_id)
    WHERE oauth_provider IS NOT NULL;

-- Token lookup indexes
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token)
    WHERE email_verification_token IS NOT NULL;
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token)
    WHERE password_reset_token IS NOT NULL;
