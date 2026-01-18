# API Reference

Complete REST API documentation for Hytale Online List backend.

**Base URL**: `http://localhost:8080` (development) or your production URL

**Authentication**: JWT tokens stored in HTTP-only cookies

---

## Table of Contents

1. [Authentication](#authentication)
2. [Servers](#servers)
3. [Categories](#categories)
4. [Votes](#votes)
5. [Reviews](#reviews)
6. [Users](#users)
7. [Server Status](#server-status)
8. [File Uploads](#file-uploads)
9. [Statistics](#statistics)
10. [Administration](#administration)
11. [Error Handling](#error-handling)

---

## Authentication

### Register

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response**: `201 Created`
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "avatarUrl": "string | null",
  "bio": "string | null",
  "role": "USER",
  "emailVerified": false,
  "createdAt": "ISO8601 timestamp"
}
```

**Cookies Set**: `access_token`, `refresh_token`

---

### Login

Authenticate an existing user.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "avatarUrl": "string | null",
  "bio": "string | null",
  "role": "USER | MODERATOR | ADMIN",
  "emailVerified": true,
  "createdAt": "ISO8601 timestamp"
}
```

**Cookies Set**: `access_token`, `refresh_token`

**Errors**:
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - User is banned

---

### Logout

End user session.

```http
POST /api/auth/logout
```

**Response**: `200 OK`

**Cookies Cleared**: `access_token`, `refresh_token`

---

### Refresh Token

Get a new access token using refresh token.

```http
POST /api/auth/refresh
```

**Requires**: `refresh_token` cookie

**Response**: `200 OK`

**Cookies Set**: `access_token`

---

### Get Current User

Get authenticated user information.

```http
GET /api/auth/me
```

**Requires**: Authentication

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "avatarUrl": "string | null",
  "bio": "string | null",
  "role": "USER | MODERATOR | ADMIN",
  "emailVerified": true,
  "createdAt": "ISO8601 timestamp"
}
```

---

### Verify Email

Verify user email with token.

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "string"
}
```

**Response**: `200 OK`
```json
{
  "message": "Email verified successfully"
}
```

---

### Resend Verification Email

Request a new verification email.

```http
POST /api/auth/resend-verification
```

**Requires**: Authentication

**Response**: `200 OK`
```json
{
  "message": "Verification email sent"
}
```

---

### Forgot Password

Request password reset email.

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "string"
}
```

**Response**: `200 OK`
```json
{
  "message": "If account exists, password reset email sent"
}
```

---

### Reset Password

Reset password with token.

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "string",
  "newPassword": "string"
}
```

**Response**: `200 OK`
```json
{
  "message": "Password reset successfully"
}
```

---

## Servers

### List Servers

Get paginated server list with filtering.

```http
GET /api/servers
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (0-indexed, default: 0) |
| `size` | integer | Items per page (default: 20) |
| `sort` | string | Sort option: `votes`, `players`, `newest`, `random` |
| `category` | string | Category slug filter |
| `search` | string | Search query |
| `online` | boolean | Filter by online status |

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "slug": "string",
      "ipAddress": "string",
      "port": 5520,
      "shortDescription": "string",
      "description": "string",
      "bannerUrl": "string | null",
      "iconUrl": "string | null",
      "websiteUrl": "string | null",
      "discordUrl": "string | null",
      "category": {
        "id": "uuid",
        "name": "string",
        "slug": "string",
        "description": "string",
        "icon": "string",
        "serverCount": 0
      },
      "tags": ["string"],
      "version": "string",
      "isOnline": true,
      "playerCount": 0,
      "maxPlayers": 100,
      "uptimePercentage": 99.5,
      "voteCount": 0,
      "reviewCount": 0,
      "averageRating": 4.5,
      "viewCount": 0,
      "isFeatured": false,
      "isVerified": false,
      "createdAt": "ISO8601 timestamp",
      "lastPingedAt": "ISO8601 timestamp | null",
      "owner": {
        "id": "uuid",
        "username": "string",
        "avatarUrl": "string | null"
      }
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Get Server by Slug

Get single server details (increments view count).

```http
GET /api/servers/{slug}
```

**Response**: `200 OK` - Same as server object above

**Errors**:
- `404 Not Found` - Server not found

---

### Get Featured Servers

Get list of featured servers.

```http
GET /api/servers/featured
```

**Response**: `200 OK` - Array of server objects

---

### Get My Servers

Get authenticated user's servers.

```http
GET /api/servers/my-servers
```

**Requires**: Authentication

**Response**: `200 OK` - Array of server objects

---

### Get My Server by ID

Get specific server owned by authenticated user.

```http
GET /api/servers/my-servers/{id}
```

**Requires**: Authentication + Ownership

**Response**: `200 OK` - Server object

---

### Create Server

Create a new server listing.

```http
POST /api/servers
Content-Type: application/json

{
  "name": "string",
  "ipAddress": "string",
  "port": 5520,
  "shortDescription": "string",
  "description": "string",
  "categoryId": "uuid",
  "bannerUrl": "string | null",
  "iconUrl": "string | null",
  "websiteUrl": "string | null",
  "discordUrl": "string | null",
  "version": "string | null",
  "tags": ["string"]
}
```

**Requires**: Authentication + Email Verified

**Response**: `201 Created` - Server object

---

### Update Server

Update an existing server.

```http
PUT /api/servers/{id}
Content-Type: application/json

{
  "name": "string",
  "ipAddress": "string",
  "port": 5520,
  "shortDescription": "string",
  "description": "string",
  "categoryId": "uuid",
  "bannerUrl": "string | null",
  "iconUrl": "string | null",
  "websiteUrl": "string | null",
  "discordUrl": "string | null",
  "version": "string | null",
  "tags": ["string"]
}
```

**Requires**: Authentication + Email Verified + Ownership

**Response**: `200 OK` - Updated server object

---

### Delete Server

Delete a server listing.

```http
DELETE /api/servers/{id}
```

**Requires**: Authentication + Email Verified + Ownership

**Response**: `204 No Content`

---

## Categories

### List Categories

Get all categories with server counts.

```http
GET /api/categories
```

**Response**: `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Survival",
    "slug": "survival",
    "description": "string",
    "icon": "shield",
    "serverCount": 42
  }
]
```

---

### Get Category by Slug

Get single category details.

```http
GET /api/categories/{slug}
```

**Response**: `200 OK` - Category object

---

## Votes

### Vote for Server

Cast a vote for a server (once per day).

```http
POST /api/votes/server/{serverId}
```

**Requires**: Authentication + Email Verified

**Response**: `201 Created`
```json
{
  "message": "Vote recorded successfully",
  "voteCount": 43
}
```

**Errors**:
- `409 Conflict` - Already voted today

---

### Get Vote Status

Check if user has voted today for a server.

```http
GET /api/votes/server/{serverId}/status
```

**Requires**: Authentication

**Response**: `200 OK`
```json
{
  "hasVotedToday": true
}
```

---

## Reviews

### List Server Reviews

Get paginated reviews for a server.

```http
GET /api/reviews/server/{serverId}
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (0-indexed, default: 0) |
| `size` | integer | Items per page (default: 10) |

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "serverId": "uuid",
      "user": {
        "id": "uuid",
        "username": "string",
        "avatarUrl": "string | null"
      },
      "rating": 5,
      "content": "string",
      "createdAt": "ISO8601 timestamp",
      "updatedAt": "ISO8601 timestamp",
      "isOwner": false
    }
  ],
  "meta": {
    "page": 0,
    "size": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### Get My Review

Get current user's review for a server.

```http
GET /api/reviews/server/{serverId}/me
```

**Requires**: Authentication

**Response**: `200 OK` - Review object or `404 Not Found`

---

### Create Review

Write a review for a server.

```http
POST /api/reviews/server/{serverId}
Content-Type: application/json

{
  "rating": 5,
  "content": "string"
}
```

**Requires**: Authentication + Email Verified

**Response**: `201 Created` - Review object

**Errors**:
- `409 Conflict` - Already reviewed this server
- `403 Forbidden` - Cannot review own server

---

### Update Review

Update own review.

```http
PUT /api/reviews/{reviewId}
Content-Type: application/json

{
  "rating": 4,
  "content": "string"
}
```

**Requires**: Authentication + Email Verified + Ownership

**Response**: `200 OK` - Updated review object

---

### Delete Review

Delete own review.

```http
DELETE /api/reviews/{reviewId}
```

**Requires**: Authentication + Email Verified + Ownership

**Response**: `204 No Content`

---

## Users

### Get Profile

Get current user's profile.

```http
GET /api/users/profile
```

**Requires**: Authentication

**Response**: `200 OK`
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "avatarUrl": "string | null",
  "bio": "string | null",
  "role": "USER",
  "emailVerified": true,
  "createdAt": "ISO8601 timestamp"
}
```

---

### Update Profile

Update current user's profile.

```http
PUT /api/users/profile
Content-Type: application/json

{
  "username": "string",
  "avatarUrl": "string | null",
  "bio": "string | null"
}
```

**Requires**: Authentication

**Response**: `200 OK` - Updated profile

---

### Get Vote History

Get user's voting history.

```http
GET /api/users/votes
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (0-indexed, default: 0) |
| `size` | integer | Items per page (default: 20) |

**Requires**: Authentication

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "serverId": "uuid",
      "userId": "uuid",
      "votedAt": "ISO8601 timestamp"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## Server Status

### Get Uptime Stats

Get server uptime statistics.

```http
GET /api/servers/{serverId}/status/uptime
```

**Response**: `200 OK`
```json
{
  "serverId": "uuid",
  "uptime24h": 99.5,
  "uptime7d": 98.2,
  "avgResponseMs": 45,
  "totalChecks24h": 288,
  "currentlyOnline": true,
  "lastCheckedAt": "ISO8601 timestamp"
}
```

---

### Get Status History

Get server status history for charts.

```http
GET /api/servers/{serverId}/status/history
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `hours` | integer | Hours of history (default: 24, max: 168) |

**Response**: `200 OK`
```json
[
  {
    "online": true,
    "playerCount": 15,
    "maxPlayers": 100,
    "responseTimeMs": 42,
    "queryProtocol": "HYQUERY",
    "recordedAt": "ISO8601 timestamp"
  }
]
```

---

## File Uploads

### Upload Server Icon

Upload a server icon image.

```http
POST /api/upload/icon
Content-Type: multipart/form-data

file: <binary>
```

**Requires**: Authentication + Email Verified

**Constraints**:
- Max size: 2MB
- Formats: JPEG, PNG, GIF, WebP

**Response**: `200 OK`
```json
{
  "url": "https://your-bucket.r2.dev/icons/uuid.png"
}
```

---

### Upload Server Banner

Upload a server banner image.

```http
POST /api/upload/banner
Content-Type: multipart/form-data

file: <binary>
```

**Requires**: Authentication + Email Verified

**Constraints**:
- Max size: 5MB
- Formats: JPEG, PNG, GIF, WebP

**Response**: `200 OK`
```json
{
  "url": "https://your-bucket.r2.dev/banners/uuid.png"
}
```

---

### Upload Avatar

Upload a user avatar image.

```http
POST /api/upload/avatar
Content-Type: multipart/form-data

file: <binary>
```

**Requires**: Authentication

**Constraints**:
- Max size: 2MB
- Formats: JPEG, PNG, GIF, WebP

**Response**: `200 OK`
```json
{
  "url": "https://your-bucket.r2.dev/avatars/uuid.png"
}
```

---

## Statistics

### Get Platform Stats

Get overall platform statistics.

```http
GET /api/stats
```

**Response**: `200 OK`
```json
{
  "totalServers": 150,
  "onlineServers": 120,
  "totalPlayers": 5000,
  "totalVotes": 10000,
  "totalReviews": 500
}
```

---

## Administration

All admin endpoints require `ADMIN` or `MODERATOR` role unless specified.

### Get Admin Stats

```http
GET /api/admin/stats
```

**Response**: `200 OK`
```json
{
  "totalUsers": 1000,
  "totalServers": 150,
  "totalVotes": 10000,
  "newUsersToday": 15,
  "newServersToday": 3
}
```

---

### List Users

```http
GET /api/admin/users
```

**Query Parameters**: `page`, `size`, `search`

**Response**: `200 OK` - Paginated list of admin user objects

---

### List Servers

```http
GET /api/admin/servers
```

**Query Parameters**: `page`, `size`, `search`

**Response**: `200 OK` - Paginated list of admin server objects

---

### Feature Server

Toggle server featured status.

```http
POST /api/admin/servers/{id}/feature
```

**Response**: `200 OK`
```json
{
  "message": "Server featured status updated",
  "isFeatured": true
}
```

---

### Verify Server

Toggle server verification status.

```http
POST /api/admin/servers/{id}/verify
```

**Response**: `200 OK`
```json
{
  "message": "Server verification status updated",
  "isVerified": true
}
```

---

### Delete Server (Admin)

Delete any server.

```http
DELETE /api/admin/servers/{id}
```

**Requires**: ADMIN role only

**Response**: `204 No Content`

---

### Ban User

Ban a user from the platform.

```http
POST /api/admin/users/{id}/ban
Content-Type: application/json

{
  "reason": "string"
}
```

**Requires**: ADMIN role only

**Response**: `200 OK`
```json
{
  "message": "User banned"
}
```

---

### Unban User

Remove ban from a user.

```http
POST /api/admin/users/{id}/unban
```

**Requires**: ADMIN role only

**Response**: `200 OK`
```json
{
  "message": "User unbanned"
}
```

---

### Change User Role

Update user's role.

```http
PUT /api/admin/users/{id}/role
Content-Type: application/json

{
  "role": "USER | MODERATOR | ADMIN"
}
```

**Requires**: ADMIN role only

**Response**: `200 OK`
```json
{
  "message": "User role updated"
}
```

---

### Get Audit Log

View admin action history.

```http
GET /api/admin/audit-log
```

**Query Parameters**: `page`, `size`

**Requires**: ADMIN role only

**Response**: `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "adminId": "uuid",
      "adminUsername": "string",
      "actionType": "SERVER_FEATURED",
      "targetType": "SERVER",
      "targetId": "uuid",
      "targetName": "string",
      "details": "string | null",
      "createdAt": "ISO8601 timestamp"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### Delete Review (Admin)

Delete any review.

```http
DELETE /api/reviews/admin/{reviewId}
```

**Requires**: ADMIN role only

**Response**: `204 No Content`

---

## Error Handling

### Error Response Format

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "ISO8601 timestamp",
  "path": "/api/endpoint"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Not authenticated |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Duplicate resource |
| `500` | Internal Server Error |

### Authentication Errors

- Missing token: `401 Unauthorized`
- Invalid/expired token: `401 Unauthorized`
- Email not verified: `403 Forbidden`
- User banned: `403 Forbidden`
- Insufficient role: `403 Forbidden`
