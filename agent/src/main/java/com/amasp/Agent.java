package com.amasp;

import com.amasp.protocol.DiscoveryPacket;
import com.amasp.service.HeartbeatSender;
import com.amasp.service.TcpSender;
import com.amasp.service.UdpListener;
import com.amasp.util.NetworkUtil;

import java.util.UUID;

public class Agent {
    public static void main(String[] args) {
        UUID deviceUUID = null;
        AgentContext context = new AgentContext();

        DiscoveryPacket discoveryPacket = new DiscoveryPacket(deviceUUID);
        context.sendUDPPacket(discoveryPacket, NetworkUtil.getBroadcastAddress());

        UdpListener listener = new UdpListener(context);
        new Thread(listener).start();

        HeartbeatSender heartbeatService = new HeartbeatSender(context);
        new Thread(heartbeatService).start();

        TcpSender tcpService = new TcpSender();
        new Thread(tcpService).start();

        System.out.println("Agent started");
    }
}