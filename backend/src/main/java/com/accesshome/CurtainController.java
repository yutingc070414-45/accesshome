package com.accesshome;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/curtain")
@CrossOrigin(origins = "*")
public class CurtainController {

    @Autowired
    private CurtainRepository repo;

    @Bean
    public CommandLineRunner initCurtain() {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new CurtainSettings("Living Room", 60));
                repo.save(new CurtainSettings("Bedroom", 0));
                repo.save(new CurtainSettings("Kitchen", 100));
                repo.save(new CurtainSettings("Home Office", 40));
            }
        };
    }

    @GetMapping
    public List<CurtainSettings> getAll() {
        return repo.findAll();
    }

    @PostMapping("/update")
    public CurtainSettings update(@RequestBody CurtainSettings updated) {
        CurtainSettings existing = repo.findByRoom(updated.getRoom());
        if (existing != null) {
            existing.setOpenPercent(updated.getOpenPercent());
            return repo.save(existing);
        }
        return null;
    }
}