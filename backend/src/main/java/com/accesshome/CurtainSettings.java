package com.accesshome;

import jakarta.persistence.*;

@Entity
@Table(name = "curtain_settings")
public class CurtainSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String room;
    private int openPercent;

    public CurtainSettings() {}

    public CurtainSettings(String room, int openPercent) {
        this.room = room;
        this.openPercent = openPercent;
    }

    public Long getId() { return id; }
    public String getRoom() { return room; }
    public int getOpenPercent() { return openPercent; }
    public void setOpenPercent(int openPercent) { this.openPercent = openPercent; }
}