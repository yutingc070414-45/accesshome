package com.accesshome;

import jakarta.persistence.*;

@Entity
@Table(name = "ac_settings")
public class AcSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String room;
    private int temperature;
    private String mode;
    private int fanSpeed;
    @Column(name = "is_on")
    private boolean on;

    public AcSettings() {}

    public AcSettings(String room, int temperature, String mode, int fanSpeed, boolean on) {
        this.room = room;
        this.temperature = temperature;
        this.mode = mode;
        this.fanSpeed = fanSpeed;
        this.on = on;
    }

    public Long getId() { return id; }
    public String getRoom() { return room; }
    public int getTemperature() { return temperature; }
    public String getMode() { return mode; }
    public int getFanSpeed() { return fanSpeed; }
    public boolean isOn() { return on; }

    public void setTemperature(int temperature) { this.temperature = temperature; }
    public void setMode(String mode) { this.mode = mode; }
    public void setFanSpeed(int fanSpeed) { this.fanSpeed = fanSpeed; }
    public void setOn(boolean on) { this.on = on; }
}