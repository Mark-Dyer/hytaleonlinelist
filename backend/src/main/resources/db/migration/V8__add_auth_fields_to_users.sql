-- Add authentication fields to users table
ALTER TABLE users
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER',
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN oauth_provider VARCHAR(20),
    ADD COLUMN oauth_id VARCHAR(255),
    ADD COLUMN email_verification_token VARCHAR(255),
    ADD COLUMN email_verification_token_expiry TIMESTAMP WITH TIME ZONE,
    ADD COLUMN password_reset_token VARCHAR(255),
    ADD COLUMN password_reset_token_expiry TIMESTAMP WITH TIME ZONE;

-- Make password_hash nullable for OAuth users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add unique constraint for OAuth users
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_id)
    WHERE oauth_provider IS NOT NULL;

-- Add index for email verification token lookups
CREATE INDEX idx_users_email_verification_token ON users(email_verification_token)
    WHERE email_verification_token IS NOT NULL;

-- Add index for password reset token lookups
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token)
    WHERE password_reset_token IS NOT NULL;
