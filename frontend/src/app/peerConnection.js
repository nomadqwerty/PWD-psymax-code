"use client";

import { useEffect, useContext } from "react";
import rtcContext from "@/context/rtcContext";
import io from "socket.io-client";
const userName = "user123";
const accessKey = "test123";

const socket = io.connect("https://192.168.8.148:3000", {
  auth: {
    userName,
    accessKey,
  },
});
console.log(socket);
const PeerListener = ({ children }) => {
  const { rtcState } = useContext(rtcContext);
  const { peerConnection, didIOffer } = rtcState;
  console.log("peer lister is up.");
  useEffect(() => {
    if (peerConnection) {
      peerConnection.onsignalingstatechange = (event) => {
        console.log(event);
        console.log(peerConnection.signalingState);
      };

      peerConnection.onicecandidate = (e) => {
        console.log("........Ice candidate found!......");
        console.log(e);
        if (e.candidate) {
          socket.emit("sendIceCandidateToSignalingServer", {
            iceCandidate: e.candidate,
            iceUserName: userName,
            didIOffer,
          });
        }
      };

      peerConnection.ontrack = (e) => {
        console.log("Got a track from the other peer!! How excting");
        console.log(e);
        e.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track, remoteStream);
          console.log("Here's an exciting moment... fingers cross");
        });
      };
      console.log(peerConnection);
    }
  }, [peerConnection]);
  return <>{children}</>;
};

export default PeerListener;
