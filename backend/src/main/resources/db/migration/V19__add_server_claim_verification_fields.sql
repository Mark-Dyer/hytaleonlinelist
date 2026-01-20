-- Add claim and verification fields to servers table
-- This supports both claiming scraped servers and verifying ownership of any server

-- Make owner_id nullable for unclaimed/scraped servers
ALTER TABLE servers ALTER COLUMN owner_id DROP NOT NULL;

-- Add claim/verification related columns
ALTER TABLE servers ADD COLUMN claim_token VARCHAR(20);
ALTER TABLE servers ADD COLUMN claim_token_expiry TIMESTAMP WITH TIME ZONE;
ALTER TABLE servers ADD COLUMN verification_method VARCHAR(20);
ALTER TABLE servers ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;

-- Create index for claim token lookups
CREATE INDEX idx_servers_claim_token ON servers(claim_token) WHERE claim_token IS NOT NULL;

-- Create table to track claim attempts (for rate limiting and security)
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

-- Add comment explaining the verification methods
COMMENT ON COLUMN servers.verification_method IS 'Method used to verify ownership: MOTD, DNS_TXT, FILE_UPLOAD, EMAIL';
