package com.amasp.service;

import com.amasp.AgentContext;
import com.amasp.protocol.HeartBeatPacket;
import com.amasp.util.Constants;

public class HeartbeatSender implements Runnable{
    private AgentContext context;
    private long interval;

    // all args constructor
    public HeartbeatSender(AgentContext context) {
        this.context = context;
        this.interval = 60000L / Constants.HEARTBEAT_BPM;
    }

    private void sendBeat() {
        // craft a heartbeat packet and broadcast it to all devices on LAN
        if(!context.isServerFound()){
            return;
        }
        HeartBeatPacket heartbeatPkt = new HeartBeatPacket(context.getMyDeviceId());
        context.sendUDPPacket(heartbeatPkt, context.getSeverAddress());
        context.print("HeartBeatSender: Heartbeat Packet Sent to Server @ " + context.getSeverAddress()+":"+Constants.UDP_PORT);
    }

    private void startBeats() {
        while (!Thread.currentThread().isInterrupted()) {
            // send a heartbeat
            sendBeat();
            try {
                Thread.sleep(interval); // wait for some time
            } catch (InterruptedException ex) {
                context.print("HeartbeatSender: Error in startBeats()");
                Thread.currentThread().interrupt();
                break;
            }

        }
    }

    @Override
    public void run() {
        context.print("HeartBeatSender: Thread Started!");
        startBeats();
    }
}
