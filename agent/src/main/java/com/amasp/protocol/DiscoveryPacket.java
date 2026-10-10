package com.amasp.protocol;

import java.util.UUID;

public class DiscoveryPacket extends Packet {
    public DiscoveryPacket(UUID deviceId, int port){
        super(PacketType.DISCOVERY, deviceId, port);
    }
}
