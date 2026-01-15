-- Fix server_tags.tag column type from bytea to varchar
-- This can happen if the column was created with incorrect type

-- First, check if the column is bytea and convert if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'server_tags'
        AND column_name = 'tag'
        AND data_type = 'bytea'
    ) THEN
        -- Convert bytea to varchar
        ALTER TABLE server_tags
        ALTER COLUMN tag TYPE VARCHAR(50)
        USING convert_from(tag, 'UTF8');
    END IF;
END $$;
