-- Server status history for tracking ping results over time
CREATE TABLE server_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    is_online BOOLEAN NOT NULL,
    player_count INTEGER NOT NULL DEFAULT 0,
    max_players INTEGER,
    response_time_ms INTEGER,
    query_protocol VARCHAR(20),
    error_message VARCHAR(255),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_status_history_server_id ON server_status_history(server_id);
CREATE INDEX idx_status_history_recorded_at ON server_status_history(recorded_at DESC);
CREATE INDEX idx_status_history_server_recorded ON server_status_history(server_id, recorded_at DESC);

-- Add preferred_query_protocol to servers table to cache which protocol works
ALTER TABLE servers ADD COLUMN preferred_query_protocol VARCHAR(20);

-- Add query_port for servers that use non-default query ports
ALTER TABLE servers ADD COLUMN query_port INTEGER;

-- Index for batch processing (find servers needing ping)
CREATE INDEX idx_servers_last_pinged_at ON servers(last_pinged_at NULLS FIRST);
