package com.accesshome;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LightRepository extends JpaRepository<LightSettings, Long> {
    LightSettings findByRoom(String room);
}