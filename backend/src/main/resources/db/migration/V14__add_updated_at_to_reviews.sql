-- Add updated_at column to reviews table for edit tracking
ALTER TABLE reviews ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
