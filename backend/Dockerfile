# =============================================================================
# Multi-stage Dockerfile for Hytale Online List Backend
# Java 25 LTS - Production Ready & Secure
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /build

# Install Maven (Alpine package)
RUN apk add --no-cache maven

# Copy only pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .

# Limit Maven JVM memory to prevent OOM during build
ENV MAVEN_OPTS="-Xmx512m -Xms256m -XX:+UseSerialGC"

# Download dependencies (cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests - they should run in CI)
# -T 1 limits to single thread to reduce memory pressure
RUN mvn clean package -DskipTests -B -T 1 && \
    # Extract the layered JAR for optimized Docker layers
    java -Djarmode=layertools -jar target/*.jar extract --destination extracted

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime
# -----------------------------------------------------------------------------
FROM eclipse-temurin:25-jre-alpine AS runtime

# Security: Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup --no-create-home appuser

WORKDIR /app

# Security: Set proper permissions
RUN chown -R appuser:appgroup /app

# Copy extracted layers (in order of least to most frequently changed)
COPY --from=builder --chown=appuser:appgroup /build/extracted/dependencies/ ./
COPY --from=builder --chown=appuser:appgroup /build/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=appuser:appgroup /build/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=appuser:appgroup /build/extracted/application/ ./

# Security: Switch to non-root user
USER appuser

# Health check endpoint (use 127.0.0.1 to avoid IPv6 issues)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# JVM Configuration for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.backgroundpreinitializer.ignore=true"

# Run the application using Spring Boot's layered JAR launcher
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
