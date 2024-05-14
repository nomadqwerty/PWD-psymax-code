"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchDisplayMedia, fetchUserMedia } from "@/utils/utils";

const userName = "user123";
const accessKey = "test123";

const AnswerScreen = ({ socket, socketIds }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [didIOffer, setDidIOffer] = useState(false);
  const [rtcAnswer, setRtcAnswer] = useState(false);
  const [offerObject, setOfferObject] = useState(false);
  const [answerIce, setAnswerIce] = useState(false);
  const [addedIce, setAddedIce] = useState(false);
  const [iceArray, setIceArray] = useState([]);
  const [display, setDisplay] = useState("none");
  const [shareScreen, setShareScreen] = useState(false);
  const [messages, setMessages] = useState({});

  socket.on("answerResponseScreen", async (offerObj) => {
    if (offerObj?.answer?.type === "answer" && peerConnection) {
      if (!rtcAnswer) {
        setRtcAnswer(offerObj.answer);
        setOfferObject(offerObj);
      }
    }
  });
  // socket.on("receivedIceCandidateFromServerScreen", (iceCandidate) => {
  //   if (!answerIce) {
  //     console.log("set answer ICE, opt 1");
  //     setAnswerIce(iceCandidate);
  //   }
  // });

  useEffect(() => {
    console.log(socket.connected);
    if (socket.connected === true) {
      if (shareScreen) {
        try {
          console.log(socket);
          (async () => {
            const localVideoEl = document.querySelector("#local-videoScreen");

            await fetchUserMedia(localVideoEl, setLocalStream, null, "local");
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
        console.log("signal change");
      };

      peerConnection.onicecandidate = (e) => {
        console.log("........Ice candidate found!......");
        if (e.candidate) {
          socket.emit("sendIceCandidateToSignalingServerScreen", {
            iceCandidate: e.candidate,
            iceUserName: userName,
            didIOffer,
            iceAccessKey: accessKey,
          });
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

      (async () => {
        try {
          console.log("Creating offer...");
          const offer = await peerConnection.createOffer();

          peerConnection.setLocalDescription(offer);
          setDidIOffer(true);
          console.log(socketIds);
          socket.emit("newOfferScreen", {
            offer,
            id: socket.id,
            toId: socketIds.fromId,
          }); //send offer to signalingServer
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [peerConnection]);

  useEffect(() => {
    if (rtcAnswer) {
      (async () => {
        if (
          !peerConnection.remoteDescription &&
          peerConnection.remoteDescription === null
        ) {
          // console.log(rtcAnswer);
          console.log("set remote description");
          await peerConnection.setRemoteDescription(rtcAnswer);
        }
      })();
    }
  }, [rtcAnswer]);

  useEffect(() => {
    if (answerIce && peerConnection && iceArray.length <= 1) {
      setIceArray([...iceArray, answerIce]);

      if (iceArray.length === 1) {
        peerConnection.addIceCandidate(iceArray[0]);
        console.log("added ice candidate");
        console.log(iceArray);
      }
      setAddedIce(true);
    }
  }, [answerIce]);

  useEffect(() => {
    if (offerObject) {
      // console.log(addedIce);
      if (!addedIce) {
        const interval = setInterval(
          () => {
            if (!answerIce && !addedIce) {
              socket.emit("addedCallerIceScreen", {
                fromId: socket.id,
                toId: offerObject.answerId,
              });
              clearInterval(interval);
            }
            return;
          },
          1000,
          addedIce,
          answerIce
        );
      }
    }
  }, [offerObject, addedIce, answerIce]);
  useEffect(() => {
    console.log(messages, "msgs");
  }, [messages]);

  socket.on("receivedCallerIceScreen", (data) => {
    // console.log("ice was received");

    if (!answerIce) {
      // console.log("set answer ICE, opt 2");
      setAnswerIce(data.myIce);
    }
  });
  console.log("here");
  socket.on("incomingScreen", (data) => {
    if (!shareScreen) {
      console.log("i can see that");
      setDisplay("block");
      setShareScreen(true);
    }
  });
  socket.on("closingScreen", (data) => {
    console.log("i can see that");
    setDisplay("none");
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
            style={{ width: "50%", marginRight: "20px", display: "none" }}
          ></video>
        </div>
        <div>
          <video
            className="video-player"
            id="remote-videoScreen"
            autoPlay
            playsInline
            controls
            style={{ width: "50%", marginRight: "20px", display: display }}
          ></video>
          Join
        </div>
      </div>
    </>
  );
};
export default AnswerScreen;
