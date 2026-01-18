# Hytale Online List - Documentation

A comprehensive server listing and discovery platform for Hytale game servers. This application enables players to discover, vote for, and review game servers while providing server owners with management tools and real-time monitoring capabilities.

## Table of Contents

- [Overview](#overview)
- [Documentation Index](#documentation-index)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)

---

## Overview

Hytale Online List is a full-stack web application consisting of:

- **Frontend**: Next.js 16 React application with server-side rendering
- **Backend**: Spring Boot 3 REST API with PostgreSQL database
- **Infrastructure**: Cloudflare R2 for file storage, email service integration

### Key Capabilities

| Area | Features |
|------|----------|
| **Discovery** | Browse servers by category, search, filter by online status, sort by votes/players |
| **Community** | Daily voting system, star ratings, written reviews |
| **Server Management** | Add/edit/delete servers, upload icons and banners |
| **Real-time Monitoring** | Automated server pinging, uptime tracking, player count history |
| **Administration** | User management, server moderation, audit logging |

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [FEATURES.md](./FEATURES.md) | Comprehensive feature documentation with user flows |
| [API.md](./API.md) | Complete REST API reference with endpoints and examples |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture, system design, and component diagrams |
| [DATABASE.md](./DATABASE.md) | Database schema, entities, and relationships |

---

## Quick Start

### Prerequisites

- **Java 21+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **PostgreSQL 15+** - Database
- **Maven 3.9+** - Backend build tool

### Backend Setup

```bash
cd backend

# Configure database connection
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Edit application.yml with your database credentials

# Run with Maven
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Database Setup

```sql
-- Create database
CREATE DATABASE hytaleonlinelist;

-- Create user (optional)
CREATE USER hol_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hytaleonlinelist TO hol_user;
```

Flyway migrations will automatically run on backend startup.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Radix UI | Latest | Accessible component primitives |
| Recharts | 3.6.0 | Data visualization |
| Lucide React | Latest | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.4.5 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | Database abstraction |
| PostgreSQL | 15+ | Relational database |
| Flyway | 11.x | Database migrations |
| JJWT | 0.12.x | JWT token handling |
| Cloudflare R2 | - | Object storage (S3-compatible) |

### Infrastructure

| Service | Purpose |
|---------|---------|
| PostgreSQL | Primary database |
| Cloudflare R2 | File storage (icons, banners, avatars) |
| SMTP Server | Email delivery (verification, password reset) |

---

## Project Structure

```
hytaleonlinelist/
├── backend/                    # Spring Boot application
│   ├── src/main/java/
│   │   └── com/hytaleonlinelist/
│   │       ├── config/         # Configuration classes
│   │       ├── controller/     # REST controllers
│   │       ├── domain/         # Entities & repositories
│   │       ├── dto/            # Request/response DTOs
│   │       ├── exception/      # Custom exceptions
│   │       ├── security/       # JWT & auth components
│   │       └── service/        # Business logic
│   └── src/main/resources/
│       ├── db/migration/       # Flyway migrations
│       └── application.yml     # Configuration
│
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── contexts/          # React context providers
│   │   ├── lib/               # API clients & utilities
│   │   └── types/             # TypeScript definitions
│   └── public/                # Static assets
│
└── docs/                      # Documentation
    ├── README.md              # This file
    ├── FEATURES.md            # Feature documentation
    ├── API.md                 # API reference
    ├── ARCHITECTURE.md        # Technical architecture
    └── DATABASE.md            # Database schema
```

---

## Environment Variables

### Backend (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hytaleonlinelist
    username: your_username
    password: your_password

jwt:
  secret: your-256-bit-secret-key
  access-token-expiration: 900000      # 15 minutes
  refresh-token-expiration: 604800000  # 7 days

cloudflare:
  r2:
    enabled: true
    access-key-id: your_access_key
    secret-access-key: your_secret_key
    bucket-name: your_bucket
    account-id: your_account_id
    public-url: https://your-bucket.r2.dev

spring.mail:
  host: smtp.example.com
  port: 587
  username: your_email
  password: your_password
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## License

This project is proprietary software. All rights reserved.

---

## Support

For issues and feature requests, please contact the development team.
