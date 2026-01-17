-- Add review statistics fields to servers table
ALTER TABLE servers ADD COLUMN review_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE servers ADD COLUMN average_rating DECIMAL(2,1) DEFAULT NULL;
