package com.amasp.service;

import com.amasp.AgentContext;
import com.amasp.protocol.Packet;
import com.amasp.protocol.PacketSerializer;
import com.amasp.util.Constants;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.util.Arrays;

public class UdpListener implements Runnable{
    private DatagramSocket listenerSocket;
    private AgentContext context;

    public UdpListener(AgentContext context){
        this.context = context;

        try{
            listenerSocket = new DatagramSocket();
            listenerSocket.setBroadcast(true);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    private void handleDiscoveryResponse(DatagramPacket packet, Packet pkt){
        context.setSeverAddress(packet.getAddress());
        context.setServerFound(true);
        System.out.println("Server found @ "+packet.getAddress()+":"+packet.getPort());
    }

    private void handleAck(DatagramPacket packet, Packet pkt){

    }

    private void processPacket(DatagramPacket packet){
        Packet incomingPacket = null;
        byte[] rawBytes = Arrays.copyOf(packet.getData(), packet.getLength());

        try{
            incomingPacket = PacketSerializer.deserialize(rawBytes, Packet.class);
        }catch (Exception err){
            err.printStackTrace();
        }

        if(incomingPacket == null || incomingPacket.getDeviceId() == context.getMyDeviceId()){
            return;
        }

        switch (incomingPacket.getPacketType()){
            case DISCOVERY_RESPONSE ->
                handleDiscoveryResponse(packet, incomingPacket);

            case ACK ->
                handleAck(packet, incomingPacket);
            default -> throw new IllegalArgumentException("Unexpected value: " + incomingPacket.getPacketType());
        }
    }

    @Override
    public void run() {
        DatagramPacket packet;
        byte[] buffer = new byte[Constants.BUFFER_SIZE];

        while (!Thread.currentThread().isInterrupted()) {
            packet = new DatagramPacket(buffer, buffer.length);
            try {
                listenerSocket.receive(packet); // listen for incomming packets from other devices
                processPacket(packet);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
