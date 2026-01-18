# Technical Architecture

This document describes the technical architecture, system design, and component structure of Hytale Online List.

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Authentication Flow](#authentication-flow)
5. [Server Monitoring System](#server-monitoring-system)
6. [Data Flow](#data-flow)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Internet                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Load Balancer / CDN                                │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│      Frontend (Next.js)       │   │      Backend (Spring Boot)    │
│      Port: 3000               │   │      Port: 8080               │
│  ┌─────────────────────────┐  │   │  ┌─────────────────────────┐  │
│  │    React Components     │  │   │  │    REST Controllers     │  │
│  │    App Router           │  │   │  │    Services             │  │
│  │    API Clients          │  │   │  │    Repositories         │  │
│  └─────────────────────────┘  │   │  └─────────────────────────┘  │
└───────────────────────────────┘   └───────────────────────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────┐
                    │                               │                           │
                    ▼                               ▼                           ▼
        ┌───────────────────┐           ┌───────────────────┐       ┌───────────────────┐
        │    PostgreSQL     │           │  Cloudflare R2    │       │   SMTP Server     │
        │    Database       │           │  File Storage     │       │   Email Delivery  │
        └───────────────────┘           └───────────────────┘       └───────────────────┘
```

### Technology Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 16.1.1 |
| Frontend UI | React + Tailwind CSS | 19.2.3 / 4.x |
| Backend | Spring Boot | 3.4.5 |
| Database | PostgreSQL | 15+ |
| Migrations | Flyway | 11.x |
| Authentication | JWT | JJWT 0.12.x |
| File Storage | Cloudflare R2 | S3-compatible |

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth-related routes (grouped)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── verify-email/
│   │   └── verify-email-notice/
│   ├── admin/               # Admin routes
│   │   ├── page.tsx         # Admin dashboard
│   │   ├── servers/
│   │   ├── users/
│   │   └── audit-log/
│   ├── dashboard/           # User dashboard routes
│   │   ├── page.tsx
│   │   └── servers/
│   │       ├── add/
│   │       └── [id]/edit/
│   ├── profile/             # User profile
│   ├── server/[slug]/       # Server detail pages
│   ├── servers/             # Server listing
│   │   ├── page.tsx
│   │   └── [category]/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── servers/             # Server-related components
│   │   ├── ServerCard.tsx
│   │   ├── ServerCardCompact.tsx
│   │   ├── ServerStatusBadge.tsx
│   │   ├── UptimeChart.tsx
│   │   └── UptimeStats.tsx
│   ├── reviews/             # Review components
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   └── StarRating.tsx
│   ├── layout/              # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── profile/             # Profile components
│       └── EditProfileDialog.tsx
│
├── contexts/
│   └── AuthContext.tsx      # Authentication context
│
├── lib/                     # Utilities and API clients
│   ├── api.ts              # Base API client
│   ├── auth-api.ts         # Authentication API
│   ├── server-api.ts       # Server & category API
│   ├── dashboard-api.ts    # Dashboard API
│   ├── vote-api.ts         # Voting API
│   ├── review-api.ts       # Reviews API
│   ├── user-api.ts         # User profile API
│   ├── admin-api.ts        # Admin API
│   ├── status-api.ts       # Server status API
│   ├── upload-api.ts       # File upload API
│   └── utils.ts            # Utility functions
│
└── types/
    └── index.ts             # TypeScript type definitions
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Layout (layout.tsx)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Navbar                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │                     Page Content                            │ │
│  │                     (App Router)                            │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Footer                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

**AuthContext** - Global authentication state

```typescript
interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}
```

**Local Component State** - React useState for component-specific state

**Server State** - Data fetched from API, cached via React patterns

### API Client Pattern

```typescript
// Base API client with error handling
class ApiClient {
  async get<T>(endpoint: string): Promise<T>;
  async post<T>(endpoint: string, data?: unknown): Promise<T>;
  async put<T>(endpoint: string, data?: unknown): Promise<T>;
  async delete<T>(endpoint: string): Promise<T>;
  async upload<T>(endpoint: string, formData: FormData): Promise<T>;
}

// Domain-specific API modules
const serverApi = {
  getServers: (params) => apiClient.get('/servers', params),
  getServerBySlug: (slug) => apiClient.get(`/servers/${slug}`),
  // ...
};
```

---

## Backend Architecture

### Package Structure

```
backend/src/main/java/com/hytaleonlinelist/
├── HytaleOnlineListApplication.java    # Application entry point
│
├── config/                              # Configuration
│   ├── CorsConfig.java                 # CORS configuration
│   ├── SecurityConfig.java             # Spring Security config
│   ├── SchedulingConfig.java           # Async and scheduling
│   └── CloudflareR2Config.java         # File storage config
│
├── controller/                          # REST Controllers
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── CategoryController.java
│   ├── ReviewController.java
│   ├── ServerController.java
│   ├── ServerStatusController.java
│   ├── StatsController.java
│   ├── UploadController.java
│   ├── UserController.java
│   └── VoteController.java
│
├── domain/
│   ├── entity/                          # JPA Entities
│   │   ├── UserEntity.java
│   │   ├── ServerEntity.java
│   │   ├── ReviewEntity.java
│   │   ├── VoteEntity.java
│   │   ├── CategoryEntity.java
│   │   ├── RefreshTokenEntity.java
│   │   ├── ServerStatusHistoryEntity.java
│   │   ├── AdminActionEntity.java
│   │   ├── ServerTagEntity.java
│   │   ├── Role.java                   # Enum
│   │   ├── QueryProtocol.java          # Enum
│   │   ├── AdminActionType.java        # Enum
│   │   ├── OAuthProvider.java          # Enum
│   │   └── TargetType.java             # Enum
│   │
│   └── repository/                      # Spring Data Repositories
│       ├── UserRepository.java
│       ├── ServerRepository.java
│       ├── ReviewRepository.java
│       ├── VoteRepository.java
│       ├── CategoryRepository.java
│       ├── RefreshTokenRepository.java
│       ├── ServerStatusHistoryRepository.java
│       └── AdminActionRepository.java
│
├── dto/
│   ├── request/                         # Request DTOs
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CreateServerRequest.java
│   │   ├── UpdateServerRequest.java
│   │   ├── CreateReviewRequest.java
│   │   └── ...
│   │
│   └── response/                        # Response DTOs
│       ├── AuthResponse.java
│       ├── ServerResponse.java
│       ├── ReviewResponse.java
│       ├── ServerUptimeResponse.java
│       └── ...
│
├── exception/                           # Custom Exceptions
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   ├── ForbiddenException.java
│   └── ConflictException.java
│
├── security/                            # Security Components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtProperties.java
│   ├── UserPrincipal.java
│   ├── CustomUserDetailsService.java
│   ├── EmailVerified.java              # Annotation
│   └── EmailVerifiedAspect.java        # AOP Aspect
│
└── service/                             # Business Logic
    ├── AdminService.java
    ├── AuthService.java
    ├── CategoryService.java
    ├── EmailService.java
    ├── FileUploadService.java
    ├── ReviewService.java
    ├── ServerService.java
    ├── ServerStatusService.java
    ├── ServerStatusSchedulerService.java
    ├── StatsService.java
    ├── UserService.java
    ├── VoteService.java
    └── query/                           # Server query protocols
        ├── QueryResult.java
        ├── ServerQueryProtocol.java
        ├── ServerQueryService.java
        ├── HyQueryProtocol.java
        ├── NitradoQueryProtocol.java
        ├── QuicPingProtocol.java
        └── BasicPingProtocol.java
```

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Controller Layer                            │
│                  (REST API Endpoints)                            │
│   - Request validation                                           │
│   - Response mapping                                             │
│   - Authentication/Authorization via annotations                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                              │
│                   (Business Logic)                               │
│   - Transaction management                                       │
│   - Business rules                                               │
│   - Cross-cutting concerns                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Repository Layer                             │
│                  (Data Access)                                   │
│   - JPA/Hibernate                                                │
│   - Custom queries                                               │
│   - Pagination support                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Database                                   │
│                    (PostgreSQL)                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Service Dependencies

```
AuthService
├── UserRepository
├── RefreshTokenRepository
├── JwtTokenProvider
├── EmailService
└── PasswordEncoder

ServerService
├── ServerRepository
├── CategoryRepository
└── ServerTagEntity (embedded)

ReviewService
├── ReviewRepository
├── ServerRepository
└── UserRepository

VoteService
├── VoteRepository
├── ServerService
└── UserRepository

ServerStatusSchedulerService
├── ServerRepository
├── ServerStatusHistoryRepository
├── ServerQueryService
└── ExecutorService (thread pool)

ServerQueryService
├── HyQueryProtocol
├── NitradoQueryProtocol
├── QuicPingProtocol
└── BasicPingProtocol
```

---

## Authentication Flow

### JWT Token Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ Database │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  POST /auth/login   │                     │
     │  {email, password}  │                     │
     │────────────────────>│                     │
     │                     │                     │
     │                     │  Find user by email │
     │                     │────────────────────>│
     │                     │<────────────────────│
     │                     │                     │
     │                     │  Validate password  │
     │                     │  Generate JWT       │
     │                     │  Generate refresh   │
     │                     │                     │
     │                     │  Store refresh token│
     │                     │────────────────────>│
     │                     │                     │
     │  Set-Cookie:        │                     │
     │  access_token       │                     │
     │  refresh_token      │                     │
     │<────────────────────│                     │
     │                     │                     │
     │  GET /api/servers   │                     │
     │  Cookie: access_token                     │
     │────────────────────>│                     │
     │                     │                     │
     │                     │  Validate JWT       │
     │                     │  Extract user ID    │
     │                     │  Set SecurityContext│
     │                     │                     │
     │  200 OK             │                     │
     │<────────────────────│                     │
```

### Token Refresh Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ Database │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  GET /api/servers   │                     │
     │  (expired token)    │                     │
     │────────────────────>│                     │
     │                     │                     │
     │  401 Unauthorized   │                     │
     │<────────────────────│                     │
     │                     │                     │
     │  POST /auth/refresh │                     │
     │  Cookie: refresh_token                    │
     │────────────────────>│                     │
     │                     │                     │
     │                     │  Validate refresh   │
     │                     │────────────────────>│
     │                     │<────────────────────│
     │                     │                     │
     │                     │  Generate new JWT   │
     │                     │                     │
     │  Set-Cookie:        │                     │
     │  access_token       │                     │
     │<────────────────────│                     │
     │                     │                     │
     │  Retry original     │                     │
     │  request            │                     │
     │────────────────────>│                     │
```

---

## Server Monitoring System

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              ServerStatusSchedulerService                        │
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ @Scheduled       │    │ ExecutorService  │                   │
│  │ (every 60s)      │───>│ (10 threads)     │                   │
│  └──────────────────┘    └────────┬─────────┘                   │
│                                   │                              │
│                    ┌──────────────┼──────────────┐              │
│                    │              │              │              │
│                    ▼              ▼              ▼              │
│              ┌─────────┐   ┌─────────┐    ┌─────────┐          │
│              │ Server 1│   │ Server 2│    │Server 50│          │
│              └────┬────┘   └────┬────┘    └────┬────┘          │
│                   │             │              │                │
└───────────────────┼─────────────┼──────────────┼────────────────┘
                    │             │              │
                    ▼             ▼              ▼
          ┌─────────────────────────────────────────────┐
          │            ServerQueryService               │
          │                                             │
          │   ┌─────────┐  ┌─────────┐  ┌─────────┐   │
          │   │ HyQuery │  │ Nitrado │  │  QUIC   │   │
          │   │UDP 5520 │  │HTTPS5523│  │UDP 5520 │   │
          │   └────┬────┘  └────┬────┘  └────┬────┘   │
          │        │            │            │        │
          │        └────────────┼────────────┘        │
          │                     │                     │
          │              ┌──────┴──────┐             │
          │              │ BasicPing   │             │
          │              │ ICMP/TCP    │             │
          │              └─────────────┘             │
          └─────────────────────────────────────────────┘
```

### Query Protocol Chain

```
Server Query Request
        │
        ▼
┌───────────────────┐
│ Check preferred   │
│ protocol cache    │
└────────┬──────────┘
         │
         ▼ (if cached)
┌───────────────────┐     Success
│ Try cached        │────────────> Return result
│ protocol          │
└────────┬──────────┘
         │ Failure
         ▼
┌───────────────────┐     Success
│ 1. HyQuery        │────────────> Cache & Return
│ UDP port 5520     │              (with player data)
└────────┬──────────┘
         │ Failure (3s timeout)
         ▼
┌───────────────────┐     Success
│ 2. Nitrado        │────────────> Cache & Return
│ HTTPS port 5523   │              (with player data)
└────────┬──────────┘
         │ Failure (3s timeout)
         ▼
┌───────────────────┐     Success
│ 3. QUIC Ping      │────────────> Cache & Return
│ UDP port 5520     │              (online, no players)
└────────┬──────────┘
         │ Failure (3s timeout)
         ▼
┌───────────────────┐     Success
│ 4. Basic Ping     │────────────> Cache & Return
│ ICMP + TCP        │              (online, no players)
└────────┬──────────┘
         │ Failure
         ▼
    Mark FAILED
    (server offline)
```

### Data Storage Flow

```
Query Result
     │
     ▼
┌─────────────────────────────────────────┐
│     ServerStatusHistoryEntity           │
│                                         │
│  - is_online: boolean                   │
│  - player_count: integer (nullable)     │
│  - max_players: integer (nullable)      │
│  - response_time_ms: integer            │
│  - query_protocol: enum                 │
│  - recorded_at: timestamp               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         ServerEntity (updated)          │
│                                         │
│  - is_online: boolean                   │
│  - player_count: integer (nullable)     │
│  - max_players: integer (nullable)      │
│  - last_pinged_at: timestamp            │
│  - preferred_query_protocol: enum       │
│  - uptime_percentage: decimal           │
└─────────────────────────────────────────┘
```

---

## Data Flow

### Server Creation Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │Controller│     │ Service  │     │Repository│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ POST /servers  │                │                │
     │ CreateRequest  │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ @EmailVerified │                │
     │                │ check          │                │
     │                │                │                │
     │                │ createServer() │                │
     │                │───────────────>│                │
     │                │                │                │
     │                │                │ Find category  │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │                │ Generate slug  │
     │                │                │ (ensure unique)│
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │                │ Create entity  │
     │                │                │ Save tags      │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │ ServerResponse │                │
     │                │<───────────────│                │
     │                │                │                │
     │ 201 Created    │                │                │
     │ ServerResponse │                │                │
     │<───────────────│                │                │
```

### Vote Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │Controller│     │ Service  │     │Repository│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ POST /votes    │                │                │
     │ /server/{id}   │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │ @EmailVerified │                │
     │                │ check          │                │
     │                │                │                │
     │                │ voteForServer()│                │
     │                │───────────────>│                │
     │                │                │                │
     │                │                │ Check existing │
     │                │                │ vote today     │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │                │ (if exists)    │
     │                │ 409 Conflict   │                │
     │                │<───────────────│                │
     │                │                │                │
     │                │                │ Create vote    │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │                │ Increment      │
     │                │                │ server count   │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │ 201 Created    │                │                │
     │<───────────────│                │                │
```

---

## Security Architecture

### Authentication Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    Request from Client                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CORS Filter                                   │
│              (CorsConfig.java)                                   │
│   - Allows frontend origin only                                  │
│   - Allows credentials                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               JWT Authentication Filter                          │
│           (JwtAuthenticationFilter.java)                         │
│   - Extract token from cookie                                    │
│   - Validate signature and expiry                                │
│   - Set SecurityContext                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               Spring Security Filter Chain                       │
│              (SecurityConfig.java)                               │
│   - Public endpoint allowlist                                    │
│   - Role-based access control                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              @PreAuthorize Annotations                           │
│              (on Controller methods)                             │
│   - Method-level authorization                                   │
│   - Role checks (ADMIN, MODERATOR)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              @EmailVerified Aspect                               │
│            (EmailVerifiedAspect.java)                            │
│   - Checks emailVerified flag                                    │
│   - Throws ForbiddenException if not verified                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Controller Method                             │
└─────────────────────────────────────────────────────────────────┘
```

### Role Hierarchy

```
ADMIN
  │
  ├── All MODERATOR permissions
  ├── Delete any server
  ├── Ban/unban users
  ├── Change user roles
  └── View audit log

MODERATOR
  │
  ├── All USER permissions
  ├── Feature/unfeature servers
  ├── Verify/unverify servers
  └── Delete any review

USER (verified email)
  │
  ├── Create/edit/delete own servers
  ├── Vote for servers (once daily)
  ├── Write/edit/delete own reviews
  └── Upload files

USER (unverified email)
  │
  ├── Browse servers
  ├── View server details
  ├── View reviews
  └── Update own profile

GUEST (not authenticated)
  │
  ├── Browse servers
  ├── View server details
  ├── View reviews
  └── Register/login
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CDN / Edge Network                            │
│                  (Static asset caching)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   Frontend Container    │     │   Backend Container     │
│      (Next.js)          │     │    (Spring Boot)        │
│                         │     │                         │
│   - SSR rendering       │────>│   - REST API            │
│   - Static pages        │     │   - WebSocket           │
│   - API proxy           │     │   - Scheduled tasks     │
└─────────────────────────┘     └────────────┬────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
        │    PostgreSQL     │    │  Cloudflare R2    │    │   SMTP Service    │
        │    (Database)     │    │  (File Storage)   │    │   (Email)         │
        │                   │    │                   │    │                   │
        │ - Connection pool │    │ - Icons           │    │ - Verification    │
        │ - Backups         │    │ - Banners         │    │ - Password reset  │
        │ - Replication     │    │ - Avatars         │    │                   │
        └───────────────────┘    └───────────────────┘    └───────────────────┘
```

### Environment Configuration

| Environment | Frontend URL | Backend URL | Database |
|-------------|--------------|-------------|----------|
| Development | localhost:3000 | localhost:8080 | localhost:5432 |
| Staging | staging.example.com | api-staging.example.com | Staging DB |
| Production | example.com | api.example.com | Production DB |
