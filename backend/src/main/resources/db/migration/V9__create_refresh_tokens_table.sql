-- Create refresh tokens table for JWT refresh token storage
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for token lookups
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Index for user lookups (to revoke all tokens for a user)
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Index for cleanup of expired tokens
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
