package com.amasp.protocol;

import java.util.UUID;

public class Packet {
    protected PacketType packetType;
    protected UUID deviceId;
    protected int port;

    public Packet(){}

    public Packet(PacketType packetType, UUID deviceId,  int port) {
        this.packetType = packetType;
        this.deviceId = deviceId;
        this.port = port;
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

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }
}
