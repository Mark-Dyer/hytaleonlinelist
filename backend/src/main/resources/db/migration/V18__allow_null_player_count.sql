-- Allow NULL for player_count to distinguish between:
-- - 0 = confirmed zero players (from HyQuery/Nitrado)
-- - NULL = unknown player count (from QUIC/BasicPing which only check connectivity)

-- Update servers table
ALTER TABLE servers ALTER COLUMN player_count DROP NOT NULL;
ALTER TABLE servers ALTER COLUMN max_players DROP NOT NULL;

-- Update server_status_history table
ALTER TABLE server_status_history ALTER COLUMN player_count DROP NOT NULL;
