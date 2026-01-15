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
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    player_count INTEGER NOT NULL DEFAULT 0,
    max_players INTEGER NOT NULL DEFAULT 100,
    uptime_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    vote_count INTEGER NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_pinged_at TIMESTAMP WITH TIME ZONE,
    owner_id UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_category_id ON servers(category_id);
CREATE INDEX idx_servers_owner_id ON servers(owner_id);
CREATE INDEX idx_servers_is_featured ON servers(is_featured);
CREATE INDEX idx_servers_is_online ON servers(is_online);
CREATE INDEX idx_servers_vote_count ON servers(vote_count DESC);
CREATE INDEX idx_servers_player_count ON servers(player_count DESC);
CREATE INDEX idx_servers_created_at ON servers(created_at DESC);
