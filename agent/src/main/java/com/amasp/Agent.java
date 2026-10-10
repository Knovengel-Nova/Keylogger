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
        AgentContext agentContext =  new AgentContext();

        DiscoveryPacket pkt = new DiscoveryPacket(deviceUUID);
        agentContext.sendUDPPacket(pkt, NetworkUtil.getBroadcastAddress());

        UdpListener udpListener = new UdpListener(agentContext);
        new Thread(udpListener).start();

        HeartbeatSender heartbeatSender = new HeartbeatSender(agentContext);
        new Thread(heartbeatSender).start();

        TcpSender tcpSender = new TcpSender();
        new Thread(tcpSender).start();

        System.out.println("Agent started");
    }
}