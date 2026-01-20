-- Server claim attempts table for tracking verification attempts (rate limiting and security)
CREATE TABLE server_claim_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_method VARCHAR(20) NOT NULL,
    is_successful BOOLEAN NOT NULL DEFAULT FALSE,
    failure_reason VARCHAR(255),
    ip_address VARCHAR(45),
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_claim_attempts_server_id ON server_claim_attempts(server_id);
CREATE INDEX idx_claim_attempts_user_id ON server_claim_attempts(user_id);
CREATE INDEX idx_claim_attempts_attempted_at ON server_claim_attempts(attempted_at DESC);
