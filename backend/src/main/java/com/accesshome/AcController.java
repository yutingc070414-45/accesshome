package com.accesshome;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ac")
@CrossOrigin(origins = "*")

@Tag(
    name = "AC API",
    description = "Air conditioning control endpoints"
)
public class AcController {

    @Autowired
    private AcRepository repo;

    @Bean
    public CommandLineRunner initAC() {
        return args -> {
            if (repo.count() == 0) {
                repo.save(
                    new AcSettings(
                        "Living Room", 22,
                        "Cool", 2, true));

                repo.save(
                    new AcSettings(
                        "Bedroom", 20,
                        "Fan", 1, false));

                repo.save(
                    new AcSettings(
                        "Home Office", 24,
                        "Cool", 3, false));
            }
        };
    }

    @Operation(summary = "Get all AC settings")
    @GetMapping
    public List<AcSettings> getAll() {
        return repo.findAll();
    }

    @Operation(summary = "Update AC settings")
    @PostMapping("/update")
    public AcSettings update(
            @RequestBody AcSettings updated) {

        AcSettings existing =
                repo.findByRoom(updated.getRoom());

        if (existing != null) {

            existing.setTemperature(
                    updated.getTemperature());

            existing.setMode(
                    updated.getMode());

            existing.setFanSpeed(
                    updated.getFanSpeed());

            existing.setOn(
                    updated.isOn());

            return repo.save(existing);
        }

        return null;
    }
}