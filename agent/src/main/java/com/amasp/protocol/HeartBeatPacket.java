package com.amasp.protocol;

import java.net.DatagramPacket;
import java.util.UUID;

public class HeartBeatPacket extends Packet {
    public HeartBeatPacket(){}

    public HeartBeatPacket(UUID deviceId){
        super(PacketType.HEARTBEAT, deviceId);
    }
}
