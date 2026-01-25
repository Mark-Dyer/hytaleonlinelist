# Hytale Online List - Project Specification

> **Document Version**: 1.0
> **Last Updated**: January 13, 2026
> **Status**: Draft - Awaiting Review

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Market Research](#2-market-research)
3. [Feature Specification](#3-feature-specification)
4. [UI/UX Design](#4-uiux-design)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Database Design](#7-database-design)
8. [API Design](#8-api-design)
9. [Security & Anti-Abuse](#9-security--anti-abuse)
10. [Deployment & Infrastructure](#10-deployment--infrastructure)
11. [Implementation Phases](#11-implementation-phases)
12. [Monetization Strategy](#12-monetization-strategy)
13. [SEO Strategy](#13-seo-strategy)
14. [References](#14-references)

---

## 1. Project Overview

### 1.1 Project Name
**Hytale Online List**

### 1.2 Description
A server directory/listing website for the video game Hytale, similar to existing Minecraft server list websites. The platform allows players to discover, vote for, and connect to community-run Hytale servers.

### 1.3 Target Audience
- **Primary**: Hytale players looking for multiplayer servers
- **Secondary**: Server owners/administrators wanting to promote their servers

### 1.4 Market Timing
Hytale entered Early Access on January 13, 2026. This is an optimal time to launch a server list as:
- The game just released, creating immediate demand
- Existing competitors have basic implementations
- Early market entry allows for brand establishment

### 1.5 Project Goals
1. Become a top-tier Hytale server discovery platform
2. Provide accurate, real-time server information
3. Offer fair, transparent ranking systems
4. Create an excellent user experience for both players and server owners
5. Build a sustainable, monetizable platform

---

## 2. Market Research

### 2.1 Existing Hytale Server Lists

| Website | Features | Strengths | Weaknesses |
|---------|----------|-----------|------------|
| **Hytale-ServerList.com** | 54 servers, voting, categories, dark purple theme | Good SEO with Schema markup, clean UI | Pre-launch placeholder data |
| **HytaleOnlineServers.com** | Fair ranking system, 7+ years community presence | Community trust, established | Basic feature set |
| **HytaleLobby.com** | 24/7 monitoring, verified server IPs | Quality-focused approach | Limited server count |
| **HytaleList.eu** | European focus, live statistics | Regional niche targeting | Limited geographic scope |
| **Hytale-Servers.com** | Query plugin support, developer API | Technical features | Less polished UI |
| **ServerTilt.com/hytale** | Multi-game platform, votes & reviews | Existing user base | Generic, not Hytale-focused |
| **Hytale.game/servers** | RPG, SMP, Skyblock categories | Content variety | Basic functionality |
| **TopHytaleServer.net** | Search functionality, voting | Easy discovery | Limited features |
| **HytaleServer.xyz** | Free listings, daily bumps | Accessible to new servers | Basic UI |

### 2.2 Minecraft Server Lists (Reference Models)

These established platforms provide proven patterns:

| Website | Scale | Key Features | Lessons |
|---------|-------|--------------|---------|
| **Minecraft-Server-List.com** | 514K+ servers since 2010 | Comprehensive categories, monthly vote resets, abuse detection | Longevity requires anti-abuse measures |
| **Minecraft.buzz** | 7,980+ servers, 549K+ players | Real-time stats, smart search, sponsored slots, auction system | Real-time data is valuable |
| **Minerank.com** | Advanced analytics | Multi-factor ranking (votes + players + uptime + engagement) | Beyond-votes ranking builds trust |
| **TopG.org** | Multi-game platform | Paid advertising from $10, version/location filters | Monetization through ads works |
| **MinecraftServers.org** | Large community | Votifier protocol support, monthly resets, strict anti-bot | Votifier integration is expected |

### 2.3 Key Market Insights

1. **Dark themes dominate** - All successful server lists use dark color schemes
2. **Voting systems are standard** - Daily voting with monthly resets is the norm
3. **Real-time status matters** - Players want accurate online/offline indicators
4. **Copy-IP is essential** - One-click IP copying is a must-have feature
5. **Mobile responsiveness** - Many users browse on mobile devices
6. **Anti-abuse is critical** - Vote manipulation is a constant threat
7. **Monthly resets maintain fairness** - Prevents established servers from permanent dominance

---

## 3. Feature Specification

### 3.1 Core Features (MVP)

#### 3.1.1 Server Listings

| Feature | Description | Priority |
|---------|-------------|----------|
| Server Card Display | Name, IP, description, banner, icon, status | P0 |
| Player Count | Current players / max players | P0 |
| Online Status | Real-time online/offline indicator | P0 |
| Copy IP Button | One-click copy to clipboard with feedback | P0 |
| Server Version | Display compatible Hytale version | P0 |
| Categories/Tags | Survival, PvP, RPG, Creative, Minigames, Modded, etc. | P0 |
| Server Detail Page | Full description, stats, reviews, connect info | P0 |

#### 3.1.2 Discovery & Search

| Feature | Description | Priority |
|---------|-------------|----------|
| Full-text Search | Search by server name, description, tags | P0 |
| Category Filtering | Filter by game type (Survival, PvP, etc.) | P0 |
| Version Filtering | Filter by Hytale version compatibility | P1 |
| Sort Options | By votes, players online, newest, random | P0 |
| Pagination | Paginated results with configurable page size | P0 |

#### 3.1.3 Voting System

| Feature | Description | Priority |
|---------|-------------|----------|
| Vote Button | Prominent vote CTA on server cards/pages | P0 |
| Daily Limit | 1 vote per user per server per 24 hours | P0 |
| Monthly Reset | All votes reset on 1st of each month | P0 |
| Vote Count Display | Show total monthly votes | P0 |
| Vote Validation | Require authentication to vote | P0 |

#### 3.1.4 User Authentication

| Feature | Description | Priority |
|---------|-------------|----------|
| Registration | Email/password registration | P0 |
| OAuth Login | Discord, Google authentication | P0 |
| Email Verification | Verify email addresses | P0 |
| Password Reset | Forgot password flow | P0 |
| Profile Management | Edit username, avatar, email | P1 |

#### 3.1.5 Server Owner Dashboard

| Feature | Description | Priority |
|---------|-------------|----------|
| Add Server | Form to submit new server listing | P0 |
| Edit Server | Modify existing server details | P0 |
| Upload Assets | Banner image, server icon upload | P0 |
| View Statistics | Vote count, view count, click count | P1 |
| Server Verification | Verify server ownership | P1 |

### 3.2 Advanced Features (Post-MVP)

#### 3.2.1 Server Monitoring

| Feature | Description | Priority |
|---------|-------------|----------|
| Automated Pinging | Query servers every 5 minutes | P1 |
| Status History | Track uptime over time | P1 |
| Player Count History | Historical player graphs | P2 |
| Uptime Percentage | Calculate and display uptime % | P1 |
| Query Plugin Support | Nitrado Query Plugin integration | P1 |

#### 3.2.2 Reviews & Ratings

| Feature | Description | Priority |
|---------|-------------|----------|
| Star Ratings | 1-5 star rating system | P2 |
| Written Reviews | Text reviews with moderation | P2 |
| Review Voting | Helpful/not helpful on reviews | P3 |
| Owner Responses | Server owners can respond to reviews | P3 |

#### 3.2.3 Enhanced Rankings

| Feature | Description | Priority |
|---------|-------------|----------|
| Multi-factor Ranking | Combine votes, players, uptime, engagement | P2 |
| Trending Section | Recently popular servers | P2 |
| Rising Section | Fast-growing new servers | P2 |
| Featured Servers | Manually curated highlights | P1 |

#### 3.2.4 Community Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Server Comments | Discussion on server pages | P3 |
| Server News | Owners post updates/announcements | P3 |
| Discord Integration | Bot for status notifications | P3 |
| Social Sharing | Share server on social media | P2 |

#### 3.2.5 API & Integrations

| Feature | Description | Priority |
|---------|-------------|----------|
| Public REST API | API for server owners/developers | P2 |
| Votifier Support | Send vote notifications to servers | P2 |
| Webhook Notifications | Notify servers of votes/events | P3 |
| API Key Management | Generate and manage API keys | P2 |

#### 3.2.6 Premium Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Featured Listings | Paid top placement | P2 |
| Sponsored Slots | Banner ad positions | P2 |
| Premium Profiles | Enhanced server customization | P3 |
| Advanced Analytics | Detailed traffic analytics | P3 |

---

## 4. UI/UX Design

### 4.1 Design Principles

1. **Dark Theme First** - Gaming aesthetic with dark backgrounds
2. **Mobile Responsive** - Works seamlessly on all devices
3. **Fast & Lightweight** - Minimal load times, optimized assets
4. **Clear Hierarchy** - Important info (status, players) prominently displayed
5. **Minimal Friction** - Voting and connecting should be effortless
6. **Consistent Patterns** - Familiar UI conventions from gaming sites

### 4.2 Color Palette

```
Primary Background:    #0f0f1a (Deep dark blue-black)
Secondary Background:  #1a1a2e (Slightly lighter)
Card Background:       #16213e (Card surfaces)
Primary Accent:        #7c3aed (Purple - brand color)
Secondary Accent:      #06b6d4 (Cyan - highlights)
Success:               #10b981 (Green - online status)
Error:                 #ef4444 (Red - offline/errors)
Warning:               #f59e0b (Orange - warnings)
Text Primary:          #f8fafc (White text)
Text Secondary:        #94a3b8 (Muted text)
Text Muted:            #64748b (Very muted)
Border:                #334155 (Subtle borders)
```

### 4.3 Typography

- **Headings**: Inter or Geist Sans (clean, modern)
- **Body**: Inter or system font stack
- **Monospace**: JetBrains Mono (for IP addresses)

### 4.4 Component Specifications

#### 4.4.1 Server Card (List View)

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌──────┐                                                        │
│ │ ICON │  Server Name Here                    [VOTE: 1,234]    │
│ │64x64 │  ───────────────────────────────────                  │
│ └──────┘  🏷️ Survival | 📦 v1.0 | 👥 125/500 | ● Online        │
│                                                                 │
│  Brief description of the server goes here. This should be     │
│  truncated to 2 lines maximum with ellipsis...                 │
│                                                                 │
│  ┌─────────────────────────────────────┐  ┌─────────────────┐  │
│  │ play.serverexample.com         [📋] │  │   VIEW SERVER   │  │
│  └─────────────────────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.4.2 Server Card (Grid View)

```
┌────────────────────────────────────┐
│ ┌────────────────────────────────┐ │
│ │         BANNER IMAGE           │ │
│ │          468 x 60              │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────┐  Server Name                │
│ │ICON│  🏷️ Survival | ● Online    │
│ └────┘  👥 125/500                 │
│                                    │
│ Brief description text here...    │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ play.server.com         [📋] │  │
│ └──────────────────────────────┘  │
│                                    │
│ [    VOTE    ]  [  VIEW  ]        │
│                                    │
└────────────────────────────────────┘
```

#### 4.4.3 Navigation Bar

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [LOGO]   Home | Servers ▼ | Add Server | Blog    [Search🔍] [Login]   │
│                    │                                                    │
│                    ├── All Servers                                      │
│                    ├── Survival                                         │
│                    ├── PvP                                              │
│                    ├── Creative                                         │
│                    ├── RPG                                              │
│                    ├── Minigames                                        │
│                    └── Modded                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 4.4.4 Server Detail Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BANNER IMAGE (Full Width)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────┐   Server Name                                                 │
│  │ ICON │   🏷️ Survival, PvP | 📦 Version 1.0                          │
│  │128x  │   ● Online | 👥 125/500 players | ⬆️ 98.5% uptime            │
│  └──────┘                                                               │
│                                                                          │
│  ┌─────────────────────────────────┐  ┌──────────┐  ┌──────────┐       │
│  │ play.server.com:5520       [📋] │  │  VOTE    │  │  WEBSITE │       │
│  └─────────────────────────────────┘  │  (1,234) │  └──────────┘       │
│                                        └──────────┘                     │
├─────────────────────────────────────────────────────────────────────────┤
│  [Description] [Statistics] [Reviews (24)] [How to Connect]             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  DESCRIPTION TAB:                                                        │
│  ─────────────────                                                       │
│  Full server description with markdown support.                          │
│  • Feature 1                                                             │
│  • Feature 2                                                             │
│  • Feature 3                                                             │
│                                                                          │
│  STATISTICS TAB:                                                         │
│  ─────────────────                                                       │
│  [Player Count Graph - 7 days]                                           │
│  [Uptime Chart]                                                          │
│  Total Votes: 1,234 | Views: 5,678 | Uptime: 98.5%                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Page Structure

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, featured servers, recent servers, categories |
| Server List | `/servers` | Paginated list with filters and search |
| Category List | `/servers/[category]` | Filtered by category (survival, pvp, etc.) |
| Server Detail | `/server/[slug]` | Full server information page |
| Add Server | `/servers/add` | Form to submit new server (auth required) |
| Edit Server | `/servers/[slug]/edit` | Edit server details (owner only) |
| Dashboard | `/dashboard` | Server owner dashboard |
| Login | `/login` | Authentication page |
| Register | `/register` | Registration page |
| Profile | `/profile` | User profile management |
| About | `/about` | About the platform |
| FAQ | `/faq` | Frequently asked questions |
| Contact | `/contact` | Contact form |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |

### 4.6 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640px - 1024px | 2 column grid |
| Desktop | 1024px - 1280px | 3 column grid |
| Large Desktop | > 1280px | 4 column grid with sidebar |

---

## 5. Technology Stack

### 5.1 Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 (App Router) | React-based UI with SSR/SSG |
| **Frontend Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS + component library |
| **BFF (Backend for Frontend)** | Next.js API Routes | Frontend-specific API layer |
| **Backend API** | Spring Boot 3.x | Core business logic and data API |
| **Database** | PostgreSQL (Self-hosted) | Primary data store |
| **Caching** | Redis (Self-hosted) | Session caching, rate limiting, leaderboards |
| **File Storage** | MinIO or Local Storage | Server banners and icons |
| **Scheduled Jobs** | Spring Boot Scheduler | Server pinging, vote resets, cleanup |
| **Deployment** | Coolify (Self-hosted) | Container orchestration |

### 5.2 Frontend Stack (Next.js)

```
Framework:        Next.js 15 (App Router)
Language:         TypeScript 5.x
React:            React 19
Styling:          Tailwind CSS v4
Components:       shadcn/ui
State Management: React Context + TanStack Query
Forms:            React Hook Form + Zod validation
HTTP Client:      Fetch API / Axios
Charts:           Recharts or Chart.js
Icons:            Lucide React
Animations:       Framer Motion (optional)
```

### 5.3 Backend Stack (Spring Boot)

```
Framework:        Spring Boot 3.3.x
Language:         Java 21 (or Kotlin)
Build Tool:       Gradle or Maven
Web:              Spring Web MVC
Security:         Spring Security
Data:             Spring Data JPA
Database:         PostgreSQL 16
Caching:          Spring Cache + Redis
Scheduling:       Spring Scheduler (@Scheduled)
Validation:       Jakarta Validation
Documentation:    SpringDoc OpenAPI (Swagger)
Testing:          JUnit 5 + Mockito + Testcontainers
```

### 5.4 Infrastructure

```
Container Runtime:   Docker
Orchestration:       Coolify (self-hosted PaaS)
Reverse Proxy:       Traefik (via Coolify) or Nginx
SSL:                 Let's Encrypt (auto-managed)
Database:            PostgreSQL 16 (Docker container)
Cache:               Redis 7 (Docker container)
File Storage:        MinIO (S3-compatible) or mounted volume
Monitoring:          Prometheus + Grafana (optional)
Logging:             Loki or ELK Stack (optional)
```

### 5.5 Development Tools

```
IDE:                 IntelliJ IDEA / VS Code
Version Control:     Git + GitHub/GitLab
API Testing:         Postman / Insomnia
Database Client:     DBeaver / pgAdmin
Container Dev:       Docker Desktop
Code Quality:        ESLint, Prettier, SonarQube
```

---

## 6. System Architecture

### 6.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│                    (Browsers, Mobile Devices)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY (Traefik)                          │
│                    SSL Termination, Load Balancing                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│         NEXT.JS FRONTEND        │   │       SPRING BOOT BACKEND       │
│       (UI + BFF API Layer)      │   │        (Core API Server)        │
│                                 │   │                                 │
│  • Server-Side Rendering        │   │  • REST API Endpoints           │
│  • Static Generation            │   │  • Business Logic               │
│  • API Routes (BFF)             │   │  • Authentication/Authorization │
│  • Client Components            │   │  • Data Validation              │
│                                 │   │  • Scheduled Jobs               │
│  Port: 3000                     │   │  Port: 8080                     │
└─────────────────────────────────┘   └─────────────────────────────────┘
                    │                               │
                    │                               │
                    │         ┌─────────────────────┤
                    │         │                     │
                    ▼         ▼                     ▼
            ┌─────────────────────┐       ┌─────────────────────┐
            │       REDIS         │       │     POSTGRESQL      │
            │   (Cache Layer)     │       │     (Database)      │
            │                     │       │                     │
            │  • Session Store    │       │  • Users            │
            │  • Rate Limiting    │       │  • Servers          │
            │  • Leaderboards     │       │  • Votes            │
            │  • Query Cache      │       │  • Reviews          │
            │                     │       │  • Statistics       │
            │  Port: 6379         │       │  Port: 5432         │
            └─────────────────────┘       └─────────────────────┘
                                                   │
                                                   │
                                          ┌────────┴────────┐
                                          ▼                 ▼
                                  ┌─────────────┐   ┌─────────────┐
                                  │   MINIO     │   │   HYTALE    │
                                  │  (Storage)  │   │   SERVERS   │
                                  │             │   │  (External) │
                                  │  • Banners  │   │             │
                                  │  • Icons    │   │  • Ping     │
                                  │             │   │  • Query    │
                                  └─────────────┘   └─────────────┘
```

### 6.2 Request Flow

#### 6.2.1 Page Request (SSR)

```
Browser → Traefik → Next.js → (fetch data from Spring Boot) → Render HTML → Browser
```

#### 6.2.2 API Request (Client-Side)

```
Browser → Next.js BFF Route → Spring Boot API → PostgreSQL → Response
```

#### 6.2.3 Authentication Flow

```
Browser → Next.js → Spring Boot Auth Endpoint → Validate → JWT Token → Browser
```

### 6.3 Backend for Frontend (BFF) Pattern

The Next.js API routes act as a BFF layer:

```
┌──────────────────────────────────────────────────────────────┐
│                     NEXT.JS BFF LAYER                         │
│                                                               │
│  /api/servers        →  Aggregates server data + stats       │
│  /api/servers/[id]   →  Single server with enriched data     │
│  /api/vote           →  Handles vote + updates UI state      │
│  /api/auth/*         →  Proxies to Spring Boot auth          │
│  /api/upload         →  Handles file upload to MinIO         │
│                                                               │
│  Benefits:                                                    │
│  • Reduces client-side API calls                              │
│  • Can aggregate multiple backend calls                       │
│  • Handles auth token management                              │
│  • Optimizes data for frontend needs                          │
└──────────────────────────────────────────────────────────────┘
```

### 6.4 Spring Boot Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| Server Ping | Every 5 minutes | Query all servers for status/player count |
| Vote Reset | 1st of month, 00:00 UTC | Reset all vote counts to zero |
| Cleanup Expired Sessions | Every hour | Remove expired sessions from Redis |
| Statistics Aggregation | Every 15 minutes | Calculate ranking scores |
| Uptime Calculation | Daily at 00:00 | Calculate daily uptime percentages |
| Old Stats Cleanup | Weekly | Archive/delete old statistical data |

---

## 7. Database Design

### 7.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │   SERVERS   │       │   VOTES     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)     │
│ email       │  │    │ owner_id(FK)│◄─┘    │ server_id(FK)◄───┐
│ username    │  │    │ name        │       │ user_id (FK)│◄─┐ │
│ password    │  └───►│ slug        │       │ ip_address  │  │ │
│ avatar_url  │       │ ip_address  │       │ username    │  │ │
│ role        │       │ port        │       │ voted_at    │  │ │
│ verified    │       │ description │       └─────────────┘  │ │
│ created_at  │       │ banner_url  │                        │ │
│ updated_at  │       │ icon_url    │       ┌─────────────┐  │ │
└─────────────┘       │ category    │       │   REVIEWS   │  │ │
                      │ tags        │       ├─────────────┤  │ │
                      │ version     │       │ id (PK)     │  │ │
                      │ is_online   │◄──────│ server_id(FK)◄─┼─┘
                      │ player_count│       │ user_id (FK)│◄─┘
                      │ max_players │       │ rating      │
                      │ uptime_pct  │       │ content     │
                      │ vote_count  │       │ created_at  │
                      │ is_featured │       │ updated_at  │
                      │ created_at  │       └─────────────┘
                      │ updated_at  │
                      └─────────────┘
                             │
                             │
                      ┌──────┴──────┐
                      ▼             ▼
               ┌─────────────┐ ┌─────────────┐
               │SERVER_STATS │ │SERVER_PINGS │
               ├─────────────┤ ├─────────────┤
               │ id (PK)     │ │ id (PK)     │
               │ server_id(FK)│ │ server_id(FK)│
               │ player_count│ │ is_online   │
               │ is_online   │ │ latency_ms  │
               │ recorded_at │ │ player_count│
               └─────────────┘ │ pinged_at   │
                               └─────────────┘
```

### 7.2 Table Definitions

#### 7.2.1 users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),
    avatar_url      VARCHAR(500),
    role            VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    oauth_provider  VARCHAR(50),
    oauth_id        VARCHAR(255),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
```

#### 7.2.2 servers

```sql
CREATE TABLE servers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    slug                VARCHAR(100) NOT NULL UNIQUE,
    ip_address          VARCHAR(255) NOT NULL,
    port                INTEGER NOT NULL DEFAULT 5520,
    short_description   VARCHAR(200),
    description         TEXT,
    banner_url          VARCHAR(500),
    icon_url            VARCHAR(500),
    website_url         VARCHAR(500),
    discord_url         VARCHAR(500),
    category            VARCHAR(50) NOT NULL,
    tags                TEXT[], -- PostgreSQL array
    version             VARCHAR(20),
    is_online           BOOLEAN NOT NULL DEFAULT FALSE,
    player_count        INTEGER NOT NULL DEFAULT 0,
    max_players         INTEGER NOT NULL DEFAULT 0,
    uptime_percentage   DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    vote_count          INTEGER NOT NULL DEFAULT 0,
    view_count          INTEGER NOT NULL DEFAULT 0,
    last_pinged_at      TIMESTAMP WITH TIME ZONE,
    votifier_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
    votifier_host       VARCHAR(255),
    votifier_port       INTEGER,
    votifier_token      VARCHAR(255),
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_servers_owner ON servers(owner_id);
CREATE INDEX idx_servers_category ON servers(category);
CREATE INDEX idx_servers_is_online ON servers(is_online);
CREATE INDEX idx_servers_vote_count ON servers(vote_count DESC);
CREATE INDEX idx_servers_player_count ON servers(player_count DESC);
CREATE INDEX idx_servers_created_at ON servers(created_at DESC);
CREATE INDEX idx_servers_slug ON servers(slug);
```

#### 7.2.3 votes

```sql
CREATE TABLE votes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id   UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address  INET NOT NULL,
    username    VARCHAR(50) NOT NULL,
    voted_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Ensure one vote per user per server per day
    CONSTRAINT unique_daily_vote UNIQUE (server_id, user_id, (voted_at::date))
);

-- Indexes
CREATE INDEX idx_votes_server ON votes(server_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_date ON votes(voted_at);
CREATE INDEX idx_votes_ip ON votes(ip_address);
```

#### 7.2.4 reviews

```sql
CREATE TABLE reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id   UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content     TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- One review per user per server
    CONSTRAINT unique_user_review UNIQUE (server_id, user_id)
);

-- Indexes
CREATE INDEX idx_reviews_server ON reviews(server_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
```

#### 7.2.5 server_stats (Historical Data)

```sql
CREATE TABLE server_stats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id       UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    player_count    INTEGER NOT NULL,
    is_online       BOOLEAN NOT NULL,
    recorded_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stats_server ON server_stats(server_id);
CREATE INDEX idx_stats_recorded ON server_stats(recorded_at);

-- Partition by month for performance (optional)
-- CREATE TABLE server_stats_2026_01 PARTITION OF server_stats
--     FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

#### 7.2.6 categories (Reference Table)

```sql
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    slug        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    icon        VARCHAR(50),
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Seed data
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
    ('Survival', 'survival', 'Classic survival gameplay', 'shield', 1),
    ('PvP', 'pvp', 'Player versus player combat', 'swords', 2),
    ('Creative', 'creative', 'Building and creativity focused', 'brush', 3),
    ('RPG', 'rpg', 'Role-playing game servers', 'scroll', 4),
    ('Minigames', 'minigames', 'Various mini-games', 'gamepad', 5),
    ('Adventure', 'adventure', 'Story and adventure modes', 'map', 6),
    ('Modded', 'modded', 'Servers with modifications', 'puzzle', 7);
```

---

## 8. API Design

### 8.1 API Overview

| Service | Base URL | Purpose |
|---------|----------|---------|
| Next.js BFF | `/api/*` | Frontend-optimized endpoints |
| Spring Boot | `/api/v1/*` | Core backend API |

### 8.2 Spring Boot API Endpoints

#### 8.2.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login with email/password |
| POST | `/api/v1/auth/oauth/{provider}` | OAuth login (Discord, Google) |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/refresh` | Refresh JWT token |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password with token |
| GET | `/api/v1/auth/verify-email` | Verify email address |
| GET | `/api/v1/auth/me` | Get current user |

#### 8.2.2 Servers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/servers` | List servers (paginated, filterable) |
| GET | `/api/v1/servers/{slug}` | Get server by slug |
| POST | `/api/v1/servers` | Create new server (auth required) |
| PUT | `/api/v1/servers/{id}` | Update server (owner only) |
| DELETE | `/api/v1/servers/{id}` | Delete server (owner only) |
| GET | `/api/v1/servers/{id}/stats` | Get server statistics |
| POST | `/api/v1/servers/{id}/bump` | Bump server (daily limit) |

#### 8.2.3 Votes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/servers/{id}/vote` | Vote for server |
| GET | `/api/v1/servers/{id}/votes` | Get vote history |
| GET | `/api/v1/votes/can-vote/{serverId}` | Check if user can vote |

#### 8.2.4 Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/servers/{id}/reviews` | Get server reviews |
| POST | `/api/v1/servers/{id}/reviews` | Create review |
| PUT | `/api/v1/reviews/{id}` | Update review |
| DELETE | `/api/v1/reviews/{id}` | Delete review |

#### 8.2.5 Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/categories/{slug}` | Get category details |

#### 8.2.6 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/{id}` | Get user profile |
| PUT | `/api/v1/users/{id}` | Update user profile |
| GET | `/api/v1/users/{id}/servers` | Get user's servers |

### 8.3 Query Parameters (Server List)

```
GET /api/v1/servers?
    page=1                    # Page number (default: 1)
    size=20                   # Page size (default: 20, max: 100)
    sort=votes               # Sort field: votes, players, newest, random
    order=desc               # Sort order: asc, desc
    category=survival        # Filter by category
    version=1.0              # Filter by version
    online=true              # Filter by online status
    search=keyword           # Full-text search
    featured=true            # Only featured servers
```

### 8.4 Response Formats

#### Success Response
```json
{
    "success": true,
    "data": { ... },
    "meta": {
        "page": 1,
        "size": 20,
        "total": 150,
        "totalPages": 8
    }
}
```

#### Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            { "field": "email", "message": "Invalid email format" }
        ]
    }
}
```

---

## 9. Security & Anti-Abuse

### 9.1 Authentication Security

| Measure | Implementation |
|---------|----------------|
| Password Hashing | BCrypt with cost factor 12 |
| JWT Tokens | Short-lived access (15min), long-lived refresh (7d) |
| Token Storage | HttpOnly cookies, not localStorage |
| CSRF Protection | CSRF tokens for state-changing requests |
| Rate Limiting | Login attempts limited to 5/minute |

### 9.2 Vote Abuse Prevention

| Measure | Implementation |
|---------|----------------|
| Authentication Required | Must be logged in to vote |
| Daily Limit | 1 vote per user per server per 24h |
| IP Tracking | Track IP to detect multi-account abuse |
| Monthly Reset | All votes reset on 1st of month |
| Suspicious Activity Detection | Flag rapid voting patterns |
| Manual Review | Admin can investigate flagged accounts |
| CAPTCHA | reCAPTCHA for suspicious requests |

### 9.3 API Security

| Measure | Implementation |
|---------|----------------|
| Rate Limiting | Redis-based rate limiting per IP/user |
| Input Validation | Strict validation on all inputs |
| SQL Injection Prevention | Parameterized queries via JPA |
| XSS Prevention | Output encoding, CSP headers |
| CORS | Strict origin whitelist |
| HTTPS Only | Force HTTPS, HSTS headers |

### 9.4 Server Listing Security

| Measure | Implementation |
|---------|----------------|
| Server Verification | Optional domain/IP verification |
| Content Moderation | Flag inappropriate content |
| Spam Prevention | Limit servers per user, review queue |
| Duplicate Detection | Check for duplicate IP listings |

---

## 10. Deployment & Infrastructure

### 10.1 Deployment Platform

**Coolify** (Self-hosted PaaS)

Coolify provides:
- Docker container management
- Automatic SSL via Let's Encrypt
- Git-based deployments
- Environment variable management
- Built-in reverse proxy (Traefik)

### 10.2 Container Architecture

```yaml
# docker-compose.yml (conceptual)
services:
  # Frontend
  frontend:
    image: hytale-online-list-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
    depends_on:
      - backend

  # Backend
  backend:
    image: hytale-online-list-backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/hytale
      - SPRING_REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  # Database
  postgres:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=hytale
      - POSTGRES_USER=hytale
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  # Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # File Storage (optional)
  minio:
    image: minio/minio
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### 10.3 Environment Configuration

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://api.hytaleonlinelist.com
NEXT_PUBLIC_SITE_URL=https://hytaleonlinelist.com
```

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hytale
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  redis:
    host: ${REDIS_HOST}
    port: 6379
  security:
    jwt:
      secret: ${JWT_SECRET}
      expiration: 900000  # 15 minutes
      refresh-expiration: 604800000  # 7 days

app:
  cors:
    allowed-origins: https://hytaleonlinelist.com
  upload:
    max-size: 5MB
    allowed-types: image/png,image/jpeg,image/gif
```

### 10.4 Backup Strategy

| Data | Frequency | Retention | Method |
|------|-----------|-----------|--------|
| PostgreSQL | Daily | 30 days | pg_dump to S3/storage |
| Redis | Hourly | 7 days | RDB snapshots |
| Uploaded Files | Real-time | Indefinite | MinIO replication |

---

## 11. Implementation Phases

### Phase 1: Foundation (MVP)

**Goal**: Basic functional server list with voting

| Task | Description |
|------|-------------|
| 1.1 | Project setup (Next.js + Spring Boot) |
| 1.2 | Database schema + migrations |
| 1.3 | User authentication (register, login, OAuth) |
| 1.4 | Server CRUD operations |
| 1.5 | Server listing pages (list, detail, category) |
| 1.6 | Search and filtering |
| 1.7 | Voting system with daily limits |
| 1.8 | Server owner dashboard |
| 1.9 | File upload for banners/icons |
| 1.10 | Basic responsive styling |

### Phase 2: Server Monitoring

**Goal**: Real-time server status and statistics

| Task | Description |
|------|-------------|
| 2.1 | Server ping service (UDP/HTTP query) |
| 2.2 | Scheduled ping job (every 5 min) |
| 2.3 | Status indicator on server cards |
| 2.4 | Historical stats storage |
| 2.5 | Player count graphs |
| 2.6 | Uptime calculation and display |

### Phase 3: Community Features

**Goal**: Reviews, ratings, and engagement

| Task | Description |
|------|-------------|
| 3.1 | Review submission system |
| 3.2 | Star rating display |
| 3.3 | Review moderation queue |
| 3.4 | Enhanced ranking algorithm |
| 3.5 | Trending/rising sections |
| 3.6 | Social sharing integration |

### Phase 4: Monetization & Polish

**Goal**: Revenue generation and polish

| Task | Description |
|------|-------------|
| 4.1 | Featured listing system |
| 4.2 | Payment integration (Stripe) |
| 4.3 | Ad placement system |
| 4.4 | SEO optimization (Schema markup) |
| 4.5 | Performance optimization |
| 4.6 | Analytics dashboard |

### Phase 5: Advanced Features

**Goal**: API and integrations

| Task | Description |
|------|-------------|
| 5.1 | Public REST API |
| 5.2 | API key management |
| 5.3 | Votifier protocol support |
| 5.4 | Discord bot integration |
| 5.5 | Webhook notifications |

---

## 12. Monetization Strategy

### 12.1 Revenue Streams

| Stream | Price | Description |
|--------|-------|-------------|
| Featured Listing | $20-50/month | Top placement in category |
| Homepage Spotlight | $50-100/month | Featured on homepage |
| Banner Ads | CPM/CPC | Sidebar and header ads |
| Premium Profile | $10/month | Enhanced customization |
| API Access (High Volume) | $25/month | Increased rate limits |

### 12.2 Payment Integration

- **Provider**: Stripe
- **Methods**: Credit/debit cards, PayPal (via Stripe)
- **Subscriptions**: Monthly recurring for featured listings
- **One-time**: Boost campaigns, promotional spots

---

## 13. SEO Strategy

### 13.1 Technical SEO

| Element | Implementation |
|---------|----------------|
| Schema Markup | ItemList, WebSite, Organization, Review |
| Meta Tags | Dynamic per-page titles and descriptions |
| Open Graph | Social sharing meta tags |
| Sitemap | Auto-generated XML sitemap |
| Robots.txt | Proper crawl directives |
| Canonical URLs | Prevent duplicate content |
| Clean URLs | `/server/server-name` format |

### 13.2 Content Strategy

| Content Type | Purpose |
|--------------|---------|
| Server Pages | Individual server SEO |
| Category Pages | Category keyword targeting |
| Blog Posts | Hytale news, guides, tutorials |
| FAQ Page | Answer common questions |
| How-to Guides | "How to join Hytale servers" |

### 13.3 Schema Markup Example

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Top Hytale Servers",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "GameServer",
        "name": "Example Server",
        "description": "A great survival server",
        "url": "https://hytaleonlinelist.com/server/example"
      }
    }
  ]
}
```

---

## 14. References

### 14.1 Hytale Resources

- [Official Hytale Website](https://hytale.com/)
- [Hytale Server Manual](https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual)
- [Nitrado Query Plugin](https://github.com/nitrado/hytale-plugin-query)
- [Hytale Wikipedia](https://en.wikipedia.org/wiki/Hytale)

### 14.2 Competitor Analysis

- [Hytale-ServerList.com](https://hytale-serverlist.com)
- [HytaleOnlineServers.com](https://hytaleonlineservers.com)
- [HytaleLobby.com](https://www.hytalelobby.com)
- [Minecraft-Server-List.com](https://minecraft-server-list.com)
- [Minecraft.buzz](https://minecraft.buzz)
- [Minerank.com](https://servers-minecraft.net)

### 14.3 Technology Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Coolify Documentation](https://coolify.io/docs)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-13 | - | Initial specification |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Owner | | | |
| Technical Lead | | | |

---

*This document is subject to change. Please ensure you are referencing the latest version.*
