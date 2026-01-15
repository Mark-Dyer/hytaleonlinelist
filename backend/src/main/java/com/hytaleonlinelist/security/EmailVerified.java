package com.hytaleonlinelist.security;

import java.lang.annotation.*;

/**
 * Annotation to mark methods that require email verification.
 * Methods annotated with @EmailVerified will throw a ForbiddenException
 * if the authenticated user's email is not verified.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface EmailVerified {
}
