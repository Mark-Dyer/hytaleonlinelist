-- Mock data for Hytale Online List
-- This script creates realistic test data including users, servers, tags, reviews, and votes
-- Uses REAL Hytale server IPs from hytale-servers.com for testing server pinging
-- It can run multiple times safely (uses ON CONFLICT DO NOTHING)

-- ============================================
-- OPTIONAL: Uncomment the following line to RESET all seed data on each startup
-- This will delete ALL data from these tables (use with caution!)
-- ============================================
 TRUNCATE admin_actions, server_status_history, votes, reviews, server_tags, servers, refresh_tokens, users CASCADE;


-- ============================================
-- Users (Server Owners and Community Members)
-- ============================================
-- Password for all test users: "password123" (BCrypt hash)
-- $2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW
--
--INSERT INTO users (id, username, email, password_hash, avatar_url, role, email_verified, created_at, updated_at) VALUES
--    ('11111111-1111-1111-1111-111111111111', 'HytaleAdmin', 'admin@hytaleonlinelist.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleAdmin', 'ADMIN', true, NOW() - INTERVAL '365 days', NOW()),
--    ('22222222-2222-2222-2222-222222222222', 'PVPHT_Owner', 'contact@pvpht.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PVPHT', 'USER', true, NOW() - INTERVAL '340 days', NOW()),
--    ('33333333-3333-3333-3333-333333333333', 'EliteHytale', 'owner@elitehytale.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EliteHytale', 'USER', true, NOW() - INTERVAL '320 days', NOW()),
--    ('44444444-4444-4444-4444-444444444444', 'HytownAdmin', 'admin@hytown.org', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hytown', 'USER', true, NOW() - INTERVAL '300 days', NOW()),
--    ('55555555-5555-5555-5555-555555555555', 'HytaleParty', 'support@hytaleparty.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleParty', 'USER', true, NOW() - INTERVAL '280 days', NOW()),
--    ('66666666-6666-6666-6666-666666666666', 'HyloreTeam', 'hello@hylore.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hylore', 'USER', true, NOW() - INTERVAL '260 days', NOW()),
--    ('77777777-7777-7777-7777-777777777777', 'Runeteria', 'team@runeteria.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Runeteria', 'USER', true, NOW() - INTERVAL '240 days', NOW()),
--    ('88888888-8888-8888-8888-888888888888', 'HytaleBox', 'info@hytalebox.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleBox', 'USER', true, NOW() - INTERVAL '220 days', NOW()),
--    ('99999999-9999-9999-9999-999999999999', '2b2h_Admin', 'contact@2b2h.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2b2h', 'USER', true, NOW() - INTERVAL '200 days', NOW()),
--    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dogecraft', 'admin@dogecraft.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dogecraft', 'USER', true, NOW() - INTERVAL '180 days', NOW()),
--    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CozyTale', 'hello@cozytale.us', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CozyTale', 'USER', true, NOW() - INTERVAL '160 days', NOW()),
--    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'HyStrix', 'support@hystrix.gg', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HyStrix', 'USER', true, NOW() - INTERVAL '140 days', NOW()),
--    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Hyspania', 'team@hyspania.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyspania', 'USER', true, NOW() - INTERVAL '120 days', NOW()),
--    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'InterWorld', 'contact@interworld.fun', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=InterWorld', 'USER', true, NOW() - INTERVAL '100 days', NOW()),
--    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'PrimeTale', 'admin@primetale.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PrimeTale', 'USER', true, NOW() - INTERVAL '80 days', NOW()),
--    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'HorizonsSMP', 'horizons@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Horizons', 'USER', true, NOW() - INTERVAL '90 days', NOW()),
--    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'HyFyve', 'hyfyve@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HyFyve', 'USER', true, NOW() - INTERVAL '85 days', NOW()),
--    ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Runefall', 'runefall@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Runefall', 'USER', true, NOW() - INTERVAL '75 days', NOW()),
--    ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'OldStronghold', 'stronghold@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stronghold', 'USER', true, NOW() - INTERVAL '65 days', NOW()),
--    ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Hyfable', 'hyfable@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyfable', 'USER', true, NOW() - INTERVAL '55 days', NOW())
--ON CONFLICT (id) DO NOTHING;