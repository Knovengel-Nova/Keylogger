package com.amasp;

import com.amasp.protocol.Packet;
import com.amasp.protocol.PacketSerializer;
import com.amasp.util.Constants;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.UUID;

public class AgentContext {
    private UUID myDeviceId;
    private InetAddress severAddress;
    private InetAddress broadcastAddress;
    private DatagramSocket udpSenderSocket = null;

    private  boolean isServerFound = false;

    public void print(String message) {
        System.out.println(message);
    }

    public void sendUDPPacket(Packet packet, InetAddress severAddress) {
        try {
            byte[] data = PacketSerializer.serialize(packet);
            DatagramPacket pkt = new DatagramPacket(data, data.length, severAddress, Constants.UDP_PORT);
            udpSenderSocket.send(pkt);
        } catch (Exception e) {
            print("LanSHAContext: Error in sendUDPPacket");
            e.printStackTrace();
        }
    }

    public UUID getMyDeviceId() {
        return myDeviceId;
    }

    public void setMyDeviceId(UUID myDeviceId) {
        this.myDeviceId = myDeviceId;
    }

    public InetAddress getSeverAddress() {
        return severAddress;
    }

    public void setSeverAddress(InetAddress severAddress) {
        this.severAddress = severAddress;
    }

    public InetAddress getBroadcastAddress() {
        return broadcastAddress;
    }

    public void setBroadcastAddress(InetAddress broadcastAddress) {
        this.broadcastAddress = broadcastAddress;
    }

    public boolean isServerFound() {
        return isServerFound;
    }

    public void setServerFound(boolean serverFound) {
        isServerFound = serverFound;
    }
}
