package com.seva.platform.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (auth == null || !auth.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = auth.substring("Bearer ".length()).trim();
            FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(token);

            String uid = decoded.getUid();

            // Custom Claim check
            Object role = decoded.getClaims().get("role");
            boolean isAdmin = "admin".equals(role);

            List<SimpleGrantedAuthority> authorities = isAdmin
                    ? List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    : List.of(new SimpleGrantedAuthority("ROLE_USER"));

            AbstractAuthenticationToken authentication = new AbstractAuthenticationToken(authorities) {
                @Override public Object getCredentials() { return token; }
                @Override public Object getPrincipal() { return new AuthUser(uid, isAdmin); }
            };
            authentication.setAuthenticated(true);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
