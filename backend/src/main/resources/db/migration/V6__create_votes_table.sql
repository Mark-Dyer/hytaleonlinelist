CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uk_votes_server_user_date UNIQUE (server_id, user_id, vote_date)
);

CREATE INDEX idx_votes_server_id ON votes(server_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_voted_at ON votes(voted_at DESC);
