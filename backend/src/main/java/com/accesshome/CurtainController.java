package com.accesshome;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curtain")
@CrossOrigin(origins = "*")

@Tag(
    name = "Curtain API",
    description = "Smart curtain control endpoints"
)
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

    @Operation(summary = "Get all curtain settings")
    @GetMapping
    public List<CurtainSettings> getAll() {
        return repo.findAll();
    }

    @Operation(summary = "Update curtain settings")
    @PostMapping("/update")
    public CurtainSettings update(
            @RequestBody CurtainSettings updated) {

        CurtainSettings existing =
                repo.findByRoom(updated.getRoom());

        if (existing != null) {

            existing.setOpenPercent(
                    updated.getOpenPercent());

            return repo.save(existing);
        }

        return null;
    }
}