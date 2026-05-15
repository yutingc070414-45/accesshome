package com.accesshome;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")

@Tag(
    name = "User API",
    description = "User authentication endpoints"
)
public class UserController {

    @Autowired
    private UserRepository repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Operation(summary = "Register new user")
    @PostMapping("/register")
    public String register(@Valid @RequestBody User user) {

        if (repo.findByEmail(user.getEmail()) != null) {
            return "EMAIL_EXISTS";
        }

        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);

        return "SUCCESS";
    }

    @Operation(summary = "Login user and generate JWT token")
    @PostMapping("/login")
    public java.util.Map<String, String> login(
            @RequestBody User user) {

        User existing = repo.findByEmail(user.getEmail());

        if (existing == null) {
            return java.util.Map.of(
                    "status", "NOT_FOUND");
        }

        if (!encoder.matches(
                user.getPassword(),
                existing.getPassword())) {

            return java.util.Map.of(
                    "status", "WRONG_PASSWORD");
        }

        String token =
                JwtUtil.generateToken(
                        existing.getEmail());

        return java.util.Map.of(
                "status", "SUCCESS",
                "name", existing.getName(),
                "token", token);
    }
}