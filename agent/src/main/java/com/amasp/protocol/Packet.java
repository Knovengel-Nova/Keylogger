package com.amasp.protocol;

import java.util.UUID;

public class Packet {
    protected PacketType packetType;
    protected UUID deviceId;

    public Packet(){}

    public Packet(PacketType packetType, UUID deviceId) {
        this.packetType = packetType;
        this.deviceId = deviceId;
    }

    public PacketType getPacketType() {
        return packetType;
    }

    public void setPacketType(PacketType packetType) {
        this.packetType = packetType;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }
    @Override
    public String toString() {
        return "pkt"+"["+packetType+","+deviceId+"]";
    }
}
