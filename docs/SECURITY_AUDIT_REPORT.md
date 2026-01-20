# Security Audit Report: Hytale Online List

**Audit Date:** January 20, 2026
**Auditor:** Security Assessment
**Scope:** Full-Stack Application (Frontend + Backend)
**Framework Reference:** OWASP Top 10 2021

---

## Executive Summary

The Hytale Online List application demonstrates **solid foundational security practices** with proper JWT-based authentication, role-based access control, BCrypt password hashing, and well-designed DTOs that prevent sensitive data exposure. However, several security issues were identified that should be addressed before production deployment.

**Overall Security Rating: 7.5/10** (Good foundation with room for hardening)

### Risk Distribution

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 6 |
| Medium | 8 |
| Low | 7 |

---

## Table of Contents

1. [OWASP Top 10 Analysis](#owasp-top-10-analysis)
2. [Backend Security Findings](#backend-security-findings)
3. [Frontend Security Findings](#frontend-security-findings)
4. [DTO & Data Exposure Analysis](#dto--data-exposure-analysis)
5. [Authentication & Authorization Review](#authentication--authorization-review)
6. [Detailed Vulnerability List](#detailed-vulnerability-list)
7. [Recommendations](#recommendations)
8. [Production Deployment Checklist](#production-deployment-checklist)

---

## OWASP Top 10 Analysis

### A01:2021 - Broken Access Control

**Status:** ✅ Generally Well Implemented

**Findings:**
- ✅ Role-based access control (RBAC) properly implemented with `@PreAuthorize` annotations
- ✅ IDOR protections in place - server update/delete operations verify ownership
- ✅ Admin operations restricted to ADMIN/MODERATOR roles
- ✅ Self-modification protection (can't ban self, can't change own role)
- ⚠️ Client-side admin panel checks exist but backend enforces them properly

**Code Evidence:**
```java
// ServerService.java:179-182 - Proper IDOR protection
if (server.getOwner() == null || !server.getOwner().getId().equals(owner.getId())) {
    throw new SecurityException("You are not the owner of this server");
}
```

```java
// AdminController.java:78-79 - Proper role enforcement
@PostMapping("/users/{id}/ban")
@PreAuthorize("hasRole('ADMIN')")
```

---

### A02:2021 - Cryptographic Failures

**Status:** ⚠️ Needs Attention

**Findings:**
- ✅ Passwords hashed with BCrypt (secure)
- ✅ JWT tokens signed with HMAC-SHA256
- ✅ Refresh tokens stored server-side in database
- ❌ **CRITICAL:** Default JWT secret exposed in configuration file
- ⚠️ Cookie secure flag defaults to `false`

**Vulnerability Details:**

| ID | Issue | Location | Severity |
|----|-------|----------|----------|
| CRYPTO-01 | Default JWT secret in config | `application.yml:79` | **CRITICAL** |
| CRYPTO-02 | Cookie secure flag default false | `application.yml:87` | HIGH |

**Evidence:**
```yaml
# application.yml:79 - CRITICAL: Default secret exposed
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-change-in-production-must-be-at-least-32-chars}
```

---

### A03:2021 - Injection

**Status:** ✅ Well Protected

**Findings:**
- ✅ JPA/Hibernate prevents SQL injection via parameterized queries
- ✅ Native queries use `@Param` binding properly
- ✅ No string concatenation in queries
- ✅ Input validation via Bean Validation annotations

**Code Evidence:**
```java
// ServerRepository.java:30-55 - Safe parameterized query
@Query(value = "SELECT s.* FROM servers s ... WHERE (:search IS NULL OR :search = '' OR " +
       "CAST(s.name AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%')...",
       nativeQuery = true)
Page<ServerEntity> findWithFilters(@Param("search") String search, ...);
```

---

### A04:2021 - Insecure Design

**Status:** ⚠️ Minor Issues

**Findings:**
- ✅ Email enumeration prevented on forgot-password endpoint
- ✅ Proper token expiration for email verification (24h) and password reset (1h)
- ⚠️ No rate limiting on authentication endpoints
- ⚠️ No account lockout after failed login attempts

---

### A05:2021 - Security Misconfiguration

**Status:** ⚠️ Needs Attention

**Findings:**
- ❌ **CRITICAL:** No security headers in frontend (CSP, X-Frame-Options, etc.)
- ❌ Missing `middleware.ts` for Next.js security headers
- ⚠️ CORS allows all headers (`List.of("*")`)
- ⚠️ No HSTS configuration
- ✅ CSRF disabled appropriately for stateless JWT API

**Vulnerability Details:**

| ID | Issue | Location | Severity |
|----|-------|----------|----------|
| CONFIG-01 | No security headers | Frontend | **CRITICAL** |
| CONFIG-02 | Missing middleware.ts | Frontend | HIGH |
| CONFIG-03 | CORS headers too permissive | `SecurityConfig.java:76` | MEDIUM |

---

### A06:2021 - Vulnerable and Outdated Components

**Status:** ✅ Good

**Findings:**
- ✅ Spring Boot 4.0.1 (current)
- ✅ JJWT 0.12.6 (current)
- ✅ Next.js 16.1.1 (current)
- ✅ No known critical CVEs in dependencies

---

### A07:2021 - Identification and Authentication Failures

**Status:** ⚠️ Minor Issues

**Findings:**
- ✅ Strong password requirements (min 8 characters)
- ✅ Email verification required for sensitive actions
- ✅ Session invalidation on logout and password reset
- ✅ Refresh token rotation implemented
- ⚠️ No rate limiting on login endpoint
- ⚠️ No MFA/2FA support

---

### A08:2021 - Software and Data Integrity Failures

**Status:** ✅ Good

**Findings:**
- ✅ JWT tokens cryptographically signed
- ✅ File upload validation (MIME type, size limits)
- ⚠️ File magic number validation not implemented
- ✅ Refresh tokens stored server-side with revocation capability

---

### A09:2021 - Security Logging and Monitoring Failures

**Status:** ⚠️ Needs Improvement

**Findings:**
- ✅ Admin actions logged to `AdminActionEntity` table
- ❌ Generic exception handler doesn't log security exceptions
- ⚠️ No structured security event logging
- ⚠️ No alerting mechanism for suspicious activity

**Vulnerability Details:**

| ID | Issue | Location | Severity |
|----|-------|----------|----------|
| LOG-01 | Missing exception logging | `GlobalExceptionHandler.java` | MEDIUM |

---

### A10:2021 - Server-Side Request Forgery (SSRF)

**Status:** ✅ Not Applicable / Well Controlled

**Findings:**
- ✅ File uploads go to Cloudflare R2 (external storage)
- ✅ No user-controlled URL fetching observed
- ✅ OAuth callbacks use predefined provider URLs

---

## Backend Security Findings

### Authentication & Session Management

| Finding | Status | Details |
|---------|--------|---------|
| JWT Implementation | ✅ Secure | HMAC-SHA256, proper expiration (15min access, 7d refresh) |
| Refresh Token Storage | ✅ Secure | Server-side DB storage with revocation |
| Cookie Configuration | ⚠️ Needs Review | HttpOnly ✅, SameSite ✅, Secure flag configurable |
| Password Storage | ✅ Secure | BCrypt hashing |
| Session Invalidation | ✅ Secure | Logout revokes all tokens, password reset invalidates sessions |

### Authorization Controls

| Finding | Status | Details |
|---------|--------|---------|
| Role-Based Access | ✅ Secure | USER, MODERATOR, ADMIN properly enforced |
| Method-Level Security | ✅ Secure | `@PreAuthorize` annotations throughout |
| Resource Ownership | ✅ Secure | IDOR checks on server/review operations |
| Admin Protections | ✅ Secure | Can't self-ban, can't ban other admins, can't self-promote |

### Input Validation

| Finding | Status | Details |
|---------|--------|---------|
| Request DTOs | ✅ Secure | Bean Validation with `@Valid` |
| Username Pattern | ✅ Secure | `^[a-zA-Z0-9_]+$` regex enforcement |
| Email Validation | ✅ Secure | `@Email` annotation |
| Password Length | ✅ Secure | Minimum 8 characters |
| File Upload | ⚠️ Partial | MIME type checked, but no magic number validation |

---

## Frontend Security Findings

### Critical Issues

#### 1. Missing Security Headers (CRITICAL)

**Location:** No `middleware.ts` file exists

**Impact:** Application is vulnerable to:
- Clickjacking (no X-Frame-Options)
- XSS attacks (no Content-Security-Policy)
- MIME-type sniffing (no X-Content-Type-Options)
- Referrer information leakage (no Referrer-Policy)

**Recommendation:** Create `src/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.hytaleonlinelist.com;"
  );
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

#### 2. Token in URL Query Parameters (HIGH)

**Location:** `src/lib/auth-api.ts:34`

```typescript
verifyEmail: (token: string): Promise<MessageResponse> => {
  return api.post<MessageResponse>(`/api/auth/verify-email?token=${token}`);
},
```

**Impact:** Tokens exposed in:
- Browser history
- Server logs
- Referrer headers
- Analytics systems

**Recommendation:** Move token to POST body:
```typescript
verifyEmail: (token: string): Promise<MessageResponse> => {
  return api.post<MessageResponse>('/api/auth/verify-email', { token });
},
```

### Other Frontend Findings

| Finding | Severity | Location | Details |
|---------|----------|----------|---------|
| Client-side auth state only | LOW | `AuthContext.tsx` | Session managed in Context, relies on backend cookies |
| Email exposed in UI | LOW | `Navbar.tsx` | User email visible in dropdown |
| No CAPTCHA on forms | MEDIUM | Contact, forgot-password | Bot protection missing |
| OAuth state parameter | MEDIUM | `login/page.tsx` | No visible CSRF protection on OAuth flow |

---

## DTO & Data Exposure Analysis

### Response DTOs - Properly Secured

| DTO | Fields Exposed | Sensitive Data Protected |
|-----|----------------|--------------------------|
| `UserResponse` | id, username, avatarUrl | ✅ No email, no internal data |
| `AuthResponse` | id, username, email, avatarUrl, bio, role, emailVerified, createdAt | ✅ Only user's own data |
| `ProfileResponse` | Same as AuthResponse | ✅ Only user's own data |
| `AdminUserResponse` | Includes email, ban status | ✅ Admin-only access |
| `ServerResponse` | Public server info | ✅ No sensitive data |

### Entity vs DTO Comparison

**UserEntity (Protected Fields):**
- `passwordHash` - ❌ Never exposed (CORRECT)
- `emailVerificationToken` - ❌ Never exposed (CORRECT)
- `passwordResetToken` - ❌ Never exposed (CORRECT)
- `emailVerificationTokenExpiry` - ❌ Never exposed (CORRECT)
- `passwordResetTokenExpiry` - ❌ Never exposed (CORRECT)
- `oauthId` - ❌ Never exposed (CORRECT)

**Conclusion:** DTOs are properly designed and do not expose sensitive entity fields.

---

## Authentication & Authorization Review

### JWT Token Security

```java
// JwtTokenProvider.java - Secure Implementation
public String generateAccessToken(UUID userId, String email, String role) {
    return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", role)
            .issuedAt(now)
            .expiration(expiry)  // 15 minutes
            .signWith(key)       // HMAC-SHA256
            .compact();
}
```

**Assessment:**
- ✅ Short-lived access tokens (15 minutes)
- ✅ Refresh tokens stored in database (revocable)
- ✅ Proper claims (userId, email, role)
- ⚠️ Role stored in JWT - changes require re-auth

### Cookie Configuration

```java
// CookieUtils.java
- HttpOnly: true (prevents XSS access)
- SameSite: Lax (access), Strict (refresh)
- Secure: configurable (MUST be true in production)
- Path: "/" (access), "/api/auth/refresh" (refresh)
```

**Assessment:** Cookie configuration is secure when `COOKIE_SECURE=true`

---

## Detailed Vulnerability List

### Critical Severity

| ID | Title | Location | CVSS | Status |
|----|-------|----------|------|--------|
| SEC-001 | Default JWT Secret Exposed | `application.yml:79` | 9.8 | Open |
| SEC-002 | Missing Security Headers | Frontend | 7.5 | Open |

### High Severity

| ID | Title | Location | CVSS | Status |
|----|-------|----------|------|--------|
| SEC-003 | Token in URL Query Parameter | `auth-api.ts:34` | 6.5 | Open |
| SEC-004 | Cookie Secure Flag Default False | `application.yml:87` | 6.5 | Open |
| SEC-005 | No Rate Limiting on Auth | `AuthController.java` | 6.5 | Open |
| SEC-006 | CORS Headers Too Permissive | `SecurityConfig.java:76` | 5.3 | Open |
| SEC-007 | File Magic Number Validation Missing | `FileUploadService.java` | 5.3 | Open |
| SEC-008 | No Account Lockout | `AuthService.java` | 5.3 | Open |

### Medium Severity

| ID | Title | Location | CVSS | Status |
|----|-------|----------|------|--------|
| SEC-009 | Missing Exception Logging | `GlobalExceptionHandler.java` | 4.3 | Open |
| SEC-010 | No CAPTCHA on Forms | Contact, Forgot Password | 4.3 | Open |
| SEC-011 | OAuth State Parameter Missing | `login/page.tsx` | 4.3 | Open |
| SEC-012 | No HSTS Configuration | Backend | 4.3 | Open |
| SEC-013 | Password Reset Token in Email | Email templates | 4.0 | Open |
| SEC-014 | Verbose Error Messages | Various controllers | 3.7 | Open |
| SEC-015 | Settings Changes Not Persisted | `AppProperties.java` | 3.7 | Open |
| SEC-016 | No IP-Based Fraud Detection | Auth system | 3.7 | Open |

### Low Severity

| ID | Title | Location | CVSS | Status |
|----|-------|----------|------|--------|
| SEC-017 | Email Exposed in Navbar | `Navbar.tsx` | 2.4 | Open |
| SEC-018 | No MFA/2FA Support | Auth system | 2.4 | Open |
| SEC-019 | Admin Audit Log Plain Text | `AdminActionEntity` | 2.4 | Open |
| SEC-020 | No Content Security Policy | Frontend | 2.4 | Open |
| SEC-021 | External Image Domains | `next.config.ts` | 2.0 | Accepted |
| SEC-022 | No Cache Control on Sensitive Pages | Frontend | 2.0 | Open |
| SEC-023 | Debug Endpoints Possible | Development config | 2.0 | Open |

---

## Recommendations

### Immediate Actions (Before Production)

1. **Set JWT_SECRET environment variable** - Generate a cryptographically secure 256-bit key
   ```bash
   openssl rand -base64 32
   ```

2. **Create security headers middleware** in frontend (see code above)

3. **Move verification token from URL to POST body**

4. **Set `COOKIE_SECURE=true`** in production environment

5. **Restrict CORS headers:**
   ```java
   configuration.setAllowedHeaders(List.of(
       "Content-Type", "Authorization", "X-Requested-With", "Accept"
   ));
   ```

### Short-Term (1-2 Weeks)

6. Implement rate limiting on authentication endpoints
7. Add file magic number validation for uploads
8. Implement account lockout after failed attempts
9. Add CAPTCHA to contact and password reset forms
10. Configure HSTS headers

### Medium-Term (1 Month)

11. Implement OAuth state parameter validation
12. Add structured security event logging
13. Implement IP-based suspicious activity detection
14. Add optional 2FA/MFA support
15. Review and enhance error messages to be less verbose

### Long-Term (3+ Months)

16. Implement Web Application Firewall (WAF)
17. Conduct penetration testing
18. Set up security monitoring and alerting
19. Regular dependency vulnerability scanning
20. Security training for development team

---

## Production Deployment Checklist

### Environment Variables (REQUIRED)

| Variable | Description | Status |
|----------|-------------|--------|
| `JWT_SECRET` | 256-bit secret key | ⬜ Configure |
| `COOKIE_SECURE` | Must be `true` | ⬜ Configure |
| `COOKIE_DOMAIN` | Production domain | ⬜ Configure |
| `FRONTEND_URL` | Production frontend URL | ⬜ Configure |
| `DB_USERNAME` | Database username | ⬜ Configure |
| `DB_PASSWORD` | Database password | ⬜ Configure |
| `DISCORD_CLIENT_ID` | OAuth client ID | ⬜ Configure |
| `DISCORD_CLIENT_SECRET` | OAuth client secret | ⬜ Configure |
| `GOOGLE_CLIENT_ID` | OAuth client ID | ⬜ Configure |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | ⬜ Configure |

### Security Configuration

| Item | Description | Status |
|------|-------------|--------|
| HTTPS | TLS 1.2+ enabled | ⬜ Verify |
| Security headers | CSP, X-Frame-Options, etc. | ⬜ Implement |
| Rate limiting | Auth endpoint protection | ⬜ Implement |
| Logging | Security event logging | ⬜ Configure |
| Monitoring | Error and intrusion detection | ⬜ Configure |

### Pre-Launch Verification

| Test | Description | Status |
|------|-------------|--------|
| View source check | Verify no loading spinners for SSR pages | ⬜ Test |
| Lighthouse audit | Aim for 90+ security score | ⬜ Test |
| OWASP ZAP scan | Automated vulnerability scan | ⬜ Run |
| Manual penetration test | Auth, IDOR, XSS testing | ⬜ Perform |
| Cookie inspection | Verify Secure, HttpOnly, SameSite | ⬜ Verify |

---

## Appendix: Files Reviewed

### Backend
- `SecurityConfig.java` - Security configuration
- `JwtTokenProvider.java` - JWT handling
- `JwtAuthenticationFilter.java` - Request authentication
- `AuthController.java` - Auth endpoints
- `AuthService.java` - Auth business logic
- `AdminController.java` - Admin endpoints
- `AdminService.java` - Admin operations
- `ServerController.java` - Server endpoints
- `ServerService.java` - Server operations
- `ReviewController.java` - Review endpoints
- `UserEntity.java` - User data model
- `ServerRepository.java` - Database queries
- `GlobalExceptionHandler.java` - Error handling
- `application.yml` - Configuration
- All DTOs in `dto/response/` and `dto/request/`

### Frontend
- `AuthContext.tsx` - Auth state management
- `auth-api.ts` - Auth API calls
- `api.ts` - Base API client
- `admin-api.ts` - Admin API calls
- `next.config.ts` - Next.js configuration
- `login/page.tsx` - Login page
- `register/page.tsx` - Registration page
- `verify-email/page.tsx` - Email verification
- `reset-password/page.tsx` - Password reset
- `Navbar.tsx` - Navigation with user info
- Various form components

---

**Report Generated:** January 20, 2026
**Next Review Date:** Recommended within 90 days or after major changes
