package com.accesshome;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AcRepository extends JpaRepository<AcSettings, Long> {
    AcSettings findByRoom(String room);
}