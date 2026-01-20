-- Servers table with all fields including status monitoring and claiming
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

-- Basic indexes
CREATE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_category_id ON servers(category_id);
CREATE INDEX idx_servers_owner_id ON servers(owner_id);

-- Feature and status indexes
CREATE INDEX idx_servers_is_featured ON servers(is_featured);
CREATE INDEX idx_servers_is_online ON servers(is_online);

-- Sorting indexes
CREATE INDEX idx_servers_vote_count ON servers(vote_count DESC);
CREATE INDEX idx_servers_player_count ON servers(player_count DESC);
CREATE INDEX idx_servers_created_at ON servers(created_at DESC);

-- Status monitoring index (for batch processing)
CREATE INDEX idx_servers_last_pinged_at ON servers(last_pinged_at NULLS FIRST);

-- Claim token lookup index
CREATE INDEX idx_servers_claim_token ON servers(claim_token) WHERE claim_token IS NOT NULL;

-- Comments
COMMENT ON COLUMN servers.player_count IS 'NULL = unknown (QUIC/BasicPing only check connectivity), number = confirmed count from HyQuery/Nitrado';
COMMENT ON COLUMN servers.verification_method IS 'Method used to verify ownership: MOTD, DNS_TXT, FILE_UPLOAD, EMAIL';
