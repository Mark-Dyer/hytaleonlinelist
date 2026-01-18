import { Server, Category, Review, User } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Survival',
    slug: 'survival',
    description: 'Classic survival gameplay with resource gathering and building',
    icon: 'shield',
    serverCount: 45,
  },
  {
    id: '2',
    name: 'PvP',
    slug: 'pvp',
    description: 'Player versus player combat servers',
    icon: 'swords',
    serverCount: 32,
  },
  {
    id: '3',
    name: 'Creative',
    slug: 'creative',
    description: 'Building and creativity focused servers',
    icon: 'brush',
    serverCount: 18,
  },
  {
    id: '4',
    name: 'RPG',
    slug: 'rpg',
    description: 'Role-playing game servers with quests and storylines',
    icon: 'scroll',
    serverCount: 24,
  },
  {
    id: '5',
    name: 'Minigames',
    slug: 'minigames',
    description: 'Various mini-games and competitive modes',
    icon: 'gamepad',
    serverCount: 29,
  },
  {
    id: '6',
    name: 'Adventure',
    slug: 'adventure',
    description: 'Story-driven adventure and exploration',
    icon: 'map',
    serverCount: 15,
  },
  {
    id: '7',
    name: 'Modded',
    slug: 'modded',
    description: 'Servers with custom modifications and plugins',
    icon: 'puzzle',
    serverCount: 21,
  },
];

export const mockUsers: User[] = [
  { id: '1', username: 'HypixelTeam', avatarUrl: null },
  { id: '2', username: 'SurvivalKing', avatarUrl: null },
  { id: '3', username: 'CreativeBuilder', avatarUrl: null },
  { id: '4', username: 'PvPMaster', avatarUrl: null },
  { id: '5', username: 'RPGLord', avatarUrl: null },
  { id: '6', username: 'MiniGamesDev', avatarUrl: null },
  { id: '7', username: 'AdventureGuild', avatarUrl: null },
  { id: '8', username: 'ModdedWorld', avatarUrl: null },
];

export const servers: Server[] = [
  {
    id: '1',
    name: 'Hypixel Hytale',
    slug: 'hypixel-hytale',
    ipAddress: 'play.hypixel-hytale.net',
    port: 5520,
    shortDescription: 'The #1 Hytale server with minigames, skyblock, and more!',
    description: `# Welcome to Hypixel Hytale!

The most popular Hytale server featuring:

## Game Modes
- **SkyBlock** - Build your island empire
- **BedWars** - Protect your bed and destroy others
- **SkyWars** - Battle royale in the sky
- **Murder Mystery** - Find the killer before it's too late
- **Build Battle** - Show off your building skills

## Features
- Active community with 24/7 moderation
- Regular updates and new content
- Custom quests and achievements
- Economy system with player shops
- Discord integration

Join thousands of players today!`,
    bannerUrl: 'https://picsum.photos/seed/hypixel/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=HH&backgroundColor=7c3aed',
    websiteUrl: 'https://hypixel-hytale.net',
    discordUrl: 'https://discord.gg/hypixel',
    category: categories[4], // Minigames
    tags: ['minigames', 'skyblock', 'bedwars', 'popular', 'featured'],
    version: '1.0',
    isOnline: true,
    playerCount: 12453,
    maxPlayers: 50000,
    uptimePercentage: 99.8,
    voteCount: 8934,
    viewCount: 125000,
    reviewCount: 47,
    averageRating: 4.2,
    isFeatured: true,
    isVerified: true,
    createdAt: '2026-01-13T00:00:00Z',
    lastPingedAt: '2026-01-13T12:30:00Z',
    owner: mockUsers[0],
  },
  {
    id: '2',
    name: 'SurvivalCraft',
    slug: 'survivalcraft',
    ipAddress: 'play.survivalcraft.gg',
    port: 5520,
    shortDescription: 'Pure vanilla survival experience with a friendly community',
    description: `# SurvivalCraft

Experience Hytale the way it was meant to be played!

## What We Offer
- Pure vanilla survival gameplay
- No pay-to-win mechanics
- Active and helpful staff
- Land claiming system
- Player-driven economy

## Rules
1. Be respectful to all players
2. No griefing or stealing
3. No hacking or exploiting
4. Have fun!

Join our Discord for community events!`,
    bannerUrl: 'https://picsum.photos/seed/survival/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SC&backgroundColor=059669',
    websiteUrl: 'https://survivalcraft.gg',
    discordUrl: 'https://discord.gg/survivalcraft',
    category: categories[0], // Survival
    tags: ['survival', 'vanilla', 'friendly', 'economy'],
    version: '1.0',
    isOnline: true,
    playerCount: 342,
    maxPlayers: 500,
    uptimePercentage: 98.5,
    voteCount: 2156,
    viewCount: 45000,
    reviewCount: 23,
    averageRating: 4.5,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T01:00:00Z',
    lastPingedAt: '2026-01-13T12:28:00Z',
    owner: mockUsers[1],
  },
  {
    id: '3',
    name: 'CreativeRealms',
    slug: 'creativerealms',
    ipAddress: 'creative.realms.io',
    port: 5520,
    shortDescription: 'Unlimited creative building with plot system and competitions',
    description: `# CreativeRealms

Unleash your creativity!

## Features
- Personal plots for building
- Weekly building competitions
- World edit tools available
- Showcase gallery
- Building tutorials

Join our community of builders!`,
    bannerUrl: 'https://picsum.photos/seed/creative/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CR&backgroundColor=f59e0b',
    websiteUrl: 'https://creativerealms.io',
    discordUrl: 'https://discord.gg/creativerealms',
    category: categories[2], // Creative
    tags: ['creative', 'building', 'plots', 'competitions'],
    version: '1.0',
    isOnline: true,
    playerCount: 89,
    maxPlayers: 200,
    uptimePercentage: 97.2,
    voteCount: 876,
    viewCount: 18000,
    reviewCount: 12,
    averageRating: 4.0,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T02:00:00Z',
    lastPingedAt: '2026-01-13T12:25:00Z',
    owner: mockUsers[2],
  },
  {
    id: '4',
    name: 'WarZone PvP',
    slug: 'warzone-pvp',
    ipAddress: 'pvp.warzone.net',
    port: 5520,
    shortDescription: 'Intense PvP action with custom kits and arenas',
    description: `# WarZone PvP

The ultimate PvP experience!

## Game Modes
- **Kit PvP** - Choose your loadout and fight
- **Duels** - 1v1 ranked matches
- **Team Battles** - 5v5 competitive
- **Free For All** - Last man standing

## Ranks & Rewards
- Climb the leaderboards
- Earn exclusive kits
- Seasonal rewards

Are you ready for battle?`,
    bannerUrl: 'https://picsum.photos/seed/warzone/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=WZ&backgroundColor=dc2626',
    websiteUrl: 'https://warzone.net',
    discordUrl: 'https://discord.gg/warzone',
    category: categories[1], // PvP
    tags: ['pvp', 'combat', 'competitive', 'ranked'],
    version: '1.0',
    isOnline: true,
    playerCount: 567,
    maxPlayers: 1000,
    uptimePercentage: 99.1,
    voteCount: 3421,
    viewCount: 67000,
    reviewCount: 38,
    averageRating: 4.7,
    isFeatured: true,
    isVerified: true,
    createdAt: '2026-01-13T03:00:00Z',
    lastPingedAt: '2026-01-13T12:29:00Z',
    owner: mockUsers[3],
  },
  {
    id: '5',
    name: 'Legends RPG',
    slug: 'legends-rpg',
    ipAddress: 'play.legendsrpg.com',
    port: 5520,
    shortDescription: 'Epic RPG server with custom quests, dungeons, and classes',
    description: `# Legends RPG

Embark on an epic adventure!

## Classes
- **Warrior** - Tank and melee DPS
- **Mage** - Powerful spellcaster
- **Ranger** - Ranged attacks and traps
- **Healer** - Support and healing

## Content
- 50+ unique quests
- 10 challenging dungeons
- Boss raids every weekend
- Custom crafting system
- Player housing

Begin your legend today!`,
    bannerUrl: 'https://picsum.photos/seed/rpg/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=LR&backgroundColor=8b5cf6',
    websiteUrl: 'https://legendsrpg.com',
    discordUrl: 'https://discord.gg/legendsrpg',
    category: categories[3], // RPG
    tags: ['rpg', 'quests', 'dungeons', 'classes', 'mmorpg'],
    version: '1.0',
    isOnline: true,
    playerCount: 234,
    maxPlayers: 400,
    uptimePercentage: 96.8,
    voteCount: 1987,
    viewCount: 52000,
    reviewCount: 29,
    averageRating: 4.3,
    isFeatured: true,
    isVerified: true,
    createdAt: '2026-01-13T04:00:00Z',
    lastPingedAt: '2026-01-13T12:27:00Z',
    owner: mockUsers[4],
  },
  {
    id: '6',
    name: 'Party Games',
    slug: 'party-games',
    ipAddress: 'fun.partygames.io',
    port: 5520,
    shortDescription: 'Collection of fun party games for everyone!',
    description: `# Party Games

Fun for everyone!

## Available Games
- Spleef
- TNT Run
- Parkour
- Hide and Seek
- Musical Chairs
- And 20+ more!

Perfect for playing with friends!`,
    bannerUrl: 'https://picsum.photos/seed/party/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PG&backgroundColor=ec4899',
    websiteUrl: 'https://partygames.io',
    discordUrl: 'https://discord.gg/partygames',
    category: categories[4], // Minigames
    tags: ['minigames', 'party', 'fun', 'casual'],
    version: '1.0',
    isOnline: true,
    playerCount: 156,
    maxPlayers: 300,
    uptimePercentage: 95.4,
    voteCount: 1234,
    viewCount: 28000,
    reviewCount: 15,
    averageRating: 3.8,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T05:00:00Z',
    lastPingedAt: '2026-01-13T12:26:00Z',
    owner: mockUsers[5],
  },
  {
    id: '7',
    name: 'Quest World',
    slug: 'quest-world',
    ipAddress: 'adventure.questworld.net',
    port: 5520,
    shortDescription: 'Story-driven adventure with custom maps and puzzles',
    description: `# Quest World

Explore mysterious lands!

## Features
- 100+ hours of story content
- Custom adventure maps
- Puzzle dungeons
- Collectible treasures
- Achievement system

Your adventure awaits!`,
    bannerUrl: 'https://picsum.photos/seed/adventure/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=QW&backgroundColor=0891b2',
    websiteUrl: 'https://questworld.net',
    discordUrl: 'https://discord.gg/questworld',
    category: categories[5], // Adventure
    tags: ['adventure', 'story', 'puzzles', 'exploration'],
    version: '1.0',
    isOnline: false,
    playerCount: 0,
    maxPlayers: 150,
    uptimePercentage: 87.3,
    voteCount: 654,
    viewCount: 15000,
    reviewCount: 0,
    averageRating: null,
    isFeatured: false,
    isVerified: false,
    createdAt: '2026-01-13T06:00:00Z',
    lastPingedAt: '2026-01-13T11:00:00Z',
    owner: mockUsers[6],
  },
  {
    id: '8',
    name: 'ModdedCraft',
    slug: 'moddedcraft',
    ipAddress: 'play.moddedcraft.org',
    port: 5520,
    shortDescription: 'Enhanced gameplay with custom mods and features',
    description: `# ModdedCraft

Hytale, but better!

## Mods Included
- Enhanced Combat
- Magic & Spells
- Custom Vehicles
- Extended Building Tools
- New Biomes & Creatures

Experience Hytale like never before!`,
    bannerUrl: 'https://picsum.photos/seed/modded/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=84cc16',
    websiteUrl: 'https://moddedcraft.org',
    discordUrl: 'https://discord.gg/moddedcraft',
    category: categories[6], // Modded
    tags: ['modded', 'custom', 'enhanced', 'mods'],
    version: '1.0',
    isOnline: true,
    playerCount: 78,
    maxPlayers: 100,
    uptimePercentage: 94.1,
    voteCount: 432,
    viewCount: 12000,
    reviewCount: 8,
    averageRating: 4.1,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T07:00:00Z',
    lastPingedAt: '2026-01-13T12:24:00Z',
    owner: mockUsers[7],
  },
  {
    id: '9',
    name: 'Factions Realm',
    slug: 'factions-realm',
    ipAddress: 'factions.realm.gg',
    port: 5520,
    shortDescription: 'Classic factions gameplay with raiding and base building',
    description: `# Factions Realm

Build your empire, raid your enemies!

## Features
- Faction system with allies and enemies
- Raiding mechanics
- Custom cannons
- Economy & shops
- Weekly events

Dominate the realm!`,
    bannerUrl: 'https://picsum.photos/seed/factions/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FR&backgroundColor=ef4444',
    websiteUrl: 'https://factionsrealm.gg',
    discordUrl: 'https://discord.gg/factions',
    category: categories[1], // PvP
    tags: ['factions', 'raiding', 'pvp', 'base-building'],
    version: '1.0',
    isOnline: true,
    playerCount: 289,
    maxPlayers: 500,
    uptimePercentage: 97.8,
    voteCount: 1876,
    viewCount: 41000,
    reviewCount: 21,
    averageRating: 4.4,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T08:00:00Z',
    lastPingedAt: '2026-01-13T12:28:00Z',
    owner: mockUsers[3],
  },
  {
    id: '10',
    name: 'SkyBlock Empire',
    slug: 'skyblock-empire',
    ipAddress: 'sky.empire.net',
    port: 5520,
    shortDescription: 'Start with nothing, build everything on your sky island',
    description: `# SkyBlock Empire

The ultimate SkyBlock experience!

## Features
- Custom island progression
- 200+ challenges
- Island leveling system
- Co-op islands with friends
- Weekly competitions

Start your sky empire today!`,
    bannerUrl: 'https://picsum.photos/seed/skyblock/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SE&backgroundColor=06b6d4',
    websiteUrl: 'https://skyblockempire.net',
    discordUrl: 'https://discord.gg/skyblock',
    category: categories[0], // Survival
    tags: ['skyblock', 'survival', 'islands', 'challenges'],
    version: '1.0',
    isOnline: true,
    playerCount: 423,
    maxPlayers: 750,
    uptimePercentage: 98.9,
    voteCount: 2567,
    viewCount: 58000,
    reviewCount: 31,
    averageRating: 4.6,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T09:00:00Z',
    lastPingedAt: '2026-01-13T12:30:00Z',
    owner: mockUsers[1],
  },
  {
    id: '11',
    name: 'Towny Nations',
    slug: 'towny-nations',
    ipAddress: 'play.townynations.com',
    port: 5520,
    shortDescription: 'Build towns, form nations, and conquer the world',
    description: `# Towny Nations

Politics meets survival!

## Features
- Create and manage towns
- Form nations with allies
- Diplomatic relations
- War declarations
- Custom economy

Build your nation!`,
    bannerUrl: 'https://picsum.photos/seed/towny/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TN&backgroundColor=10b981',
    websiteUrl: 'https://townynations.com',
    discordUrl: 'https://discord.gg/towny',
    category: categories[0], // Survival
    tags: ['towny', 'nations', 'politics', 'economy'],
    version: '1.0',
    isOnline: true,
    playerCount: 198,
    maxPlayers: 300,
    uptimePercentage: 96.5,
    voteCount: 1432,
    viewCount: 34000,
    reviewCount: 18,
    averageRating: 4.2,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T10:00:00Z',
    lastPingedAt: '2026-01-13T12:29:00Z',
    owner: mockUsers[1],
  },
  {
    id: '12',
    name: 'Prison Break',
    slug: 'prison-break',
    ipAddress: 'prison.break.io',
    port: 5520,
    shortDescription: 'Mine your way to freedom in this prison-themed server',
    description: `# Prison Break

Can you escape?

## Features
- Multiple prison ranks
- Mine to earn money
- PvP arenas
- Black market trading
- Prestige system

Work your way to freedom!`,
    bannerUrl: 'https://picsum.photos/seed/prison/1200/400',
    iconUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PB&backgroundColor=6366f1',
    websiteUrl: 'https://prisonbreak.io',
    discordUrl: 'https://discord.gg/prison',
    category: categories[0], // Survival
    tags: ['prison', 'mining', 'economy', 'ranks'],
    version: '1.0',
    isOnline: true,
    playerCount: 167,
    maxPlayers: 250,
    uptimePercentage: 95.2,
    voteCount: 987,
    viewCount: 23000,
    reviewCount: 11,
    averageRating: 3.9,
    isFeatured: false,
    isVerified: true,
    createdAt: '2026-01-13T11:00:00Z',
    lastPingedAt: '2026-01-13T12:27:00Z',
    owner: mockUsers[2],
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    serverId: '1',
    user: { id: '10', username: 'GamerPro123', avatarUrl: null },
    rating: 5,
    content: 'Best Hytale server out there! Amazing minigames and friendly community.',
    createdAt: '2026-01-13T10:00:00Z',
    updatedAt: '2026-01-13T10:00:00Z',
    isOwner: false,
  },
  {
    id: '2',
    serverId: '1',
    user: { id: '11', username: 'BlockBuilder', avatarUrl: null },
    rating: 4,
    content: 'Great server with lots of content. Sometimes laggy during peak hours.',
    createdAt: '2026-01-13T09:00:00Z',
    updatedAt: '2026-01-13T09:00:00Z',
    isOwner: false,
  },
  {
    id: '3',
    serverId: '2',
    user: { id: '12', username: 'SurvivalFan', avatarUrl: null },
    rating: 5,
    content: 'Perfect vanilla experience. Staff is very helpful!',
    createdAt: '2026-01-13T08:00:00Z',
    updatedAt: '2026-01-13T08:00:00Z',
    isOwner: false,
  },
];

// Helper functions
export function getServerBySlug(slug: string): Server | undefined {
  return servers.find(s => s.slug === slug);
}

export function getServersByCategory(categorySlug: string): Server[] {
  return servers.filter(s => s.category.slug === categorySlug);
}

export function getFeaturedServers(): Server[] {
  return servers.filter(s => s.isFeatured);
}

export function getTopServersByVotes(limit: number = 10): Server[] {
  return [...servers]
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, limit);
}

export function getTopServersByPlayers(limit: number = 10): Server[] {
  return [...servers]
    .filter(s => s.isOnline)
    .sort((a, b) => (b.playerCount ?? 0) - (a.playerCount ?? 0))
    .slice(0, limit);
}

export function getNewServers(limit: number = 10): Server[] {
  return [...servers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function searchServers(query: string): Server[] {
  const lowerQuery = query.toLowerCase();
  return servers.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.shortDescription.toLowerCase().includes(lowerQuery) ||
    s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getTotalPlayers(): number {
  return servers
    .filter(s => s.isOnline)
    .reduce((sum, s) => sum + (s.playerCount ?? 0), 0);
}

export function getTotalServers(): number {
  return servers.length;
}

export function getOnlineServers(): number {
  return servers.filter(s => s.isOnline).length;
}
