# Features Documentation

This document provides a comprehensive overview of all features and functionality available in Hytale Online List.

## Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Server Discovery & Browsing](#2-server-discovery--browsing)
3. [Server Management](#3-server-management)
4. [Voting System](#4-voting-system)
5. [Reviews & Ratings](#5-reviews--ratings)
6. [Server Status Monitoring](#6-server-status-monitoring)
7. [User Profiles](#7-user-profiles)
8. [Administration](#8-administration)
9. [File Uploads](#9-file-uploads)

---

## 1. Authentication & User Management

### 1.1 User Registration

**Description**: New users can create accounts to participate in the community.

**Registration Methods**:
- Email/password registration
- OAuth2 via Discord
- OAuth2 via Google

**Registration Flow**:
1. User submits registration form (username, email, password)
2. System validates input (unique username, unique email, password strength)
3. Account is created with `emailVerified: false`
4. Verification email is sent asynchronously
5. User is automatically logged in
6. User is redirected to email verification notice page

**Constraints**:
- Username must be unique
- Email must be unique
- Password must meet security requirements
- OAuth users don't require password

**Location**: `/register`

---

### 1.2 User Login

**Description**: Registered users can authenticate to access protected features.

**Login Methods**:
- Email/password authentication
- OAuth2 via Discord
- OAuth2 via Google

**Login Flow**:
1. User submits credentials
2. System validates credentials against stored hash
3. JWT access token generated (15-minute expiry)
4. Refresh token generated and stored (7-day expiry)
5. Tokens set as HTTP-only cookies
6. User redirected to dashboard or previous page

**Security Features**:
- BCrypt password hashing
- JWT token-based sessions
- Automatic token refresh on 401 errors
- Banned user check on login

**Location**: `/login`

---

### 1.3 Email Verification

**Description**: Users must verify their email to perform certain actions.

**Requires Email Verification**:
- Creating servers
- Editing servers
- Deleting servers
- Voting for servers
- Writing reviews
- Uploading files

**Verification Flow**:
1. User clicks verification link from email
2. System validates token and expiry
3. User's `emailVerified` flag is set to `true`
4. User can now perform protected actions

**Resend Verification**:
- Users can request new verification emails
- Previous tokens are invalidated
- Rate limiting prevents abuse

**Location**: `/verify-email`, `/verify-email-notice`

---

### 1.4 Password Reset

**Description**: Users who forget their password can reset it via email.

**Reset Flow**:
1. User submits email on forgot password page
2. System generates reset token (1-hour expiry)
3. Reset email sent asynchronously
4. User clicks link and enters new password
5. Password is updated, token invalidated
6. User can login with new password

**Security**:
- Email enumeration safe (same response for valid/invalid emails)
- Token expires after 1 hour
- Token invalidated after use

**Location**: `/forgot-password`, `/reset-password`

---

### 1.5 Session Management

**Description**: User sessions are managed via JWT tokens stored in HTTP-only cookies.

**Token Types**:
| Token | Purpose | Expiry | Storage |
|-------|---------|--------|---------|
| Access Token | API authentication | 15 minutes | HTTP-only cookie |
| Refresh Token | Token renewal | 7 days | HTTP-only cookie + database |

**Token Refresh**:
- Automatic refresh on 401 response
- Frontend AuthContext handles refresh
- Refresh tokens can be revoked on logout

**Logout**:
- Clears both cookies
- Revokes refresh token in database
- Redirects to home page

---

## 2. Server Discovery & Browsing

### 2.1 Homepage

**Description**: Landing page showcasing the platform and featured content.

**Sections**:
1. **Hero Section** - Platform introduction with call-to-action
2. **Featured Servers** - Highlighted servers selected by admins
3. **Categories Grid** - Visual browsing by server type
4. **Top Voted Servers** - Servers with most community votes
5. **New Servers** - Recently added servers
6. **Platform Statistics** - Total servers, players, votes, reviews

**Location**: `/`

---

### 2.2 Server Listing

**Description**: Browse all servers with filtering and sorting options.

**Filter Options**:
| Filter | Description |
|--------|-------------|
| Category | Filter by server type (survival, pvp, creative, etc.) |
| Search | Search by server name or description |
| Online Status | Show only online or offline servers |

**Sort Options**:
| Sort | Description |
|------|-------------|
| Most Voted | Servers with highest vote count |
| Most Players | Servers with highest current player count |
| Newest | Most recently added servers |
| Random | Randomized order for discovery |

**Pagination**:
- 20 servers per page
- Standard pagination controls

**Location**: `/servers`

---

### 2.3 Category Browsing

**Description**: Browse servers within a specific category.

**Available Categories**:
| Category | Slug | Icon |
|----------|------|------|
| Survival | `survival` | Shield |
| PvP | `pvp` | Swords |
| Creative | `creative` | Brush |
| RPG | `rpg` | Scroll |
| Minigames | `minigames` | Gamepad2 |
| Adventure | `adventure` | Map |
| Modded | `modded` | Puzzle |

**Features**:
- Category description display
- Server count per category
- Same filtering/sorting as main listing

**Location**: `/servers/[category]`

---

### 2.4 Server Detail Page

**Description**: Comprehensive view of an individual server.

**Information Displayed**:
- Server name, icon, and banner
- Category and tags
- IP address with copy functionality
- Current player count and max players
- Online/offline status with last checked time
- Uptime percentage
- Vote count with voting button
- Average rating and review count
- Server description (full)
- Website and Discord links
- Owner information

**Tabs**:
1. **Overview** - Server description and statistics
2. **Reviews** - Community reviews with ratings

**Additional Components**:
- Uptime statistics cards
- Player history chart (24h/7d toggle)
- Review form (for authenticated users)

**View Tracking**:
- View count incremented on page load
- Prevents duplicate counting per session

**Location**: `/server/[slug]`

---

### 2.5 Search Functionality

**Description**: Search for servers by name or description.

**Implementation**:
- Debounced search input (300ms)
- Real-time results update
- Searches both server names and descriptions
- Available in navbar and server listing

---

## 3. Server Management

### 3.1 User Dashboard

**Description**: Central hub for server owners to manage their servers.

**Dashboard Sections**:
1. **Statistics Overview**
   - Total servers owned
   - Total votes received
   - Total views received

2. **Server List**
   - All user's servers with quick actions
   - Online/offline status indicator
   - Player count display
   - Vote and view counts

3. **Quick Actions**
   - View server page
   - Edit server
   - Delete server

**Requirements**:
- Must be logged in
- Shows email verification warning if not verified

**Location**: `/dashboard`

---

### 3.2 Adding a Server

**Description**: Server owners can list their servers on the platform.

**Required Fields**:
| Field | Description | Validation |
|-------|-------------|------------|
| Name | Server display name | Required, unique slug generated |
| IP Address | Server connection IP | Required, valid format |
| Port | Server port | Default 5520 |
| Short Description | Brief summary | Required, max 200 chars |
| Description | Full description | Required |
| Category | Server type | Required, select from list |

**Optional Fields**:
| Field | Description |
|-------|-------------|
| Icon | Server icon image |
| Banner | Server banner image |
| Website URL | Server website link |
| Discord URL | Discord invite link |
| Version | Game version |
| Tags | Comma-separated tags |

**Server Creation Flow**:
1. User fills out server form
2. Uploads icon/banner (optional)
3. System validates all fields
4. Unique slug generated from name
5. Server created with owner reference
6. Redirected to dashboard

**Requirements**:
- Email must be verified
- Must be logged in

**Location**: `/dashboard/servers/add`

---

### 3.3 Editing a Server

**Description**: Server owners can update their server information.

**Editable Fields**:
- All fields from server creation
- Cannot change ownership

**Ownership Verification**:
- Only server owner can edit
- Backend verifies ownership on every update

**Location**: `/dashboard/servers/[id]/edit`

---

### 3.4 Deleting a Server

**Description**: Server owners can remove their servers from the platform.

**Deletion Flow**:
1. User clicks delete on dashboard
2. Confirmation dialog appears
3. User confirms deletion
4. Server and all related data removed
5. Dashboard refreshes

**Cascade Deletions**:
- Server reviews
- Server votes
- Server tags
- Server status history

**Requirements**:
- Email must be verified
- Must be server owner

---

## 4. Voting System

### 4.1 Overview

**Description**: Community-driven ranking system where users vote for their favorite servers.

**Key Rules**:
- One vote per user per server per day
- Email verification required
- Vote count displayed prominently
- Servers can be sorted by vote count

---

### 4.2 Casting a Vote

**Voting Flow**:
1. User views server (card or detail page)
2. Clicks vote button (chevron up icon)
3. System validates:
   - User is authenticated
   - Email is verified
   - User hasn't voted today
4. Vote recorded with timestamp
5. Server vote count incremented
6. UI updates to show "voted" state

**Vote Button States**:
| State | Appearance | Action |
|-------|------------|--------|
| Not logged in | Gray, disabled | Tooltip: "Sign in to vote" |
| Email not verified | Gray, disabled | Tooltip: "Verify email to vote" |
| Can vote | Primary color | Clickable |
| Already voted | Green checkmark | Disabled for today |
| Loading | Spinner | Disabled |

---

### 4.3 Vote History

**Description**: Users can view their voting history.

**Displayed Information**:
- Server name and icon
- Date of vote
- Paginated list

**Location**: `/profile` (Votes tab)

---

## 5. Reviews & Ratings

### 5.1 Overview

**Description**: Users can write reviews and rate servers to help others make decisions.

**Rating Scale**: 1-5 stars

**Constraints**:
- One review per user per server
- Cannot review your own server
- Email verification required

---

### 5.2 Writing a Review

**Review Form Fields**:
| Field | Description | Validation |
|-------|-------------|------------|
| Rating | Star rating | Required, 1-5 |
| Content | Review text | Required |

**Review Flow**:
1. User navigates to server detail page
2. Clicks "Write a Review" or scrolls to review section
3. Selects star rating (1-5)
4. Writes review content
5. Submits review
6. Server average rating recalculated
7. Review appears in list

**Requirements**:
- Must be logged in
- Email must be verified
- Cannot have existing review for this server
- Cannot review own server

---

### 5.3 Editing a Review

**Description**: Users can update their own reviews.

**Edit Flow**:
1. User's review shows "Edit" button
2. Click opens edit form with current values
3. User modifies rating and/or content
4. Submits changes
5. Server average rating recalculated

---

### 5.4 Deleting a Review

**Description**: Users can remove their own reviews.

**Delete Flow**:
1. User's review shows "Delete" button
2. Confirmation dialog appears
3. User confirms deletion
4. Review removed
5. Server average rating recalculated

---

### 5.5 Server Rating Display

**Aggregate Rating**:
- Average of all review ratings (1 decimal place)
- Total review count displayed
- Star visualization on server cards and detail page

---

## 6. Server Status Monitoring

### 6.1 Overview

**Description**: Automated system that monitors server availability and tracks historical data.

**Monitoring Frequency**: Every 60 seconds (batch of 50 servers)

**Query Protocols** (tried in order):
1. **HyQuery** - UDP port 5520 (native Hytale protocol)
2. **Nitrado** - HTTPS port 5523 (Nitrado hosting API)
3. **QUIC** - UDP port 5520 (QUIC protocol ping)
4. **BasicPing** - ICMP/TCP fallback

---

### 6.2 Real-time Status Display

**Status Badge Component**:
- Green dot + "Online" for online servers
- Red dot + "Offline" for offline servers
- "Last checked X ago" timestamp

**Player Count Display**:
- Shows current/max players when available
- Shows "N/A" when only connectivity confirmed (QUIC/BasicPing)

**Locations**:
- Server cards (listing pages)
- Server detail page
- Dashboard server list

---

### 6.3 Uptime Statistics

**Metrics Calculated**:
| Metric | Description |
|--------|-------------|
| 24h Uptime | Percentage online in last 24 hours |
| 7d Uptime | Percentage online in last 7 days |
| Avg Response Time | Average response time in milliseconds |
| Total Checks | Number of status checks in period |

**Display**: Stats cards on server detail page

---

### 6.4 Player History Chart

**Description**: Visual chart showing player count over time.

**Chart Features**:
- Area chart with gradient fill
- Time period toggle (24h / 7d)
- Player count on Y-axis
- Time on X-axis
- Tooltip with exact values
- Responsive design

**Data Points**:
- Stored every ping (every ~5 minutes per server)
- Maximum 168 hours (7 days) of history
- Old data cleaned up daily (30-day retention)

---

### 6.5 Scheduled Tasks

| Task | Schedule | Purpose |
|------|----------|---------|
| Server Batch Processing | Every 60 seconds | Query servers and update status |
| History Cleanup | Daily at 3 AM | Delete records older than 30 days |
| Uptime Recalculation | Every hour | Update uptime percentages |

---

## 7. User Profiles

### 7.1 Profile Page

**Description**: View and manage user profile information.

**Profile Sections**:
1. **Profile Header**
   - Avatar image
   - Username
   - Bio
   - Edit profile button

2. **Owned Servers Tab**
   - List of servers owned by user
   - Server cards with stats

3. **Votes Tab**
   - Paginated vote history
   - Server names and vote dates

**Location**: `/profile`

---

### 7.2 Edit Profile

**Editable Fields**:
| Field | Description | Validation |
|-------|-------------|------------|
| Username | Display name | Unique, required |
| Avatar | Profile image | Upload via dialog |
| Bio | User description | Optional, text |

**Edit Flow**:
1. Click "Edit Profile" button
2. Modal dialog opens
3. Modify fields as needed
4. Upload new avatar (optional)
5. Save changes
6. Profile updates immediately

---

## 8. Administration

### 8.1 Admin Dashboard

**Description**: Overview of platform activity for administrators.

**Statistics Displayed**:
- Total users
- Total servers
- Total votes
- New users today
- New servers today

**Recent Activity**:
- Latest admin actions from audit log

**Access**: ADMIN and MODERATOR roles

**Location**: `/admin`

---

### 8.2 User Management

**Description**: Manage platform users.

**Features**:
- Paginated user list with search
- View user details (username, email, role, status)
- Ban/unban users with reason
- Change user roles (USER, MODERATOR, ADMIN)

**User Actions**:
| Action | Available To | Description |
|--------|--------------|-------------|
| Ban User | ADMIN only | Prevent user from logging in |
| Unban User | ADMIN only | Restore user access |
| Change Role | ADMIN only | Promote/demote user |

**Location**: `/admin/users`

---

### 8.3 Server Management

**Description**: Moderate server listings.

**Features**:
- Paginated server list with search
- View server details
- Feature/unfeature servers
- Verify/unverify servers
- Delete servers

**Server Actions**:
| Action | Available To | Description |
|--------|--------------|-------------|
| Feature | ADMIN, MODERATOR | Highlight server on homepage |
| Verify | ADMIN, MODERATOR | Add verified badge |
| Delete | ADMIN only | Remove server from platform |

**Location**: `/admin/servers`

---

### 8.4 Audit Log

**Description**: Track all administrative actions.

**Logged Actions**:
- SERVER_FEATURED / SERVER_UNFEATURED
- SERVER_VERIFIED / SERVER_UNVERIFIED
- SERVER_DELETED
- USER_BANNED / USER_UNBANNED
- USER_ROLE_CHANGED
- REVIEW_DELETED

**Log Entry Fields**:
- Admin who performed action
- Action type
- Target (server/user/review)
- Details (e.g., ban reason)
- Timestamp

**Access**: ADMIN only

**Location**: `/admin/audit-log`

---

## 9. File Uploads

### 9.1 Overview

**Description**: Users can upload images for servers and profiles.

**Storage**: Cloudflare R2 (S3-compatible object storage)

**Supported Formats**: JPEG, PNG, GIF, WebP

---

### 9.2 Server Icon Upload

**Purpose**: Square icon displayed on server cards and detail pages

**Constraints**:
- Maximum size: 2MB
- Recommended dimensions: 256x256 pixels
- Email verification required

---

### 9.3 Server Banner Upload

**Purpose**: Wide banner displayed on server detail page

**Constraints**:
- Maximum size: 5MB
- Recommended dimensions: 1200x400 pixels
- Email verification required

---

### 9.4 User Avatar Upload

**Purpose**: Profile picture displayed throughout the platform

**Constraints**:
- Maximum size: 2MB
- Recommended dimensions: 256x256 pixels
- Available to all authenticated users

---

## Feature Access Matrix

| Feature | Guest | User | Verified User | Moderator | Admin |
|---------|-------|------|---------------|-----------|-------|
| Browse servers | Yes | Yes | Yes | Yes | Yes |
| View server details | Yes | Yes | Yes | Yes | Yes |
| Register/Login | Yes | - | - | - | - |
| Vote for server | No | No | Yes | Yes | Yes |
| Write review | No | No | Yes | Yes | Yes |
| Create server | No | No | Yes | Yes | Yes |
| Edit own server | No | No | Yes | Yes | Yes |
| Delete own server | No | No | Yes | Yes | Yes |
| Upload files | No | No | Yes | Yes | Yes |
| Edit profile | No | Yes | Yes | Yes | Yes |
| Feature server | No | No | No | Yes | Yes |
| Verify server | No | No | No | Yes | Yes |
| Delete any server | No | No | No | No | Yes |
| Ban/unban users | No | No | No | No | Yes |
| Change user roles | No | No | No | No | Yes |
| View audit log | No | No | No | No | Yes |
