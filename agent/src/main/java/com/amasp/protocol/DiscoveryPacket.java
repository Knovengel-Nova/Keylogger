package com.amasp.protocol;

import java.util.UUID;

public class DiscoveryPacket extends Packet {
    public DiscoveryPacket(UUID deviceId){
        super(PacketType.DISCOVERY, deviceId);
    }
}
