package com.amasp.protocol;

public enum PacketType {
    DISCOVERY,
    DISCOVERY_RESPONSE,

    FILE_DATA,
    ACK,

    HEARTBEAT,
    HEARTBEAT_RESPONSE,
    GOODBYE
}
