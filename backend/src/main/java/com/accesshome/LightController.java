package com.accesshome;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lights")
@CrossOrigin(origins = "*")

@Tag(
    name = "Light API",
    description = "Smart light control endpoints"
)
public class LightController {

    @Autowired
    private LightRepository repo;

    @Bean
    public CommandLineRunner initLights() {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new LightSettings("Living Room", 75, true));
                repo.save(new LightSettings("Bedroom", 30, false));
                repo.save(new LightSettings("Kitchen", 100, true));
                repo.save(new LightSettings("Bathroom", 50, false));
            }
        };
    }

    @Operation(summary = "Get all light settings")
    @GetMapping
    public List<LightSettings> getAll() {
        return repo.findAll();
    }

    @Operation(summary = "Update light settings")
    @PostMapping("/update")
    public LightSettings update(
            @RequestBody LightSettings updated) {

        LightSettings existing =
                repo.findByRoom(updated.getRoom());

        if (existing != null) {

            existing.setBrightness(
                    updated.getBrightness());

            existing.setOn(
                    updated.isOn());

            return repo.save(existing);
        }

        return null;
    }
}