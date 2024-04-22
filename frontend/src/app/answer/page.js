"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchUserMedia } from "@/utils/utils";

const userName = "user123";
const accessKey = "test123";
const socket = io.connect("https://192.168.8.148:3000", {
  auth: {
    userName,
    accessKey,
  },
});

const Call = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [didIOffer, setDidIOffer] = useState(false);
  const [rtcAnswer, setRtcAnswer] = useState(false);
  const [offerObject, setOfferObject] = useState(false);
  const [answerIce, setAnswerIce] = useState(false);
  const [addedIce, setAddedIce] = useState(false);
  const [iceArray, setIceArray] = useState([]);
  const [message, setMessage] = useState(false);

  socket.on("answerResponse", async (offerObj) => {
    if (offerObj?.answer?.type === "answer" && peerConnection) {
      if (!rtcAnswer) {
        setRtcAnswer(offerObj.answer);
        setOfferObject(offerObj);
      }
    }
  });
  // socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
  //   if (!answerIce) {
  //     console.log("set answer ICE, opt 1");
  //     setAnswerIce(iceCandidate);
  //   }
  // });

  useEffect(() => {
    if (socket.connected) {
      // console.log(socket.id);
      try {
        (async () => {
          const localVideoEl = document.querySelector("#local-video");

          await fetchUserMedia(localVideoEl, setLocalStream, null, "local");
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

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
        const remoteVideoEl = document.querySelector("#remote-video");
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
          socket.emit("sendIceCandidateToSignalingServer", {
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
          socket.emit("newOffer", { offer, id: socket.id }); //send offer to signalingServer
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
        setInterval(
          () => {
            if (!answerIce && !addedIce) {
              socket.emit("addedCallerIce", {
                fromId: socket.id,
                toId: offerObject.answerId,
              });
            }
            return;
          },
          10000,
          addedIce,
          answerIce
        );
      }
    }
  }, [offerObject, addedIce, answerIce]);

  socket.on("receivedCallerIce", (data) => {
    // console.log("ice was received");

    if (!answerIce) {
      // console.log("set answer ICE, opt 2");
      setAnswerIce(data.myIce);
    }
  });

  socket.on("incomingMessage", (data) => {
    console.log(data.message, "incomingMessage");
  });

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <video
            className="video-player"
            id="local-video"
            autoPlay
            playsInline
            controls
            style={{ width: "50%", marginRight: "20px" }}
          ></video>
          Call
        </div>
        <div>
          <video
            className="video-player"
            id="remote-video"
            autoPlay
            playsInline
            controls
            style={{ width: "50%", marginRight: "20px" }}
          ></video>
          Join
        </div>
      </div>
      <div>
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message || ""}
          style={{
            background: "grey",
            height: "10vh",
            width: "50vw",
          }}
        ></input>
      </div>
      <div>
        <button
          onClick={() => {
            if (offerObject) {
              socket.emit("newMessage", {
                from: socket.id,
                to: offerObject.answerId,
                message,
              });
            }
          }}
        >
          Send Message
        </button>
      </div>
    </>
  );
};
export default Call;
