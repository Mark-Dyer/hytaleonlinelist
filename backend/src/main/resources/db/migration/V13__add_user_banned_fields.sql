-- Add ban-related fields to users table
ALTER TABLE users ADD COLUMN is_banned BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN banned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN banned_reason TEXT;
