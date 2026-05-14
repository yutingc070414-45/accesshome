package com.accesshome;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CurtainRepository extends JpaRepository<CurtainSettings, Long> {
    CurtainSettings findByRoom(String room);
}