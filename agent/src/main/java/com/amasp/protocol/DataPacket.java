package com.amasp.protocol;

import java.util.UUID;

public class DataPacket extends Packet{
    private byte[] data;

    public DataPacket(){}

    public DataPacket(UUID deviceId, byte[] data) {
        super(PacketType.FILE_DATA, deviceId);
        this.data = data;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}
