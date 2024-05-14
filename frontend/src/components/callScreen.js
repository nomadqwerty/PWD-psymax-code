"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchDisplayMedia } from "@/utils/utils";

const socket = io.connect("http://localhost:3005");
const userName = "user123";
const accessKey = "test123";

const CallScreen = ({ socket, socketIds }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [offers, setOffers] = useState(null);
  const [didIOffer, setDidIOffer] = useState(false);
  const [callerIce, setCallerIce] = useState(false);
  const [addedIce, setAddedIce] = useState(false);
  const [myIce, setMyIce] = useState(false);
  const [message, setMessage] = useState(false);
  const [messages, setMessages] = useState({});
  const [shareScreen, setShareScreen] = useState(false);
  const [display, setDisplay] = useState("none");
  useEffect(() => {
    if (socket.connected === true) {
      if (shareScreen) {
        try {
          (async () => {
            const localVideoEl = document.querySelector("#local-videoScreen");

            await fetchDisplayMedia(
              localVideoEl,
              setLocalStream,
              null,
              "local"
            );
            console.log(socketIds);
            socket.emit("sharingScreenTo", socketIds);
            setDisplay("block");
            setShareScreen(false);
          })();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [shareScreen]);

  useEffect(() => {
    if (localStream) {
      let peerConfiguration = {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
            ],
          },
        ],
      };
      localStream.getVideoTracks()[0].onended = function () {
        console.log("stopped sharing");
        socket.emit("stopSharingScreenTo", socketIds);
        setDisplay("none");
        // doWhatYouNeedToDo();
      };
      (async () => {
        let peerConnection = await new RTCPeerConnection(peerConfiguration);
        setPeerConnection(peerConnection);
        const remoteVideoEl = document.querySelector("#remote-videoScreen");
        const remoteStream = new MediaStream();
        setRemoteStream(remoteStream);
        remoteVideoEl.srcObject = remoteStream;
      })();
    }
  }, [localStream]);

  useEffect(() => {
    if (peerConnection) {
      localStream.getTracks().forEach((track) => {
        //add localtracks so that they can be sent once the connection is established

        peerConnection.addTrack(track, localStream);
      });

      peerConnection.onsignalingstatechange = (event) => {
        // console.log(event);
        // console.log(peerConnection.signalingState);
        console.log("signal changed");
      };

      peerConnection.onicecandidate = (e) => {
        console.log("........Ice candidate found!......");
        // console.log(e);
        if (e.candidate) {
          console.log(didIOffer);
          socket.emit("sendIceCandidateToSignalingServerScreen", {
            iceCandidate: e.candidate,
            iceUserName: userName,
            didIOffer,
            iceAccessKey: accessKey,
            socketIds,
          });
          setMyIce(e.candidate);
        }
      };

      peerConnection.ontrack = (e) => {
        console.log("Got a track from the other peer!! How excting");
        // console.log(e);
        e.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track, remoteStream);
          console.log("Here's an exciting moment... fingers cross");
        });
      };
    }
  }, [peerConnection]);

  useEffect(() => {
    (async () => {
      try {
        if (offers?.length > 0) {
          await peerConnection.setRemoteDescription(offers[0].offer);
          const answer = await peerConnection.createAnswer({}); //just to
          await peerConnection.setLocalDescription(answer);
          offers[0].answer = answer;
          console.log("set answer SDP");
          const offerIceCandidates = await socket.emitWithAck(
            "newAnswerScreen",
            {
              offer: offers[0],
              answerId: socket.id,
              answererAccessKey: accessKey,
            }
          );

          offerIceCandidates.forEach((c) => {
            peerConnection.addIceCandidate(c);
            console.log("======Added Ice Candidate======");
          });
          // console.log(offerIceCandidates);
          // console.log(offers);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [offers]);

  useEffect(() => {
    if (!addedIce && peerConnection && callerIce) {
      peerConnection.addIceCandidate(callerIce);
      console.log("added ice candidate");

      setAddedIce(true);
    }
  }, [callerIce]);

  useEffect(() => {
    console.log(messages, "msgs");
  }, [messages]);

  socket.on("newOfferAwaitingScreen", (offers) => {
    console.log("listening...");
    if (offers?.length > 0) {
      setOffers(offers);
    }
  });

  socket.on("receivedIceCandidateFromServerScreen", (iceCandidate) => {
    if (!callerIce) {
      console.log("set answer ICE.");
      setCallerIce(iceCandidate);
    }
  });
  socket.on("hasCallerIceScreen", (data) => {
    if (myIce) {
      data.myIce = myIce;
      console.log(data);

      socket.emit("addedCallerIceScreen", data);
    }
  });

  socket.on("incomingMessage", (data) => {
    console.log(data.message, "incomingMessage");
    setMessages({
      ...messages,
      [data.stamp]: { message: data.message, path: "to" },
    });
  });
  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <video
            className="video-player"
            id="local-videoScreen"
            autoPlay
            playsInline
            controls
            style={{ width: "50%", marginRight: "20px", display: display }}
          ></video>
          <button
            onClick={() => {
              if (!shareScreen) {
                setShareScreen(true);
              } else {
                setShareScreen(true);
              }
            }}
          >
            share
          </button>
        </div>
        <div>
          <video
            className="video-player"
            id="remote-videoScreen"
            autoPlay
            playsInline
            controls
            style={{ width: "50%", marginRight: "20px", display: "none" }}
          ></video>
          Join
        </div>
      </div>
    </>
  );
};
export default CallScreen;
