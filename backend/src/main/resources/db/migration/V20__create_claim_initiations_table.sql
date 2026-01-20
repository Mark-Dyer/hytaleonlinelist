-- Create server_claim_initiations table for tracking concurrent claims
-- This allows multiple users to attempt claiming the same server simultaneously
-- First user to successfully verify becomes the owner

CREATE TABLE server_claim_initiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID NOT NULL,
    user_id UUID NOT NULL,
    verification_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    initiated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_claim_init_server FOREIGN KEY (server_id)
        REFERENCES servers(id) ON DELETE CASCADE,
    CONSTRAINT fk_claim_init_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_claim_init_server_user UNIQUE (server_id, user_id)
);

-- Create indexes for common queries
CREATE INDEX idx_claim_init_server_id ON server_claim_initiations(server_id);
CREATE INDEX idx_claim_init_user_id ON server_claim_initiations(user_id);
CREATE INDEX idx_claim_init_status ON server_claim_initiations(status);
CREATE INDEX idx_claim_init_expires_at ON server_claim_initiations(expires_at);
CREATE INDEX idx_claim_init_status_expires ON server_claim_initiations(status, expires_at);

-- Add comments for documentation
COMMENT ON TABLE server_claim_initiations IS 'Tracks server claim attempts by users. Multiple users can claim simultaneously; first to verify wins.';
COMMENT ON COLUMN server_claim_initiations.status IS 'PENDING, VERIFIED, EXPIRED, CANCELLED, CLAIMED_BY_OTHER';
