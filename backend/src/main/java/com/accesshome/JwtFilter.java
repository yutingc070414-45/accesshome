package com.accesshome;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.Collections;

public class JwtFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        String path = req.getRequestURI();

        // public routes
        if (path.startsWith("/api/auth")) {
            chain.doFilter(request, response);
            return;
        }

        String token = req.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            "user",
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(auth);

        }

        chain.doFilter(request, response);
    }
}