"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchUserMedia } from "@/utils/utils";

const socket = io.connect("https://192.168.0.148:3005");
const userName = "user123";
const accessKey = "test123";

const Messages = ({ messages }) => {
  const messageStamps = Object.keys(messages);

  const chat = messageStamps.map((msg, i) => {
    console.log(typeof msg);
    const time = msg;
    let alignment = messages[msg].path === "from" ? "right" : "left";
    return (
      <div key={i} style={{ textAlign: alignment }}>
        <p style={{ marginBottom: "10px" }}>
          {" "}
          {messages[msg].path}: {messages[msg].message}
        </p>
      </div>
    );
  });

  return (
    <div style={{ paddingRight: "120px", paddingLeft: "120px" }}>{chat}</div>
  );
};

const Answer = () => {
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

  useEffect(() => {
    if (socket.connected) {
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
        console.log("signal changed");
      };

      peerConnection.onicecandidate = (e) => {
        console.log("........Ice candidate found!......");
        // console.log(e);
        if (e.candidate) {
          socket.emit("sendIceCandidateToSignalingServer", {
            iceCandidate: e.candidate,
            iceUserName: userName,
            didIOffer,
            iceAccessKey: accessKey,
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
          const offerIceCandidates = await socket.emitWithAck("newAnswer", {
            offer: offers[0],
            answerId: socket.id,
            answererAccessKey: accessKey,
          });

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

  socket.on("newOfferAwaiting", (offers) => {
    console.log("listening...");
    if (offers?.length > 0) {
      setOffers(offers);
    }
  });

  socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
    if (!callerIce) {
      console.log("set answer ICE.");
      setCallerIce(iceCandidate);
    }
  });
  socket.on("hasCallerIce", (data) => {
    if (myIce) {
      data.myIce = myIce;
      console.log(data);

      socket.emit("addedCallerIce", data);
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
      <div style={{ display: "flex" }}>
        <div>
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
                console.log(offers);
                if (offers[0]) {
                  let msgObj = {
                    from: socket.id,
                    to: offers[0].callerId,
                    stamp: Date.now(),
                    message,
                  };
                  socket.emit("newMessage", msgObj);
                  setMessages({
                    ...messages,
                    [msgObj.stamp]: { message: msgObj.message, path: "from" },
                  });
                  setMessage("");
                }
              }}
            >
              Send Message
            </button>
          </div>
        </div>
        <div style={{ background: "grey", height: "auto", width: "50%" }}>
          <Messages messages={messages}></Messages>
        </div>
      </div>
    </>
  );
};
export default Answer;
