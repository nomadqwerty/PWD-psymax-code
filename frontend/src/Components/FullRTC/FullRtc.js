"use client";
// import styles from "./FullRtc.module.scss";
import "./fullrtc.css";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { Row, Col } from "react-bootstrap";
// import Link from "next/link";

const FullRtc = () => {
  const router = useRouter();

  const [stream, setStream] = useState(null); //video stream
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteScreenStream, setRemoteScreenStream] = useState(null);


  const [offerCreated, setOfferCreated] = useState(false); //set offer state
  const [socketID, setSocketID] = useState(""); //set offer state

  const [roomAccessKey, setRoomAccessKey] = useState(null);
  const [remoteClientName, setremoteClientName] = useState(null);

  //VIDEO APP STATE CONTROLS

  //add video quality
  let constraints = {
    video: {
      noiseSuppression: true,
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 640, ideal: 1920, max: 1920 },
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  };

  let screenRecordConstraints = {
    video: {
      cursor: "always",
      displaySurface: "application" | "browser" | "monitor" | "window",
    },
  };
  //check for media devices
  const [isCameraOn, setIsCameraOn] = useState(null); //camera

  const [isMicOn, setIsMicOn] = useState(null); //audio

  const [screenStream, setScreenStream] = useState(null); // State to store screen stream
  const [isScreenSharing, setIsScreenSharing] = useState(false); // State to track screen sharing status

  // let sharedScreenStream;

  const searchParams = useSearchParams();
  const accessKey = searchParams.get("accessKey");
  const localClientName = searchParams.get("clientName");

  //useeffect to redirect user to lobby if no accesskey is found
  useEffect(() => {
    if (accessKey) {
      setRoomAccessKey(accessKey);
    } else {
      router.push("/lobby");
      // window.location = 'lobby'
    }
  }, [router, accessKey]);

  let peerConnection;
  let socketRef = useRef(null);

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  // const appName = "psymax";
  // socket = io("http://localhost:3050");

  //run on page mount

  //handler for when a user joins the server
  const handleUserJoined = async (data) => {
    const { room, userSocketID, remoteName } = data;
    if (socketRef.current && !offerCreated && room === roomAccessKey) {
      socketRef.current.emit("localClientName", localClientName); //emit current local client name when a new socket joins

      console.log(
        "user",
        remoteName,
        "with socketID",
        data.userSocketID,
        "joined room",
        room
      );
      console.log(room);

      // setSocketID(data.userSocketID);
      if (!offerCreated && room === roomAccessKey) {
        createOffer(userSocketID); //run create offer function
        setOfferCreated(true);
        handleRemoteName(remoteName);
      }
      try {
        document.getElementById("user2_div").style.display = "block"; //set user2 element display to none when the user/disconnects leaves
      } catch (e) {
        console.log("could not set block", e);
      }
    }
  };

  const handleIncomingMsg = async (data) => {
    try {
      const message = JSON.parse(await data.text);
      const userID = await data.userID;

      if (message.type == "offer") {
        await createAnswer(userID, message.offer);
      } else if (message.type == "answer") {
        await addAnswer(message.answer);
      } else if (message.type == "candidate") {
        if (peerConnection) {
          await peerConnection.addIceCandidate(message.candidate);
        }
      }

      console.log("Incoming msg from:" + userID, message);
    } catch (e) {
      console.log("could not parse incomng msg:", e);
    }

    //     const { senderId, offer } = data;
    // console.log(`Received offer from ${senderId}:`, offer);
  };

  //user leaves server handler
  const handleUserLeft = async (data) => {
    try {
      document.getElementById("user2").style.display = "none"; //set user2 element display to none when the user/disconnects leaves

      document.getElementById("user1_div").classList.remove("smallFrame"); //set localuser//user1 element display to full view
    } catch (e) {
      console.log("could not set none", e);
    }

    //     const { senderId, offer } = data;
    // console.log(`Received offer from ${senderId}:`, offer);
  };

  //handler for when a socket connects to server
  const handleSocketConnected = async () => {
    socketRef.current.emit("roomAccessKey", {
      roomToJoin: roomAccessKey,
      clientName: localClientName,
    });
    console.log("your socket ID is:", socketRef.current.id); //emit accesskey and local client name once connected

    socketRef.current.emit("localClientName", localClientName); //emit local name on connection
  };

  //handler for when a remoteName event is emitted
  const handleRemoteName = async (data) => {
    const { remoteName } = await data;
    remoteName ? setremoteClientName(remoteName) : null;
  };

  //get local stream
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        if (roomAccessKey) {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          // .then((stream) => {
          // const videoTracks = stream.getVideoTracks();
          // console.log(videoTracks);
          setStream(stream);
          const localVideoEl = document.getElementById("user1");
          localVideoEl.srcObject = stream;
          // localStream.current.srcObject = stream;
        }
      } catch {
        (error) => console.log("Error accessing media devices: ", error);
      }
    };

    getLocalStream();
    // })
  }, [roomAccessKey]);

  //check status of media devices and update control icons accordingly
  useEffect(() => {
    // Function to check camera state and set initial state
    const checkCameraState = async () => {
      if (stream) {
        let videoTrack = stream
          .getTracks()
          .find((track) => track.kind === "video");
        setIsCameraOn(videoTrack.enabled);
      }
    };

    const checkMicState = async () => {
      if (stream) {
        let audioTrack = stream
          .getTracks()
          .find((track) => track.kind === "audio");
        if (audioTrack) {
          setIsMicOn(audioTrack.enabled);
        }
      }
    };

    // Call the function when component mounts
    checkCameraState();
    checkMicState();
  }, [stream]);

  //create socket connection & initialise events if !socketconn && stream
  useEffect(() => {
    if (!socketRef.current && stream) {
      socketRef.current = io("http://localhost:3050"); //create socket instance if noRef and video stream avail

      // socket.emit("hello", "hello from offer UE");
      socketRef.current.on("connect", handleSocketConnected);

      //listen for a new user join event
      socketRef.current.on("newUserJoined", handleUserJoined);

      socketRef.current.on("incomingMsg", handleIncomingMsg);

      socketRef.current.on("userDisconnected", handleUserLeft);

      socketRef.current.on("remoteName", handleRemoteName);

      let leaveChannel = async () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current.off("newUserJoined", handleUserJoined);
          socketRef.current.off("incomingMsg", handleIncomingMsg);
          socketRef.current.off("userDisconnected", handleUserLeft);
          socketRef.current.off("connect", handleSocketConnected);
          socketRef.current.off("remoteName", handleRemoteName);

          socketRef.current = null;
        }
      };
      window.addEventListener("beforeunload", leaveChannel);

      return () => {
        leaveChannel();
      };
    }
  }, [stream]);

  let createPeerConnection = async (userID) => {
    peerConnection = new RTCPeerConnection(servers); //passed ice servers into connection
    const remoteStream = new MediaStream();
    setRemoteStream(remoteStream);
    const remoteVideoEl = document.getElementById("user2"); //get user2 element and assign to remoteVideoEl
    remoteVideoEl.srcObject = remoteStream; //set remote elemt srcobject to remotestream
    remoteVideoEl.style.display = "block";

    // const remoteScreenStream = new MediaStream();
    // setRemoteScreenStream(remoteScreenStream);
    // const remoteScreenEl = document.getElementById("screenShare"); //get user2 element and assign to remoteVideoEl
    // remoteScreenEl.srcObject = remoteStream; //set remote elemt srcobject to remotestream
    // remoteScreenEl.style.display = "block";

    document.getElementById("user1_div").classList.add("smallFrame");

    if (!stream) {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const localVideoEl = document.getElementById("user1");
      localVideoEl.srcObject = stream;
    }

    // check for local tracks and add to the peer connection if exist
    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    }

    // if (!screenStream) {
    //      const stream = await navigator.mediaDevices.getDisplayMedia(
    //       screenRecordConstraints
    //     ); 
    //   stream.getTracks().forEach((track) => {
    //     peerConnection.addTrack(track, stream);
    //   });
    // }

    //add remote peer tracks on remote track added
    peerConnection.ontrack = (event) => {
      console.log("a track has been found! adding to peerconnection ");
      console.log(event.streams);
      event.streams[0].getTracks().forEach((track) => {

        if (track.kind ==='video'){

          remoteStream.addTrack(track, remoteStream);
        }

        else if (track.kind === 'screen') {
          const screenShareEl = document.getElementById("screenshare");
          if (screenShareEl) {
            screenShareEl.srcObject = new MediaStream([track]);
            screenShareEl.style.display = 'block';
          }
          // For screen share tracks, add them to screen share element
          // remoteStream.addTrack(track, remoteStream);
        }
      });

      // event.streams[1].getTracks().forEach((track) => {
      //   remoteScreenStream.addTrack(track, remoteScreenStream);
      // });
    };

    //check for ICE candidate
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        // if(socket){

        // if (socketRef.current)
        // socketRef.current.emit("candidate", "hi candidiate")

        socketRef.current.emit("sendMessage", {
          text: JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
          }),
          userID,
          roomAccessKey,
        });
        console.log("ice sent");
      }
    };
  };

  //create sdp offer function
  let createOffer = async (userID) => {
    await createPeerConnection(userID);
    //create offer
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log(offer);
    // send message of reciving user && SDP offer to server on createOffer()
    if (socketRef.current)
      socketRef.current.emit("sendMessage", {
        text: JSON.stringify({ type: "offer", offer: offer }),
        userID,
        roomAccessKey,
      });
  };

  //create answer to offer from recieivng peer // newly joined peer
  let createAnswer = async (userID, offer) => {
    await createPeerConnection(userID);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (socketRef.current)
      socketRef.current.emit("sendMessage", {
        text: JSON.stringify({ type: "answer", answer: answer }),
        userID,
        roomAccessKey,
      });
  };

  //peer1 add asnwer after offer has been sent & returned
  let addAnswer = async (answer) => {
    if (
      !peerConnection.remoteDescription &&
      peerConnection.remoteDescription === null
    ) {
      await peerConnection.setRemoteDescription(answer);
    }
  };

  // user camera toggler
  let toggleCamera = async () => {
    let videoTrack = stream.getTracks().find((track) => track.kind === "video");

    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      setIsCameraOn(false); // Toggle the state
    } else {
      videoTrack.enabled = true;
      setIsCameraOn(true);
    }
  };

  //user mic toggler
  let toggleMic = async () => {
    let audioTrack = stream.getTracks().find((track) => track.kind === "audio");

    if (audioTrack && audioTrack.enabled) {
      audioTrack.enabled = false;
      setIsMicOn(false); // Toggle the state
    } else {
      audioTrack.enabled = true;
      setIsMicOn(true);
    }
  };

   // somebody clicked on "Stop sharing"
 
  // Function to start screen sharing
  const toggleScreenSharing = async () => {
    let screenShareEl;
    if (!isScreenSharing) {
      setIsScreenSharing(true);
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          screenRecordConstraints
        ); 
        if (!stream){
          setIsScreenSharing(false)
        }

        setScreenStream(stream);
        setRemoteStream(stream);
         screenShareEl = document.getElementById("screenShare");

        if (screenShareEl && stream) {
          screenShareEl.style.display='block';
          screenShareEl.srcObject = stream;
        }

          // Send screen stream to remote peer
          if (peerConnection && stream) {
            localStream.getTracks().forEach(track => {
              peerConnection.addTrack(track, localStream);
            });

            stream.getTracks().forEach(track => {
              peerConnection.addTrack(track, stream);
            });
          }
        console.log("screenStream added to elememt ")
      } catch (error) {
        console.error("Error starting screen sharing:", error);
      }
    } 
    
    else  {
      try {
        screenShareEl = document.getElementById("screenShare");

        screenShareEl.style.display='none';
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
        setIsScreenSharing(false);
      } catch (error) {
        console.error("Error ending screen sharing:", error);
      }
    }
  };
 //listen for end of stream from outside screen toggle button 
  screenStream?screenStream.getVideoTracks()[0].onended = function () {
    setIsScreenSharing(false);
    // doWhatYouNeedToDo();
  }:null;

  // let displayFrame = document.getElementById


  return (
    <main className="containerr m-0 p-0">
      <Row id="room_container" className="p-0 m-0">

        <Col xs={12} id="members_container" className="p-0 m-0">
        <Row id="videos" className="p-0 m-0">
          
          {typeof window !== "undefined" && (
            <Col className="p-0 m-0" id="user1_div">
              {/* <h1 className="clientName">{localClientName}</h1> */}
              <video
                className="videoPlayer"
                id="user1"
                autoPlay
                playsInline
              ></video>
            </Col>
          )}

          {typeof window !== "undefined" &&  (
            // <Col  className="p-0" id="user2_div">
              <video
                className="videoPlayer p-0"
                id="user2"
                autoPlay
                playsInline
              ></video>
            // </Col>
          )}
        </Row>
        </Col>

        <Col xs={12} id="stream-container p-0 m-0">

          <div id="stream_box">

          </div>
        
          {isScreenSharing && (
            // <div id="screenShareContainer smallerFrame">
              <video
                id="screenShare"
                className="videoPlayer smallerFrame"
                autoPlay
                playsInline
                // srcobject={screenStream}
              ></video>
            // </div>
          )}
        </Col>

        <Col xs={12} className="footer-container">
          <Row className="footer p-3">
            <Col className="logo_div logo">
              <img className="logo_icon" src="/icons/logo.svg" alt="logo" />
            </Col>

            <Col id="controls" className="">
              <div className="control-container" id="mic-btn">
                <img
                  className="icon"
                  src={isMicOn ? "/icons/mic-on.svg" : "/icons/mic-off.svg"}
                  alt="mic button"
                  onClick={toggleMic}
                />
              </div>

              <div className="control-container" id="camera-btn">
                <img
                  id="cameraBtn"
                  className="icon"
                  src={
                    isCameraOn
                      ? "/icons/camera-on.svg"
                      : "/icons/camera-off.svg"
                  }
                  alt="camera button"
                  onClick={toggleCamera}
                />
              </div>

              {/* <div className="control-container" id="pres-btn">
                <img
                  className="icon"
                  src={
                    isScreenSharing
                      ? "/icons/pres-on.svg"
                      : "/icons/pres-off.svg"
                  }
                  alt="presentation button"
                  onClick={toggleScreenSharing}
                />
              </div> */}

              <div className="control-container" id="settings-btn">
                <img
                  className="icon"
                  src="/icons/settings.svg"
                  alt="settings button"
                />
              </div>

              <a href="/lobby">
                <div className="control-container" id="leave-call-btn">
                  <img
                    className="icon"
                    src="/icons/leave-call.svg"
                    alt="leave call button"
                  />
                </div>
              </a>
            </Col>

            <Col className="chat_div control-container" id="chat-btn">
              <img className="icon" src="/icons/chat.svg" alt="chat button" />
            </Col>
          </Row>
        </Col>

        <Col id="messages_container"></Col>
      </Row>
    </main>
  );
};
// };

export { FullRtc };
