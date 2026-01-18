-- Mock data for Hytale Online List
-- This script creates realistic test data including users, servers, tags, reviews, and votes
-- Uses REAL Hytale server IPs from hytale-servers.com for testing server pinging
-- It can run multiple times safely (uses ON CONFLICT DO NOTHING)

-- ============================================
-- OPTIONAL: Uncomment the following line to RESET all seed data on each startup
-- This will delete ALL data from these tables (use with caution!)
-- ============================================
 TRUNCATE server_status_history, votes, reviews, server_tags, servers, refresh_tokens, users CASCADE;

-- ============================================
-- Users (Server Owners and Community Members)
-- ============================================
-- Password for all test users: "password123" (BCrypt hash)
-- $2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW

INSERT INTO users (id, username, email, password_hash, avatar_url, role, email_verified, created_at, updated_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'HytaleAdmin', 'admin@hytaleonlinelist.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleAdmin', 'ADMIN', true, NOW() - INTERVAL '365 days', NOW()),
    ('22222222-2222-2222-2222-222222222222', 'PVPHT_Owner', 'contact@pvpht.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PVPHT', 'USER', true, NOW() - INTERVAL '340 days', NOW()),
    ('33333333-3333-3333-3333-333333333333', 'EliteHytale', 'owner@elitehytale.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EliteHytale', 'USER', true, NOW() - INTERVAL '320 days', NOW()),
    ('44444444-4444-4444-4444-444444444444', 'HytownAdmin', 'admin@hytown.org', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hytown', 'USER', true, NOW() - INTERVAL '300 days', NOW()),
    ('55555555-5555-5555-5555-555555555555', 'HytaleParty', 'support@hytaleparty.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleParty', 'USER', true, NOW() - INTERVAL '280 days', NOW()),
    ('66666666-6666-6666-6666-666666666666', 'HyloreTeam', 'hello@hylore.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hylore', 'USER', true, NOW() - INTERVAL '260 days', NOW()),
    ('77777777-7777-7777-7777-777777777777', 'Runeteria', 'team@runeteria.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Runeteria', 'USER', true, NOW() - INTERVAL '240 days', NOW()),
    ('88888888-8888-8888-8888-888888888888', 'HytaleBox', 'info@hytalebox.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleBox', 'USER', true, NOW() - INTERVAL '220 days', NOW()),
    ('99999999-9999-9999-9999-999999999999', '2b2h_Admin', 'contact@2b2h.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2b2h', 'USER', true, NOW() - INTERVAL '200 days', NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dogecraft', 'admin@dogecraft.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dogecraft', 'USER', true, NOW() - INTERVAL '180 days', NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CozyTale', 'hello@cozytale.us', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CozyTale', 'USER', true, NOW() - INTERVAL '160 days', NOW()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'HyStrix', 'support@hystrix.gg', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HyStrix', 'USER', true, NOW() - INTERVAL '140 days', NOW()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Hyspania', 'team@hyspania.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyspania', 'USER', true, NOW() - INTERVAL '120 days', NOW()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'InterWorld', 'contact@interworld.fun', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=InterWorld', 'USER', true, NOW() - INTERVAL '100 days', NOW()),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'PrimeTale', 'admin@primetale.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PrimeTale', 'USER', true, NOW() - INTERVAL '80 days', NOW()),
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'HorizonsSMP', 'horizons@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Horizons', 'USER', true, NOW() - INTERVAL '90 days', NOW()),
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'HyFyve', 'hyfyve@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HyFyve', 'USER', true, NOW() - INTERVAL '85 days', NOW()),
    ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Runefall', 'runefall@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Runefall', 'USER', true, NOW() - INTERVAL '75 days', NOW()),
    ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'OldStronghold', 'stronghold@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stronghold', 'USER', true, NOW() - INTERVAL '65 days', NOW()),
    ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Hyfable', 'hyfable@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hyfable', 'USER', true, NOW() - INTERVAL '55 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Servers (REAL Hytale server IPs from hytale-servers.com)
-- Server status is set to unknown (is_online = false, player_count = 0)
-- The scheduler will ping these and update with real data
-- ============================================

-- PvP Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000001', 'PVPHT', 'pvpht', 'play.pvpht.com', 5520, 'Premier Hytale PvP server with competitive gameplay',
'# Welcome to PVPHT!

The premier PvP destination for Hytale players.

## Game Modes
- **Ranked Duels** - Climb the competitive ladder
- **Team Battles** - 2v2, 3v3, and 4v4 matches
- **Free-for-All** - Last player standing wins

## Features
- Custom combat mechanics
- Anti-cheat protection
- Active tournaments
- Friendly community

Join the battle today!',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=pvpht', 'https://pvpht.com', 'https://discord.gg/pvpht', id, '1.0.0', false, 0, 100, 0.0, 15231, 58450, true, true, NOW() - INTERVAL '340 days', NULL, '22222222-2222-2222-2222-222222222222', NULL, NULL
FROM categories WHERE slug = 'pvp'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000002', 'EliteHytale PvP', 'elitehytale-pvp', 'play.elitehytale.com', 5520, 'No lag PvP with active staff and competitive matches',
'# EliteHytale PvP - No LAG, Active Staff

Experience smooth PvP combat on our optimized servers.

## What We Offer
- **Zero Lag** - Optimized infrastructure for smooth gameplay
- **Active Staff** - 24/7 moderation and support
- **Fair Play** - Advanced anti-cheat systems
- **Competitive Ranking** - ELO-based matchmaking

## Game Modes
- 1v1 Ranked
- Team Deathmatch
- Capture the Flag
- King of the Hill

Join our elite community!',
'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=elitehytale', 'https://elitehytale.com', 'https://discord.gg/elitehytale', id, '1.0.0', false, 0, 200, 0.0, 12847, 45230, true, true, NOW() - INTERVAL '320 days', NULL, '33333333-3333-3333-3333-333333333333', NULL, NULL
FROM categories WHERE slug = 'pvp'
ON CONFLICT (id) DO NOTHING;

-- Survival Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000003', 'Hytown', 'hytown', 'play.hytown.org', 5520, 'Friendly survival town-building server with economy',
'# Welcome to Hytown!

Build your dream town in our survival world.

## Features
- **Town System** - Create and manage your own town
- **Economy** - Player-driven marketplace
- **Land Claiming** - Protect your builds
- **Jobs** - Earn money through various professions

## Community
- Friendly players
- Helpful staff
- Regular events
- Build competitions

Start your town today!',
'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hytown', 'https://hytown.org', 'https://discord.gg/hytown', id, '1.0.0', false, 0, 150, 0.0, 8934, 32100, false, true, NOW() - INTERVAL '300 days', NULL, '44444444-4444-4444-4444-444444444444', NULL, NULL
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000004', 'Horizons SMP', 'horizons-smp', 'play.horizonssmp.com', 5520, 'Semi-vanilla survival with quality of life features',
'# Horizons SMP

The perfect balance between vanilla and enhanced gameplay.

## Quality of Life
- /home and /spawn commands
- Player shops
- Teleportation requests
- Keep inventory

## Community Focus
- Mature community
- No griefing policy
- Regular community events
- Active Discord

Join our growing family!',
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=horizons', 'https://horizonssmp.com', 'https://discord.gg/horizons', id, '1.0.0', false, 0, 100, 0.0, 5621, 18900, false, true, NOW() - INTERVAL '90 days', NULL, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', NULL, NULL
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000005', '2B2H', '2b2h', '2b2h.net', 5520, 'Anarchy survival - no rules, no resets',
'# 2B2H - Anarchy Survival

The oldest anarchy server in Hytale. No rules, no resets.

## What is Anarchy?
- No rules (except no hacking)
- No map resets ever
- No admin interference
- Pure survival chaos

## History
- World started on day one
- Massive bases and builds
- Rich player history
- Legendary events

Join at your own risk!',
'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=2b2h', NULL, 'https://discord.gg/2b2h', id, '1.0.0', false, 0, 500, 0.0, 21567, 67800, true, false, NOW() - INTERVAL '200 days', NULL, '99999999-9999-9999-9999-999999999999', NULL, NULL
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

-- Minigames Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000006', 'Hytale Party', 'hytale-party', 'play.hytaleparty.com', 5520, 'PvP minigames server with tons of game modes',
'# Hytale Party - PVP Minigames Server

Non-stop minigames action!

## Game Modes
- Bed Wars
- Sky Wars
- Murder Mystery
- TNT Run
- Parkour
- And more!

## Features
- Quick queue times
- Custom maps
- Cross-game leveling
- Daily challenges

Join the party!',
'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hytaleparty', 'https://hytaleparty.com', 'https://discord.gg/hytaleparty', id, '1.0.0', false, 0, 500, 0.0, 34521, 112300, true, true, NOW() - INTERVAL '280 days', NULL, '55555555-5555-5555-5555-555555555555', NULL, NULL
FROM categories WHERE slug = 'minigames'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000007', 'CozyTale', 'cozytale', 'cozytale.us', 5520, 'KitPVP, minigames and more in a cozy atmosphere',
'# CozyTale | KitPVP | and more

A cozy place for all your gaming needs.

## Featured Modes
- **KitPVP** - Choose your kit and battle
- **Parkour** - Challenge yourself
- **Duels** - 1v1 combat
- **Events** - Weekly special games

## Community
- Friendly atmosphere
- Helpful staff
- Regular updates
- Fun events

Get cozy with us!',
'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=cozytale', 'https://cozytale.us', 'https://discord.gg/cozytale', id, '1.0.0', false, 0, 150, 0.0, 12890, 45600, false, true, NOW() - INTERVAL '160 days', NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, NULL
FROM categories WHERE slug = 'minigames'
ON CONFLICT (id) DO NOTHING;

-- RPG Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000008', 'Hylore', 'hylore', 'play.hylore.com', 5520, 'Full MMORPG experience with classes, quests and dungeons',
'# Hylore - MMORPG Adventure

The most ambitious RPG server for Hytale.

## Classes
- **Warrior** - Tank and melee DPS
- **Mage** - Ranged magic damage
- **Ranger** - Agile ranged attacks
- **Healer** - Support and healing

## Content
- Epic main storyline
- Challenging dungeons
- World bosses
- Daily quests
- Guild system

Your legend begins here!',
'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hylore', 'https://hylore.com', 'https://discord.gg/hylore', id, '1.0.0', false, 0, 300, 0.0, 28432, 145600, true, true, NOW() - INTERVAL '260 days', NULL, '66666666-6666-6666-6666-666666666666', NULL, NULL
FROM categories WHERE slug = 'rpg'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000009', 'Runeteria', 'runeteria', 'play.runeteria.com', 5520, 'Fantasy RPG with unique lore and storylines',
'# Runeteria - A World of Fantasy

Immerse yourself in our custom fantasy world.

## The World
- Rich original lore
- Diverse biomes
- Hidden secrets
- Dynamic events

## Gameplay
- Custom skill trees
- Crafting system
- NPC factions
- Player housing

Discover Runeteria!',
'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=runeteria', 'https://runeteria.com', 'https://discord.gg/runeteria', id, '1.0.0', false, 0, 200, 0.0, 19156, 73400, false, true, NOW() - INTERVAL '240 days', NULL, '77777777-7777-7777-7777-777777777777', NULL, NULL
FROM categories WHERE slug = 'rpg'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000010', 'Runefall', 'runefall', 'play.runefall.net', 5520, 'Action RPG with procedural dungeons and raids',
'# Runefall.net - Action RPG

Fast-paced action RPG gameplay.

## Combat System
- Real-time combat
- Combo system
- Dodging and blocking
- Skill-based gameplay

## Content
- Procedural dungeons
- Boss raids
- Rare loot
- Leaderboards

Master the Runefall!',
'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=runefall', 'https://runefall.net', 'https://discord.gg/runefall', id, '1.0.0', false, 0, 150, 0.0, 12345, 45600, false, true, NOW() - INTERVAL '75 days', NULL, 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NULL, NULL
FROM categories WHERE slug = 'rpg'
ON CONFLICT (id) DO NOTHING;

-- Creative Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000011', 'Hytale Box', 'hytale-box', 'play.hytalebox.com', 5520, 'Creative sandbox with building tools and showcases',
'# Hytale Box - Creative Sandbox

Unleash your creativity!

## Tools Available
- WorldEdit for all players
- Custom brushes
- Schematics library
- Unlimited resources

## Features
- Personal plot worlds
- Build showcases
- Community voting
- Build competitions

Create something amazing!',
'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hytalebox', 'https://hytalebox.com', 'https://discord.gg/hytalebox', id, '1.0.0', false, 0, 200, 0.0, 18765, 67800, false, true, NOW() - INTERVAL '220 days', NULL, '88888888-8888-8888-8888-888888888888', NULL, NULL
FROM categories WHERE slug = 'creative'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000012', 'HyStrix', 'hystrix', 'hystrix.gg', 5520, 'Competitive creative building with themed challenges',
'# HyStrix - Competitive Creative

Where builders compete!

## Competitions
- Speed builds
- Theme challenges
- Team projects
- Grand championships

## Rewards
- Build of the Week
- Hall of Fame
- Exclusive titles
- Prize pool events

Show your skills!',
'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hystrix', 'https://hystrix.gg', 'https://discord.gg/hystrix', id, '1.0.0', false, 0, 100, 0.0, 9876, 34500, false, true, NOW() - INTERVAL '140 days', NULL, 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, NULL
FROM categories WHERE slug = 'creative'
ON CONFLICT (id) DO NOTHING;

-- Adventure Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000013', 'Dogecraft', 'dogecraft', 'play.dogecraft.net', 5520, 'Adventure maps and exploration with custom storylines',
'# Dogecraft - Adventure Awaits

Explore handcrafted adventures!

## Adventure Maps
- 30+ custom maps
- Story campaigns
- Puzzle challenges
- Boss battles

## Exploration
- Hidden treasures
- Secret areas
- Lore discoveries
- Achievement system

Start your adventure!',
'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=dogecraft', 'https://dogecraft.net', 'https://discord.gg/dogecraft', id, '1.0.0', false, 0, 250, 0.0, 15678, 52300, false, true, NOW() - INTERVAL '180 days', NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, NULL
FROM categories WHERE slug = 'adventure'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000014', 'Hyfable', 'hyfable', 'play.hyfable.com', 5520, 'Story-driven adventure with branching narratives',
'# Hyfable - Choose Your Story

Every choice matters.

## Storylines
- Branching narratives
- Multiple endings
- Character relationships
- Moral choices

## Features
- Voice-acted cutscenes
- Custom cinematics
- Save progression
- Replayability

Write your own fable!',
'https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hyfable', 'https://hyfable.com', 'https://discord.gg/hyfable', id, '1.0.0', false, 0, 100, 0.0, 8765, 31200, false, true, NOW() - INTERVAL '55 days', NULL, 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', NULL, NULL
FROM categories WHERE slug = 'adventure'
ON CONFLICT (id) DO NOTHING;

-- Modded Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000015', 'HyFyve', 'hyfyve', 'play.hyfyve.net', 5520, 'Tech modpack with automation and engineering',
'# HyFyve - Tech Modded Server

Engineer your world!

## Mod Features
- Industrial machines
- Automation systems
- Power generation
- Logistics networks

## Content
- Custom questbook
- Progression system
- Multiplayer factories
- Shared resources

Automate everything!',
'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hyfyve', 'https://hyfyve.net', 'https://discord.gg/hyfyve', id, '1.0.0', false, 0, 100, 0.0, 11234, 42100, false, true, NOW() - INTERVAL '85 days', NULL, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', NULL, NULL
FROM categories WHERE slug = 'modded'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000016', 'Old Stronghold', 'old-stronghold', 'play.oldstronghold.nl', 5520, 'Classic modded gameplay with medieval tech',
'# Old Stronghold - Medieval Tech

Return to simpler times.

## Theme
- Medieval setting
- Period-appropriate tech
- Castle building
- Feudal system

## Mods
- Blacksmithing
- Agriculture
- Siege weapons
- Trading routes

Build your stronghold!',
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=oldstronghold', 'https://oldstronghold.nl', 'https://discord.gg/oldstronghold', id, '1.0.0', false, 0, 80, 0.0, 7654, 28900, false, true, NOW() - INTERVAL '65 days', NULL, 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', NULL, NULL
FROM categories WHERE slug = 'modded'
ON CONFLICT (id) DO NOTHING;

-- International Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000017', 'Hyspania', 'hyspania', 'jugar.hyspania.net', 5520, 'Spanish-speaking community survival server',
'# Hyspania - Comunidad Hispana

El servidor de Hytale para hispanohablantes.

## Características
- Comunidad hispanohablante
- Supervivencia con economía
- Eventos semanales
- Staff activo

## Modos de Juego
- Survival
- Minijuegos
- Eventos especiales

¡Únete a nuestra comunidad!',
'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=hyspania', 'https://hyspania.net', 'https://discord.gg/hyspania', id, '1.0.0', false, 0, 150, 0.0, 9876, 38700, false, true, NOW() - INTERVAL '120 days', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, NULL
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000018', 'Inter World [RU]', 'inter-world-ru', 'play.interworld.fun', 5520, 'Russian Hytale community with survival and minigames',
'# Inter World | Hytale | IW

Русскоязычный сервер Hytale.

## Особенности
- Русскоязычное сообщество
- Выживание с экономикой
- Мини-игры
- Активная администрация

## Режимы
- Выживание
- PvP арены
- Эвенты

Присоединяйся к нам!',
'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=interworld', 'https://interworld.fun', 'https://discord.gg/interworld', id, '1.0.0', false, 0, 200, 0.0, 8765, 34500, false, true, NOW() - INTERVAL '100 days', NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, NULL
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id, preferred_query_protocol, query_port)
SELECT '10000000-0000-0000-0000-000000000019', 'PrimeTale', 'primetale', 'primetale.net', 5520, 'Premium gaming experience with multiple game modes',
'# PrimeTale - Premium Gaming

The ultimate Hytale experience.

## Game Modes
- Survival
- SkyBlock
- Factions
- Minigames

## Premium Features
- Low latency
- Custom plugins
- Regular updates
- Dedicated support

Experience the prime!',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=primetale', 'https://primetale.net', 'https://discord.gg/primetale', id, '1.0.0', false, 0, 300, 0.0, 14567, 56700, true, true, NOW() - INTERVAL '80 days', NULL, 'ffffffff-ffff-ffff-ffff-ffffffffffff', NULL, NULL
FROM categories WHERE slug = 'minigames'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Server Tags
-- ============================================
INSERT INTO server_tags (id, server_id, tag) VALUES
-- PVPHT
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'pvp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'competitive'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'ranked'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'tournaments'),
-- EliteHytale
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'pvp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'no-lag'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'active-staff'),
-- Hytown
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'survival'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'economy'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'towns'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'friendly'),
-- Horizons SMP
(gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'smp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'semi-vanilla'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'community'),
-- 2B2H
(gen_random_uuid(), '10000000-0000-0000-0000-000000000005', 'anarchy'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000005', 'no-rules'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000005', 'hardcore'),
-- Hytale Party
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'minigames'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'bedwars'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'skywars'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'network'),
-- CozyTale
(gen_random_uuid(), '10000000-0000-0000-0000-000000000007', 'kitpvp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000007', 'minigames'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000007', 'casual'),
-- Hylore
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'mmorpg'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'classes'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'dungeons'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'quests'),
-- Runeteria
(gen_random_uuid(), '10000000-0000-0000-0000-000000000009', 'rpg'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000009', 'fantasy'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000009', 'lore'),
-- Runefall
(gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'action-rpg'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'dungeons'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'combat'),
-- Hytale Box
(gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'creative'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'worldedit'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'plots'),
-- HyStrix
(gen_random_uuid(), '10000000-0000-0000-0000-000000000012', 'creative'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000012', 'competition'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000012', 'building'),
-- Dogecraft
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'adventure'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'maps'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'exploration'),
-- Hyfable
(gen_random_uuid(), '10000000-0000-0000-0000-000000000014', 'adventure'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000014', 'story'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000014', 'narrative'),
-- HyFyve
(gen_random_uuid(), '10000000-0000-0000-0000-000000000015', 'modded'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000015', 'tech'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000015', 'automation'),
-- Old Stronghold
(gen_random_uuid(), '10000000-0000-0000-0000-000000000016', 'modded'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000016', 'medieval'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000016', 'classic'),
-- Hyspania
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'spanish'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'survival'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'community'),
-- Inter World
(gen_random_uuid(), '10000000-0000-0000-0000-000000000018', 'russian'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000018', 'survival'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000018', 'minigames'),
-- PrimeTale
(gen_random_uuid(), '10000000-0000-0000-0000-000000000019', 'network'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000019', 'premium'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000019', 'minigames')
ON CONFLICT DO NOTHING;

-- ============================================
-- Reviews
-- ============================================
INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 5, 'Best PvP server! The ranked system is fair and combat feels smooth.', NOW() - INTERVAL '60 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000001' AND user_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 5, 'True to their name - no lag at all! Staff is super helpful too.', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000002' AND user_id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 5, 'So many minigames to play! Me and my friends have a blast here.', NOW() - INTERVAL '55 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000006' AND user_id = 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 5, 'This is basically a full MMO! The dungeons are challenging and rewarding.', NOW() - INTERVAL '50 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000008' AND user_id = 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000005', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 4, 'Anarchy is not for everyone but if you like chaos, this is perfect. Beware of griefers!', NOW() - INTERVAL '70 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000005' AND user_id = 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 4, 'Love the town system! Great community and helpful staff.', NOW() - INTERVAL '65 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000003' AND user_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 5, 'Builder paradise! WorldEdit for everyone is a game changer.', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000011' AND user_id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000009', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 5, 'The custom lore and world building is incredible. Feels like a real fantasy world.', NOW() - INTERVAL '38 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000009' AND user_id = 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000019', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 5, 'Premium quality server with lots of game modes. Worth checking out!', NOW() - INTERVAL '35 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000019' AND user_id = 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000015', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 5, 'Tech lovers rejoice! The modpack is well balanced and progression is satisfying.', NOW() - INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000015' AND user_id = 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5');

-- ============================================
-- Votes (recent votes for testing)
-- ============================================
INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000001' AND user_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1' AND vote_date = CURRENT_DATE - 1);

INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000006' AND user_id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2' AND vote_date = CURRENT_DATE - 1);

INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000008' AND user_id = 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' AND vote_date = CURRENT_DATE - 1);

INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000019', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000019' AND user_id = 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4' AND vote_date = CURRENT_DATE - 1);

INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000011' AND user_id = 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5' AND vote_date = CURRENT_DATE - 1);

-- ============================================
-- Update review counts and average ratings
-- ============================================
UPDATE servers s SET
    review_count = (SELECT COUNT(*) FROM reviews r WHERE r.server_id = s.id),
    average_rating = (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM reviews r WHERE r.server_id = s.id);

-- Summary:
-- 20 users (server owners + admin)
-- 19 servers with REAL Hytale server IPs from hytale-servers.com
-- All servers start with is_online = false, player_count = 0
-- The scheduler will ping these real servers and update with live data
-- ~57 server tags
-- 10 reviews
-- 5 recent votes
