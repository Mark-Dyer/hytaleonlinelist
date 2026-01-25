# Hytale Online List - Backend

Spring Boot 4.0 backend API for Hytale Online List.

## Prerequisites

- Java 25 (for local development without Docker)
- Maven 3.9+ (for local development without Docker)
- Docker & Docker Compose (for containerized development)

## Local Development

### Option 1: Docker Compose (Recommended)

The easiest way to run the backend locally with all dependencies.

**What's included:**
- Backend API (Java 25, Spring Boot)
- PostgreSQL 16 database

**Start the services:**

```bash
cd backend
docker compose up --build
```

**Start in detached mode (background):**

```bash
docker compose up --build -d
```

**View logs:**

```bash
docker compose logs -f backend
```

**Stop the services:**

```bash
docker compose down
```

**Stop and remove all data (including database):**

```bash
docker compose down -v
```

The API will be available at `http://localhost:8080`.

**Note:** The `docker-compose.yml` uses example environment variables. For actual development, you may want to create a `.env` file in the backend directory with your own values.

### Option 2: Maven (Direct)

Run the backend directly with Maven (requires local PostgreSQL).

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## Building for Production

### Docker Build

```bash
cd backend
docker build -t hytale-online-list-backend .
```

### Maven Build

```bash
cd backend
mvn clean package -DskipTests
```

The JAR file will be in `target/hytale-online-list-1.0.0-SNAPSHOT.jar`.

## Production Deployment (Coolify)

For Coolify deployment, use the following settings:

| Setting | Value |
|---------|-------|
| Build Pack | Dockerfile |
| Base Directory | `backend` |
| Dockerfile Location | `Dockerfile` |

Configure all environment variables in Coolify's environment settings. See the main project documentation for required variables.

## API Health Check

The backend exposes health endpoints via Spring Boot Actuator:

- **Health:** `GET /actuator/health`
- **Info:** `GET /actuator/info`

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/hytaleonlinelist/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-local.yml (git-ignored)
│   │       └── db/
│   └── test/
├── Dockerfile              # Production Docker build
├── docker-compose.yml      # Local development setup
├── .dockerignore           # Docker build exclusions
└── pom.xml                 # Maven configuration
```
