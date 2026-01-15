-- Mock data for Hytale Online List
-- This script creates realistic test data including users, servers, tags, reviews, and votes
-- It can run multiple times safely (uses ON CONFLICT DO NOTHING)

-- ============================================
-- OPTIONAL: Uncomment the following line to RESET all seed data on each startup
-- This will delete ALL data from these tables (use with caution!)
-- ============================================
 TRUNCATE votes, reviews, server_tags, servers, refresh_tokens, users CASCADE;

-- ============================================
-- Users (Server Owners and Community Members)
-- ============================================
-- Password for all test users: "password123" (BCrypt hash)
-- $2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW

INSERT INTO users (id, username, email, password_hash, avatar_url, role, email_verified, created_at, updated_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'HytaleAdmin', 'admin@hytaleonlinelist.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HytaleAdmin', 'ADMIN', true, NOW() - INTERVAL '365 days', NOW()),
    ('22222222-2222-2222-2222-222222222222', 'SkywardStudios', 'contact@skywardstudios.gg', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SkywardStudios', 'USER', true, NOW() - INTERVAL '340 days', NOW()),
    ('33333333-3333-3333-3333-333333333333', 'PixelCraft', 'owner@pixelcraft.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelCraft', 'USER', true, NOW() - INTERVAL '320 days', NOW()),
    ('44444444-4444-4444-4444-444444444444', 'NexusGaming', 'admin@nexusgaming.io', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=NexusGaming', 'USER', true, NOW() - INTERVAL '300 days', NOW()),
    ('55555555-5555-5555-5555-555555555555', 'EpicRealms', 'support@epicrealms.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EpicRealms', 'USER', true, NOW() - INTERVAL '280 days', NOW()),
    ('66666666-6666-6666-6666-666666666666', 'DragonKeep', 'hello@dragonkeep.org', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonKeep', 'USER', true, NOW() - INTERVAL '260 days', NOW()),
    ('77777777-7777-7777-7777-777777777777', 'StormForge', 'team@stormforge.gg', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=StormForge', 'USER', true, NOW() - INTERVAL '240 days', NOW()),
    ('88888888-8888-8888-8888-888888888888', 'EmberLands', 'info@emberlands.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmberLands', 'USER', true, NOW() - INTERVAL '220 days', NOW()),
    ('99999999-9999-9999-9999-999999999999', 'FrostByte', 'contact@frostbyte.io', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=FrostByte', 'USER', true, NOW() - INTERVAL '200 days', NOW()),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'LunarNetwork', 'admin@lunarnetwork.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunarNetwork', 'USER', true, NOW() - INTERVAL '180 days', NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TitanForge', 'hello@titanforge.gg', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TitanForge', 'USER', true, NOW() - INTERVAL '160 days', NOW()),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'AetherGames', 'support@aethergames.net', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AetherGames', 'USER', true, NOW() - INTERVAL '140 days', NOW()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'CrystalPeak', 'team@crystalpeak.org', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CrystalPeak', 'USER', true, NOW() - INTERVAL '120 days', NOW()),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ShadowRealm', 'contact@shadowrealm.io', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowRealm', 'USER', true, NOW() - INTERVAL '100 days', NOW()),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'VoidWalkers', 'admin@voidwalkers.gg', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=VoidWalkers', 'USER', true, NOW() - INTERVAL '80 days', NOW()),
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'BlockMaster42', 'blockmaster42@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=BlockMaster42', 'USER', true, NOW() - INTERVAL '90 days', NOW()),
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'CraftLord', 'craftlord@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CraftLord', 'USER', true, NOW() - INTERVAL '85 days', NOW()),
    ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'PixelWarrior', 'pixelwarrior@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelWarrior', 'USER', true, NOW() - INTERVAL '75 days', NOW()),
    ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'GameKnight', 'gameknight@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=GameKnight', 'USER', true, NOW() - INTERVAL '65 days', NOW()),
    ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'RealmExplorer', 'realmexplorer@email.com', '$2a$10$eTFu8XOaf9KoRX0fzHVLe.hLODwm4P88/nMS.dB2zMUHTDIb183TW', 'https://api.dicebear.com/7.x/avataaars/svg?seed=RealmExplorer', 'USER', true, NOW() - INTERVAL '55 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Servers (using subqueries for category_id)
-- ============================================

-- Survival Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000001', 'Skyward Realms', 'skyward-realms', 'play.skywardrealms.gg', 5520, 'Premium Hytale survival experience with custom quests and land claiming',
'# Welcome to Skyward Realms!

Join thousands of players in the ultimate Hytale survival experience.

## Features
- **Land Claiming** - Protect your builds with our intuitive claiming system
- **Custom Quests** - Over 200 unique quests with amazing rewards
- **Player Economy** - Dynamic player-driven marketplace
- **Weekly Events** - Community events every weekend

We look forward to seeing you in-game!',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=skyward', 'https://skywardrealms.gg', 'https://discord.gg/skyward', id, '1.0.0', true, 847, 2000, 99.8, 45231, 128450, true, true, NOW() - INTERVAL '340 days', NOW() - INTERVAL '2 minutes', '22222222-2222-2222-2222-222222222222'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000002', 'Emerald Valley', 'emerald-valley', 'mc.emeraldvalley.net', 5520, 'Relaxed survival server with friendly community and grief protection',
'# Emerald Valley - A Peaceful Survival Experience

Looking for a chill place to build and explore? Emerald Valley is the perfect home for you!

## What We Offer
- Grief protection with automatic rollback
- Friendly and mature community
- No pay-to-win - everything is earnable
- Beautiful custom terrain generation

Come join our growing family!',
'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=emerald', 'https://emeraldvalley.net', 'https://discord.gg/emerald', id, '1.0.0', true, 234, 500, 98.5, 12847, 45230, false, true, NOW() - INTERVAL '280 days', NOW() - INTERVAL '5 minutes', '33333333-3333-3333-3333-333333333333'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000003', 'Frontier Lands', 'frontier-lands', 'frontier.lands.io', 5520, 'Hardcore survival with seasons and competitive leaderboards',
'# Frontier Lands - Test Your Survival Skills

Think you have what it takes? Frontier Lands offers the ultimate hardcore survival challenge.

## Seasons
Every 3 months we reset the world and start fresh. Compete for:
- Most blocks mined
- Longest survival streak
- Best builder

Only the strongest survive!',
'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=frontier', 'https://frontierlands.io', 'https://discord.gg/frontier', id, '1.0.0', true, 156, 300, 97.2, 8934, 32100, false, false, NOW() - INTERVAL '200 days', NOW() - INTERVAL '3 minutes', '44444444-4444-4444-4444-444444444444'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000004', 'Oasis SMP', 'oasis-smp', 'play.oasissmp.com', 5520, 'Semi-vanilla survival with quality of life improvements',
'# Oasis SMP

The perfect balance between vanilla and modded gameplay.

## Quality of Life Features
- /home and /spawn commands
- Player warps
- Chest shops
- Tree feller
- Vein miner

Join the oasis today!',
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=oasis', 'https://oasissmp.com', 'https://discord.gg/oasis', id, '1.0.0', true, 412, 800, 99.1, 21567, 67800, true, true, NOW() - INTERVAL '320 days', NOW() - INTERVAL '1 minute', '55555555-5555-5555-5555-555555555555'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000005', 'Wilderness Craft', 'wilderness-craft', 'wild.craft.gg', 5520, 'Pure vanilla survival experience with minimal plugins',
'# Wilderness Craft - Pure Vanilla Experience

For purists who want the authentic survival experience.

## Features
- 100% vanilla gameplay
- No teleportation commands
- No economy plugins
- Just you and the world

Experience Hytale the way it was meant to be played.',
'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=wilderness', NULL, 'https://discord.gg/wildcraft', id, '1.0.0', true, 89, 150, 96.8, 5621, 18900, false, false, NOW() - INTERVAL '150 days', NOW() - INTERVAL '4 minutes', '66666666-6666-6666-6666-666666666666'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

-- PvP Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000006', 'BattleZone', 'battlezone', 'pvp.battlezone.gg', 5520, 'Competitive PvP with ranked matches and tournaments',
'# BattleZone - Prove Your Worth

The premier competitive PvP server for Hytale.

## Game Modes
- **Ranked 1v1** - Climb the ELO ladder
- **Team Battles** - 2v2, 3v3, and 5v5
- **Free-for-All** - Last player standing

## Tournaments
- Weekly tournaments with cash prizes
- Monthly championship events
- Seasonal ranked rewards

Join the battle!',
'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=battlezone', 'https://battlezone.gg', 'https://discord.gg/battlezone', id, '1.0.0', true, 1247, 3000, 99.5, 67432, 234500, true, true, NOW() - INTERVAL '300 days', NOW() - INTERVAL '1 minute', '77777777-7777-7777-7777-777777777777'
FROM categories WHERE slug = 'pvp'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000007', 'Warfront', 'warfront', 'play.warfront.io', 5520, 'Faction-based PvP with territory control and sieges',
'# Warfront - Conquer the Realm

Build your faction, claim territory, and dominate the battlefield.

## Faction System
- Create or join factions
- Claim and defend territory
- Build faction bases

## Warfare
- Weekly faction wars
- Siege mechanics
- Tactical gameplay

Choose your side wisely.',
'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=warfront', 'https://warfront.io', 'https://discord.gg/warfront', id, '1.0.0', true, 534, 1000, 98.9, 28901, 89700, true, true, NOW() - INTERVAL '250 days', NOW() - INTERVAL '2 minutes', '88888888-8888-8888-8888-888888888888'
FROM categories WHERE slug = 'pvp'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000008', 'Arena Masters', 'arena-masters', 'arena.masters.net', 5520, 'Fast-paced arena combat with custom kits and maps',
'# Arena Masters

Quick matches, endless fun!

## Arenas
- 15+ unique arena maps
- Different themes and sizes

## Kits
- 20+ unique kit loadouts
- Unlock new kits as you play

## Modes
- Deathmatch
- Team Deathmatch
- King of the Hill',
'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=arena', 'https://arenamasters.net', 'https://discord.gg/arena', id, '1.0.0', true, 312, 600, 97.8, 15678, 52300, false, true, NOW() - INTERVAL '180 days', NOW() - INTERVAL '3 minutes', '99999999-9999-9999-9999-999999999999'
FROM categories WHERE slug = 'pvp'
ON CONFLICT (id) DO NOTHING;

-- Creative Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000010', 'BuildCraft Studios', 'buildcraft-studios', 'build.craft.studio', 5520, 'Professional building server with world edit and unlimited resources',
'# BuildCraft Studios - Unleash Your Creativity

The ultimate creative building experience.

## Tools Available
- WorldEdit for all players
- Custom brushes
- Schematics library
- Unlimited resources

## Plot System
- Multiple plot sizes
- Merge plots together
- Share with friends

Create something amazing!',
'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=buildcraft', 'https://buildcraftstudios.com', 'https://discord.gg/buildcraft', id, '1.0.0', true, 423, 800, 99.2, 34521, 112300, true, true, NOW() - INTERVAL '310 days', NOW() - INTERVAL '2 minutes', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
FROM categories WHERE slug = 'creative'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000011', 'Architect Haven', 'architect-haven', 'haven.architect.gg', 5520, 'Collaborative building with themed worlds and competitions',
'# Architect Haven

Where builders come to create masterpieces.

## Themed Worlds
- Medieval Kingdom
- Futuristic City
- Fantasy Realm

## Competitions
- Speed builds
- Theme challenges
- Collaborative projects

Join our creative community!',
'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=architect', 'https://architecthaven.gg', 'https://discord.gg/architect', id, '1.0.0', true, 198, 400, 98.7, 12890, 45600, false, true, NOW() - INTERVAL '220 days', NOW() - INTERVAL '4 minutes', 'cccccccc-cccc-cccc-cccc-cccccccccccc'
FROM categories WHERE slug = 'creative'
ON CONFLICT (id) DO NOTHING;

-- RPG Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000013', 'Legends of Orbis', 'legends-of-orbis', 'play.legendsoforbis.com', 5520, 'Full MMORPG experience with classes, dungeons, and raids',
'# Legends of Orbis - A New World Awaits

The most ambitious RPG server for Hytale.

## Classes
- **Warrior** - Tank and melee DPS
- **Mage** - Ranged magic damage
- **Ranger** - Agile ranged attacks
- **Healer** - Support and healing

## Content
- 50+ hour main storyline
- 20 dungeons with multiple difficulties
- 5 raid bosses
- Daily quests

Your legend begins here!',
'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=legends', 'https://legendsoforbis.com', 'https://discord.gg/legends', id, '1.0.0', true, 1567, 3000, 99.6, 78432, 345600, true, true, NOW() - INTERVAL '330 days', NOW() - INTERVAL '1 minute', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
FROM categories WHERE slug = 'rpg'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000014', 'Realm of Heroes', 'realm-of-heroes', 'heroes.realm.io', 5520, 'Action RPG with real-time combat and procedural dungeons',
'# Realm of Heroes

Fast-paced action RPG gameplay.

## Combat System
- Real-time combat
- Combo system
- Dodging and blocking

## Dungeons
- Procedurally generated
- Scaling difficulty
- Rare loot drops

Become a hero!',
'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=heroes', 'https://realmofheroes.io', 'https://discord.gg/heroes', id, '1.0.0', true, 623, 1200, 98.8, 32156, 123400, true, true, NOW() - INTERVAL '270 days', NOW() - INTERVAL '2 minutes', 'ffffffff-ffff-ffff-ffff-ffffffffffff'
FROM categories WHERE slug = 'rpg'
ON CONFLICT (id) DO NOTHING;

-- Minigames Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000017', 'GameHub Central', 'gamehub-central', 'play.gamehub.gg', 5520, 'Massive minigames network with 20+ unique games',
'# GameHub Central - Endless Entertainment

The largest minigames network!

## Games Available
- Bed Wars
- Sky Wars
- Murder Mystery
- Build Battle
- Parkour
- TNT Run
- And many more!

## Features
- Quick queue times
- Cross-game leveling
- Daily challenges

Join the fun!',
'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=gamehub', 'https://gamehub.gg', 'https://discord.gg/gamehub', id, '1.0.0', true, 2341, 5000, 99.7, 89234, 456700, true, true, NOW() - INTERVAL '350 days', NOW() - INTERVAL '30 seconds', '44444444-4444-4444-4444-444444444444'
FROM categories WHERE slug = 'minigames'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000018', 'Party Games', 'party-games', 'party.games.io', 5520, 'Casual party games perfect for playing with friends',
'# Party Games

Bring your friends!

## Game Modes
- Trivia
- Drawing games
- Racing
- Puzzle challenges

## Features
- Private lobbies
- Party system
- Voice chat support

Perfect for groups!',
'https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=party', 'https://partygames.io', 'https://discord.gg/partygames', id, '1.0.0', true, 456, 1000, 98.4, 23456, 78900, false, true, NOW() - INTERVAL '230 days', NOW() - INTERVAL '2 minutes', '55555555-5555-5555-5555-555555555555'
FROM categories WHERE slug = 'minigames'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000020', 'BedWars Empire', 'bedwars-empire', 'bedwars.empire.gg', 5520, 'Dedicated BedWars server with ranked matches',
'# BedWars Empire

The ultimate BedWars experience!

## Modes
- Solo
- Doubles
- 3v3v3v3
- 4v4v4v4

## Ranking
- Bronze to Champion
- Seasonal rewards
- Exclusive cosmetics

Protect your bed!',
'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=bedwars', 'https://bedwarsempire.gg', 'https://discord.gg/bedwars', id, '1.0.0', true, 876, 2000, 99.0, 45678, 167800, true, true, NOW() - INTERVAL '290 days', NOW() - INTERVAL '1 minute', '77777777-7777-7777-7777-777777777777'
FROM categories WHERE slug = 'minigames'
ON CONFLICT (id) DO NOTHING;

-- Adventure Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000021', 'Exploration Unlimited', 'exploration-unlimited', 'explore.unlimited.gg', 5520, 'Vast procedural worlds with hidden treasures and dungeons',
'# Exploration Unlimited

Discover infinite worlds!

## Exploration
- Massive procedural worlds
- Hidden treasure vaults
- Ancient ruins
- Secret locations

## Rewards
- Rare artifacts
- Unique items
- Explorer titles

Explore the unknown!',
'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=explore', 'https://explorationunlimited.gg', 'https://discord.gg/explore', id, '1.0.0', true, 345, 700, 98.3, 18765, 67800, false, true, NOW() - INTERVAL '240 days', NOW() - INTERVAL '3 minutes', '88888888-8888-8888-8888-888888888888'
FROM categories WHERE slug = 'adventure'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000022', 'Quest Masters', 'quest-masters', 'quest.masters.io', 5520, 'Handcrafted adventure maps with puzzles and challenges',
'# Quest Masters

Premium adventure content!

## Adventures
- 50+ handcrafted maps
- Story campaigns
- Puzzle challenges
- Boss battles

## Difficulty
- Easy - casual fun
- Normal - balanced
- Hard - real challenge

Master every quest!',
'https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=quest', 'https://questmasters.io', 'https://discord.gg/questmasters', id, '1.0.0', true, 234, 500, 97.6, 12345, 45600, false, true, NOW() - INTERVAL '200 days', NOW() - INTERVAL '4 minutes', '99999999-9999-9999-9999-999999999999'
FROM categories WHERE slug = 'adventure'
ON CONFLICT (id) DO NOTHING;

-- Modded Servers
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000024', 'TechCraft', 'techcraft', 'tech.craft.gg', 5520, 'Technology-focused modded server with automation and machines',
'# TechCraft - Engineer Your World

The ultimate tech modded experience!

## Mod Features
- Advanced machines
- Automation systems
- Power generation
- Logistics networks

## Content
- Custom questbook
- Expert recipes
- Progression system

Automate everything!',
'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=techcraft', 'https://techcraft.gg', 'https://discord.gg/techcraft', id, '1.0.0', true, 567, 1000, 98.5, 34567, 123400, true, true, NOW() - INTERVAL '260 days', NOW() - INTERVAL '2 minutes', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
FROM categories WHERE slug = 'modded'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000025', 'Magic Realms', 'magic-realms', 'magic.realms.io', 5520, 'Magic-focused modpack with spells and enchantments',
'# Magic Realms

Harness the arcane!

## Magic Systems
- Spell casting
- Enchanting
- Alchemy
- Rituals

## Schools of Magic
- Fire
- Ice
- Lightning
- Nature

Become a wizard!',
'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=magicrealms', 'https://magicrealms.io', 'https://discord.gg/magicrealms', id, '1.0.0', true, 345, 700, 97.8, 19876, 78900, false, true, NOW() - INTERVAL '210 days', NOW() - INTERVAL '3 minutes', 'cccccccc-cccc-cccc-cccc-cccccccccccc'
FROM categories WHERE slug = 'modded'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000027', 'Skyblock Plus', 'skyblock-plus', 'sky.block.plus', 5520, 'Enhanced skyblock experience with custom islands',
'# Skyblock Plus

Skyblock reimagined!

## Features
- Custom island types
- Unique challenges
- Island upgrades
- Co-op system

## Progression
- Island levels
- Challenge completions
- Leaderboards

Reach for the sky!',
'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=skyblock', 'https://skyblockplus.gg', 'https://discord.gg/skyblock', id, '1.0.0', true, 456, 800, 98.1, 23456, 89700, true, true, NOW() - INTERVAL '280 days', NOW() - INTERVAL '2 minutes', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
FROM categories WHERE slug = 'modded'
ON CONFLICT (id) DO NOTHING;

-- Offline servers (for realism)
INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000031', 'Legacy Network', 'legacy-network', 'legacy.network.gg', 5520, 'Classic gameplay experience (Currently under maintenance)',
'# Legacy Network

Currently under maintenance. We are performing server upgrades.

Follow our Discord for updates.',
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=legacy', 'https://legacynetwork.gg', 'https://discord.gg/legacy', id, '1.0.0', false, 0, 500, 85.4, 8765, 45600, false, true, NOW() - INTERVAL '300 days', NOW() - INTERVAL '2 hours', '44444444-4444-4444-4444-444444444444'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

INSERT INTO servers (id, name, slug, ip_address, port, short_description, description, banner_url, icon_url, website_url, discord_url, category_id, version, is_online, player_count, max_players, uptime_percentage, vote_count, view_count, is_featured, is_verified, created_at, last_pinged_at, owner_id)
SELECT '10000000-0000-0000-0000-000000000032', 'Starter Server', 'starter-server', 'start.server.net', 5520, 'Perfect for new players learning Hytale',
'# Starter Server

Welcome to Hytale!

## Perfect For
- New players
- Learning basics
- Friendly community
- Helpful guides

Start your journey!',
'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop', 'https://api.dicebear.com/7.x/identicon/svg?seed=starter', 'https://starterserver.net', 'https://discord.gg/starter', id, '1.0.0', true, 45, 100, 99.5, 3456, 15600, false, true, NOW() - INTERVAL '90 days', NOW() - INTERVAL '2 minutes', '66666666-6666-6666-6666-666666666666'
FROM categories WHERE slug = 'survival'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Server Tags
-- ============================================
INSERT INTO server_tags (id, server_id, tag) VALUES
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'survival'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'land-claim'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'quests'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'economy'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'survival'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'peaceful'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'community'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'hardcore'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'seasonal'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'competitive'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'semi-vanilla'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'economy'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000005', 'vanilla'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000005', 'pure'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'pvp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'ranked'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'competitive'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'tournaments'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000007', 'factions'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000007', 'pvp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000007', 'siege'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'arena'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'pvp'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000008', 'kits'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'creative'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'worldedit'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'building'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'creative'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000011', 'themed'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'mmorpg'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'classes'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'dungeons'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'raids'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000014', 'action-rpg'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000014', 'combat'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'minigames'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'bedwars'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'skywars'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'network'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000018', 'party'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000018', 'casual'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000020', 'bedwars'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000020', 'ranked'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000021', 'exploration'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000021', 'treasures'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000022', 'adventure'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000022', 'puzzles'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000024', 'tech'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000024', 'automation'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000024', 'modded'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000025', 'magic'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000025', 'spells'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000025', 'modded'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000027', 'skyblock'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000027', 'islands'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000031', 'classic'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000031', 'survival'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000032', 'beginner'),
(gen_random_uuid(), '10000000-0000-0000-0000-000000000032', 'friendly')
ON CONFLICT DO NOTHING;

-- ============================================
-- Reviews
-- ============================================
INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 5, 'Absolutely love this server! The quests are amazing and the community is super friendly.', NOW() - INTERVAL '60 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000001' AND user_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 5, 'Best survival server I have played on. The land claiming system is so intuitive.', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000001' AND user_id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000006', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 5, 'The competitive scene here is incredible. Fair matchmaking and exciting tournaments!', NOW() - INTERVAL '55 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000006' AND user_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 5, 'So many games to play! My friends and I have spent countless hours here.', NOW() - INTERVAL '50 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000017' AND user_id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 5, 'This is basically a full MMO in Hytale! The dungeons are challenging.', NOW() - INTERVAL '70 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000013' AND user_id = 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 5, 'Paradise for builders! The WorldEdit tools make creating so enjoyable.', NOW() - INTERVAL '65 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000010' AND user_id = 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000024', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 5, 'Tech lovers rejoice! The modpack is perfectly curated.', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000024' AND user_id = 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 4, 'Great balance of vanilla and QoL features. Perfect SMP experience.', NOW() - INTERVAL '38 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000004' AND user_id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000020', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 5, 'Best BedWars server! The ranked system is fair and maps are well designed.', NOW() - INTERVAL '35 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000020' AND user_id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

INSERT INTO reviews (id, server_id, user_id, rating, content, created_at)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 3, 'Too hardcore for casual players. Good if you want a challenge though.', NOW() - INTERVAL '45 days'
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE server_id = '10000000-0000-0000-0000-000000000003' AND user_id = 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3');

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
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000017', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000017' AND user_id = 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' AND vote_date = CURRENT_DATE - 1);

INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000013', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000013' AND user_id = 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4' AND vote_date = CURRENT_DATE - 1);

INSERT INTO votes (id, server_id, user_id, voted_at, vote_date)
SELECT gen_random_uuid(), '10000000-0000-0000-0000-000000000010', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', NOW() - INTERVAL '1 day', CURRENT_DATE - 1
WHERE NOT EXISTS (SELECT 1 FROM votes WHERE server_id = '10000000-0000-0000-0000-000000000010' AND user_id = 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5' AND vote_date = CURRENT_DATE - 1);

-- Summary:
-- 20 users (15 server owners + 5 community members)
-- 20 servers across all 7 categories
-- ~60 server tags
-- 10 reviews
-- 5 recent votes
