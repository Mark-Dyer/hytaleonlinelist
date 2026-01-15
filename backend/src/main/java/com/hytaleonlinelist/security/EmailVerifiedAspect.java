package com.hytaleonlinelist.security;

import com.hytaleonlinelist.exception.ForbiddenException;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class EmailVerifiedAspect {

    @Before("@annotation(EmailVerified)")
    public void checkEmailVerified() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenException("Authentication required");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal userPrincipal) {
            if (!userPrincipal.emailVerified()) {
                throw new ForbiddenException("Email verification required. Please verify your email to perform this action.");
            }
        } else {
            throw new ForbiddenException("Invalid authentication");
        }
    }
}
