package com.accesshome;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET =
        "accesshomesecretkey2026accesshomeprojectjwtsecurity";

    public static String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis() + 86400000))
                .signWith(
                        SignatureAlgorithm.HS256,
                        SECRET)
                .compact();
    }
}