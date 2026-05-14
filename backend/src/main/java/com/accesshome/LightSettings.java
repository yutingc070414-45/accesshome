package com.accesshome;

import jakarta.persistence.*;

@Entity
@Table(name = "light_settings")
public class LightSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String room;
    private int brightness;
    @Column(name = "is_on")
    private boolean on;

    public LightSettings() {}

    public LightSettings(String room, int brightness, boolean on) {
        this.room = room;
        this.brightness = brightness;
        this.on = on;
    }

    public Long getId() { return id; }
    public String getRoom() { return room; }
    public int getBrightness() { return brightness; }
    public boolean isOn() { return on; }

    public void setBrightness(int brightness) { this.brightness = brightness; }
    public void setOn(boolean on) { this.on = on; }
}