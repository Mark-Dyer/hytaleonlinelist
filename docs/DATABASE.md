# Database Schema Documentation

This document describes the PostgreSQL database schema, entities, relationships, and data model for Hytale Online List.

## Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Tables](#tables)
4. [Indexes](#indexes)
5. [Enumerations](#enumerations)
6. [Migrations](#migrations)

---

## Overview

### Database Information

| Property | Value |
|----------|-------|
| Database Type | PostgreSQL 15+ |
| Character Set | UTF-8 |
| Migration Tool | Flyway 11.x |
| ORM | Hibernate / Spring Data JPA |

### Schema Statistics

| Metric | Count |
|--------|-------|
| Tables | 9 |
| Indexes | 20+ |
| Foreign Keys | 12 |
| Enumerations | 5 |

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   ┌──────────────────┐         ┌──────────────────┐         ┌────────────────┐ │
│   │     users        │         │     servers      │         │   categories   │ │
│   ├──────────────────┤         ├──────────────────┤         ├────────────────┤ │
│   │ id (PK)          │◄───┐    │ id (PK)          │    ┌───►│ id (PK)        │ │
│   │ username         │    │    │ name             │    │    │ name           │ │
│   │ email            │    │    │ slug             │    │    │ slug           │ │
│   │ password_hash    │    │    │ ip_address       │    │    │ description    │ │
│   │ avatar_url       │    │    │ port             │    │    │ icon           │ │
│   │ bio              │    │    │ owner_id (FK)────┼────┘    └────────────────┘ │
│   │ role             │    │    │ category_id (FK)─┼────┘                       │
│   │ email_verified   │    │    │ is_online        │                            │
│   │ oauth_provider   │    │    │ player_count     │                            │
│   │ oauth_id         │    │    │ vote_count       │                            │
│   │ is_banned        │    │    │ ...              │                            │
│   │ created_at       │    │    └────────┬─────────┘                            │
│   └────────┬─────────┘    │             │                                      │
│            │              │             │                                      │
│            │              │             │                                      │
│   ┌────────┴─────────┐    │    ┌────────┴─────────┐                           │
│   │                  │    │    │                  │                           │
│   ▼                  ▼    │    ▼                  ▼                           │
│ ┌──────────────┐ ┌───────┴────────┐ ┌──────────────┐ ┌────────────────────┐  │
│ │refresh_tokens│ │    reviews     │ │    votes     │ │server_status_history│  │
│ ├──────────────┤ ├────────────────┤ ├──────────────┤ ├────────────────────┤  │
│ │ id (PK)      │ │ id (PK)        │ │ id (PK)      │ │ id (PK)            │  │
│ │ user_id (FK) │ │ server_id (FK) │ │ server_id(FK)│ │ server_id (FK)     │  │
│ │ token        │ │ user_id (FK)   │ │ user_id (FK) │ │ is_online          │  │
│ │ expires_at   │ │ rating         │ │ voted_at     │ │ player_count       │  │
│ │ revoked      │ │ content        │ │ vote_date    │ │ response_time_ms   │  │
│ │ created_at   │ │ created_at     │ └──────────────┘ │ query_protocol     │  │
│ └──────────────┘ │ updated_at     │                  │ recorded_at        │  │
│                  └────────────────┘                  └────────────────────┘  │
│                                                                              │
│   ┌──────────────────┐         ┌──────────────────┐                         │
│   │   server_tags    │         │   admin_actions  │                         │
│   ├──────────────────┤         ├──────────────────┤                         │
│   │ id (PK)          │         │ id (PK)          │                         │
│   │ server_id (FK)   │         │ admin_id (FK)────┼─────► users             │
│   │ tag              │         │ action_type      │                         │
│   └──────────────────┘         │ target_type      │                         │
│                                │ target_id        │                         │
│                                │ details          │                         │
│                                │ created_at       │                         │
│                                └──────────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tables

### users

Stores user account information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `username` | VARCHAR(50) | NO | - | Unique display name |
| `email` | VARCHAR(255) | NO | - | Unique email address |
| `password_hash` | VARCHAR(255) | YES | NULL | BCrypt hashed password (null for OAuth users) |
| `avatar_url` | VARCHAR(500) | YES | NULL | Profile picture URL |
| `bio` | TEXT | YES | NULL | User biography |
| `role` | VARCHAR(20) | NO | 'USER' | User role (USER, MODERATOR, ADMIN) |
| `email_verified` | BOOLEAN | NO | FALSE | Email verification status |
| `oauth_provider` | VARCHAR(20) | YES | NULL | OAuth provider (DISCORD, GOOGLE) |
| `oauth_id` | VARCHAR(255) | YES | NULL | OAuth provider user ID |
| `email_verification_token` | VARCHAR(255) | YES | NULL | Email verification token |
| `email_verification_token_expiry` | TIMESTAMP | YES | NULL | Token expiration time |
| `password_reset_token` | VARCHAR(255) | YES | NULL | Password reset token |
| `password_reset_token_expiry` | TIMESTAMP | YES | NULL | Token expiration time |
| `is_banned` | BOOLEAN | NO | FALSE | Ban status |
| `banned_at` | TIMESTAMP | YES | NULL | When user was banned |
| `banned_reason` | VARCHAR(500) | YES | NULL | Reason for ban |
| `created_at` | TIMESTAMP | NO | NOW() | Account creation time |
| `updated_at` | TIMESTAMP | NO | NOW() | Last update time |

**Constraints**:
- PRIMARY KEY (`id`)
- UNIQUE (`username`)
- UNIQUE (`email`)
- UNIQUE (`oauth_provider`, `oauth_id`) - WHERE oauth_provider IS NOT NULL

---

### servers

Stores server listing information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `name` | VARCHAR(100) | NO | - | Server display name |
| `slug` | VARCHAR(120) | NO | - | URL-friendly identifier |
| `ip_address` | VARCHAR(255) | NO | - | Server IP address |
| `port` | INTEGER | NO | 5520 | Server port |
| `short_description` | VARCHAR(200) | NO | - | Brief description |
| `description` | TEXT | NO | - | Full description |
| `banner_url` | VARCHAR(500) | YES | NULL | Banner image URL |
| `icon_url` | VARCHAR(500) | YES | NULL | Icon image URL |
| `website_url` | VARCHAR(500) | YES | NULL | Server website |
| `discord_url` | VARCHAR(500) | YES | NULL | Discord invite URL |
| `version` | VARCHAR(50) | YES | NULL | Game version |
| `is_online` | BOOLEAN | NO | FALSE | Current online status |
| `player_count` | INTEGER | YES | NULL | Current player count |
| `max_players` | INTEGER | YES | NULL | Maximum players |
| `uptime_percentage` | DECIMAL(5,2) | NO | 0.0 | 24-hour uptime % |
| `vote_count` | INTEGER | NO | 0 | Total votes received |
| `review_count` | INTEGER | NO | 0 | Total reviews |
| `average_rating` | DECIMAL(2,1) | YES | NULL | Average review rating |
| `view_count` | INTEGER | NO | 0 | Page view count |
| `is_featured` | BOOLEAN | NO | FALSE | Featured server flag |
| `is_verified` | BOOLEAN | NO | FALSE | Verified server flag |
| `owner_id` | UUID | NO | - | Owner user reference |
| `category_id` | UUID | NO | - | Category reference |
| `preferred_query_protocol` | VARCHAR(20) | YES | NULL | Last successful protocol |
| `query_port` | INTEGER | YES | NULL | Query port if different |
| `created_at` | TIMESTAMP | NO | NOW() | Creation time |
| `last_pinged_at` | TIMESTAMP | YES | NULL | Last status check time |

**Constraints**:
- PRIMARY KEY (`id`)
- UNIQUE (`slug`)
- FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`)
- FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)

---

### categories

Stores server category definitions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `name` | VARCHAR(50) | NO | - | Category display name |
| `slug` | VARCHAR(50) | NO | - | URL-friendly identifier |
| `description` | VARCHAR(500) | NO | - | Category description |
| `icon` | VARCHAR(50) | NO | - | Icon identifier |

**Constraints**:
- PRIMARY KEY (`id`)
- UNIQUE (`name`)
- UNIQUE (`slug`)

**Default Categories**:
| Name | Slug | Icon |
|------|------|------|
| Survival | survival | shield |
| PvP | pvp | swords |
| Creative | creative | brush |
| RPG | rpg | scroll |
| Minigames | minigames | gamepad-2 |
| Adventure | adventure | map |
| Modded | modded | puzzle |

---

### reviews

Stores user reviews for servers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `server_id` | UUID | NO | - | Server reference |
| `user_id` | UUID | NO | - | Author reference |
| `rating` | INTEGER | NO | - | Star rating (1-5) |
| `content` | TEXT | NO | - | Review text |
| `created_at` | TIMESTAMP | NO | NOW() | Creation time |
| `updated_at` | TIMESTAMP | NO | NOW() | Last update time |

**Constraints**:
- PRIMARY KEY (`id`)
- UNIQUE (`server_id`, `user_id`) - One review per user per server
- FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE
- FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
- CHECK (`rating` >= 1 AND `rating` <= 5)

---

### votes

Stores user votes for servers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `server_id` | UUID | NO | - | Server reference |
| `user_id` | UUID | NO | - | Voter reference |
| `voted_at` | TIMESTAMP | NO | NOW() | Vote timestamp |
| `vote_date` | DATE | NO | CURRENT_DATE | Vote date (for daily limit) |

**Constraints**:
- PRIMARY KEY (`id`)
- UNIQUE (`server_id`, `user_id`, `vote_date`) - One vote per user per server per day
- FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE
- FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE

---

### server_tags

Stores tags associated with servers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `server_id` | UUID | NO | - | Server reference |
| `tag` | VARCHAR(50) | NO | - | Tag text |

**Constraints**:
- PRIMARY KEY (`id`)
- FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE

---

### server_status_history

Stores server status check history for monitoring.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `server_id` | UUID | NO | - | Server reference |
| `is_online` | BOOLEAN | NO | - | Online status |
| `player_count` | INTEGER | YES | NULL | Player count (null if unknown) |
| `max_players` | INTEGER | YES | NULL | Max players (null if unknown) |
| `response_time_ms` | INTEGER | YES | NULL | Response time in ms |
| `query_protocol` | VARCHAR(20) | YES | NULL | Protocol used |
| `error_message` | VARCHAR(255) | YES | NULL | Error if failed |
| `recorded_at` | TIMESTAMP | NO | NOW() | Check timestamp |

**Constraints**:
- PRIMARY KEY (`id`)
- FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE

---

### refresh_tokens

Stores JWT refresh tokens for session management.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `user_id` | UUID | NO | - | User reference |
| `token` | VARCHAR(255) | NO | - | Refresh token value |
| `expires_at` | TIMESTAMP | NO | - | Token expiration |
| `revoked` | BOOLEAN | NO | FALSE | Revocation status |
| `created_at` | TIMESTAMP | NO | NOW() | Creation time |

**Constraints**:
- PRIMARY KEY (`id`)
- UNIQUE (`token`)
- FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE

---

### admin_actions

Stores admin action audit log.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `admin_id` | UUID | NO | - | Admin user reference |
| `action_type` | VARCHAR(50) | NO | - | Type of action |
| `target_type` | VARCHAR(20) | NO | - | Target entity type |
| `target_id` | UUID | NO | - | Target entity ID |
| `details` | TEXT | YES | NULL | Additional details |
| `created_at` | TIMESTAMP | NO | NOW() | Action timestamp |

**Constraints**:
- PRIMARY KEY (`id`)
- FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`)

---

## Indexes

### users

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `users_pkey` | id | PRIMARY KEY | Primary lookup |
| `users_username_key` | username | UNIQUE | Username uniqueness |
| `users_email_key` | email | UNIQUE | Email uniqueness |
| `idx_users_created_at` | created_at | B-TREE | Date filtering |

### servers

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `servers_pkey` | id | PRIMARY KEY | Primary lookup |
| `servers_slug_key` | slug | UNIQUE | Slug lookup |
| `idx_servers_owner_id` | owner_id | B-TREE | Owner queries |
| `idx_servers_category_id` | category_id | B-TREE | Category filtering |
| `idx_servers_vote_count` | vote_count DESC | B-TREE | Vote sorting |
| `idx_servers_player_count` | player_count DESC | B-TREE | Player sorting |
| `idx_servers_created_at` | created_at DESC | B-TREE | Date sorting |
| `idx_servers_is_featured` | is_featured | B-TREE | Featured filtering |
| `idx_servers_last_pinged_at` | last_pinged_at ASC NULLS FIRST | B-TREE | Scheduler queries |

### reviews

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `reviews_pkey` | id | PRIMARY KEY | Primary lookup |
| `reviews_server_id_user_id_key` | server_id, user_id | UNIQUE | Duplicate prevention |
| `idx_reviews_server_id` | server_id | B-TREE | Server reviews |
| `idx_reviews_user_id` | user_id | B-TREE | User reviews |

### votes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `votes_pkey` | id | PRIMARY KEY | Primary lookup |
| `votes_server_user_date_key` | server_id, user_id, vote_date | UNIQUE | Daily limit |
| `idx_votes_server_id` | server_id | B-TREE | Server votes |
| `idx_votes_user_id` | user_id | B-TREE | User votes |

### server_status_history

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `server_status_history_pkey` | id | PRIMARY KEY | Primary lookup |
| `idx_status_history_server_id` | server_id | B-TREE | Server history |
| `idx_status_history_recorded_at` | recorded_at DESC | B-TREE | Time queries |
| `idx_status_history_server_recorded` | server_id, recorded_at DESC | B-TREE | Combined queries |

### server_tags

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `server_tags_pkey` | id | PRIMARY KEY | Primary lookup |
| `idx_server_tags_server_id` | server_id | B-TREE | Server tags |
| `idx_server_tags_tag` | tag | B-TREE | Tag search |

---

## Enumerations

### Role

User permission levels.

```sql
-- Stored as VARCHAR(20)
'USER'       -- Standard user
'MODERATOR'  -- Can moderate content
'ADMIN'      -- Full administrative access
```

### QueryProtocol

Server monitoring protocols.

```sql
-- Stored as VARCHAR(20)
'HYQUERY'     -- HyQuery plugin (UDP 5520)
'NITRADO'     -- Nitrado API (HTTPS 5523)
'QUIC'        -- QUIC ping (UDP 5520)
'BASIC_PING'  -- ICMP/TCP ping
'FAILED'      -- No protocol succeeded
```

### AdminActionType

Types of administrative actions.

```sql
-- Stored as VARCHAR(50)
'SERVER_FEATURED'    -- Server marked as featured
'SERVER_UNFEATURED'  -- Server unmarked as featured
'SERVER_VERIFIED'    -- Server marked as verified
'SERVER_UNVERIFIED'  -- Server unmarked as verified
'SERVER_DELETED'     -- Server deleted by admin
'USER_BANNED'        -- User banned
'USER_UNBANNED'      -- User unbanned
'USER_ROLE_CHANGED'  -- User role modified
'REVIEW_DELETED'     -- Review deleted by admin
```

### TargetType

Entity types for admin actions.

```sql
-- Stored as VARCHAR(20)
'SERVER'  -- Server entity
'USER'    -- User entity
'REVIEW'  -- Review entity
```

### OAuthProvider

Supported OAuth providers.

```sql
-- Stored as VARCHAR(20)
'DISCORD'  -- Discord OAuth2
'GOOGLE'   -- Google OAuth2
```

---

## Migrations

Flyway migrations are located in `backend/src/main/resources/db/migration/`.

### Migration History

| Version | Description |
|---------|-------------|
| V1 | Create users table |
| V2 | Create categories table with seed data |
| V3 | Create servers table |
| V4 | Create reviews table |
| V5 | Create votes table with daily limit |
| V6 | Add OAuth fields to users |
| V7 | Create refresh_tokens table |
| V8 | Add email verification fields |
| V9 | Add password reset fields |
| V10 | Add server tags |
| V11 | Add ban fields to users |
| V12 | Create admin_actions table |
| V13 | Add view_count to servers |
| V14 | Add server rating fields |
| V15 | Add uptime_percentage to servers |
| V16 | Create server_status_history table |
| V17 | Cleanup query protocol values |
| V18 | Allow null player_count |

### Running Migrations

Migrations run automatically on application startup. To run manually:

```bash
# Using Flyway CLI
flyway -url=jdbc:postgresql://localhost:5432/hytaleonlinelist \
       -user=username \
       -password=password \
       migrate

# Using Maven
./mvnw flyway:migrate
```

### Creating New Migrations

1. Create file: `V{number}__{description}.sql`
2. Place in `db/migration/` directory
3. Restart application or run `flyway:migrate`

**Naming Convention**:
- `V{version}__{description}.sql` - Versioned migration
- Version must be sequential
- Description uses underscores for spaces

**Example**:
```sql
-- V19__add_server_discord_webhook.sql
ALTER TABLE servers ADD COLUMN discord_webhook_url VARCHAR(500);
```

---

## Data Retention

### Automatic Cleanup

| Data Type | Retention | Cleanup Schedule |
|-----------|-----------|------------------|
| Server status history | 30 days | Daily at 3 AM |
| Expired refresh tokens | 7 days | On access |
| Email verification tokens | 24 hours | Manual |
| Password reset tokens | 1 hour | Manual |

### Cascade Deletions

When a **user** is deleted:
- All owned servers are orphaned (owner_id set to null) or deleted
- All reviews by user are deleted
- All votes by user are deleted
- All refresh tokens are deleted

When a **server** is deleted:
- All reviews are deleted
- All votes are deleted
- All tags are deleted
- All status history is deleted
