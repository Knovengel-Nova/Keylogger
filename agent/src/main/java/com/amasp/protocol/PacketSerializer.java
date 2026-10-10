package com.amasp.protocol;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public final class PacketSerializer {

    private static final ObjectMapper mapper = new ObjectMapper();

    private PacketSerializer() {
    }

    public static byte[] serialize(Object packet) throws Exception {
        return mapper.writeValueAsBytes(packet);
    }

    public static <T> T deserialize(byte[] data, Class<T> clazz) throws Exception {
        return mapper.readValue(data, clazz);
    }

    public static PacketType getPacketType(byte[] data) {
        JsonNode root = null;
        try {
            root = mapper.readTree(data);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return PacketType.valueOf(root.get("packetType").asText());
    }
}
