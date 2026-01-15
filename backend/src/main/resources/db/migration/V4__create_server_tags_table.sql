CREATE TABLE server_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);

CREATE INDEX idx_server_tags_server_id ON server_tags(server_id);
CREATE INDEX idx_server_tags_tag ON server_tags(tag);
