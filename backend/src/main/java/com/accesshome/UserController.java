package com.accesshome;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository repo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (repo.findByEmail(user.getEmail()) != null) {
            return "EMAIL_EXISTS";
        }
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return "SUCCESS";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existing = repo.findByEmail(user.getEmail());
        if (existing == null) {
            return "NOT_FOUND";
        }
        if (encoder.matches(user.getPassword(), existing.getPassword())) {
            return "SUCCESS:" + existing.getName();
        }
        return "WRONG_PASSWORD";
    }
}