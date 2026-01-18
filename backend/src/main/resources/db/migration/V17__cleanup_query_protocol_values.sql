-- Clean up old query protocol enum values after refactoring
-- SIMPLE_QUERY was removed (Minecraft protocol, not applicable to Hytale)
-- BASIC_UDP was renamed to BASIC_PING (more accurate name)

-- Update any existing SIMPLE_QUERY values to FAILED (as it wouldn't have actually worked)
UPDATE server_status_history
SET query_protocol = 'FAILED'
WHERE query_protocol = 'SIMPLE_QUERY';

UPDATE servers
SET preferred_query_protocol = NULL
WHERE preferred_query_protocol = 'SIMPLE_QUERY';

-- Rename BASIC_UDP to BASIC_PING
UPDATE server_status_history
SET query_protocol = 'BASIC_PING'
WHERE query_protocol = 'BASIC_UDP';

UPDATE servers
SET preferred_query_protocol = 'BASIC_PING'
WHERE preferred_query_protocol = 'BASIC_UDP';
