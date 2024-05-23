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

  //check for media devices
  const [isCameraOn, setIsCameraOn] = useState(null); //camera

  const [isMicOn, setIsMicOn] = useState(null); //audio

  const [screenStream, setScreenStream] = useState(null); // State to store screen stream
  const [isScreenSharing, setIsScreenSharing] = useState(false); // State to track screen sharing status
  const [screenSharingId, setScreenSharingId] = useState(""); // State to track screen sharing status

  const [isSettingsVisible, setIsSettingsVisible] = useState(false); // State to track settings page status


  


  const [isChatVisible, setIsChatVisible] = useState(false); // State to track chat view status

  const [messages, setMessages] = useState([]); //track messages

  //get time stamp
  const localVideoRef = useRef(null); // Ref for local video element
  const remoteVideoRef = useRef(null); // Ref for remote video element
  const screenShareRef = useRef(null); // Ref for screen share video element
  // let sharedScreenStream;

  const searchParams = useSearchParams();
  const accessKey = searchParams.get("accessKey");
  const localClientName = searchParams.get("clientName");

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
      setSocketID(socketRef.current.id)
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

  const handleChatMsg = async (data) => {
    const { msg, serverOffset, clientName } = await data;
    console.log(serverOffset, clientName, msg);
    //  let msgWrapper = document.getElementById("messages");

    // Create a new message object
    const newMessage = {
      id: serverOffset, // Assuming serverOffset can be used as a unique identifier
      clientName,
      message: msg,
      time: getTime(),
    };

    try{
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    catch (e){
      console.log("messages not sent", e);
    }
    // Update messages state with the new message

    window.scrollTo(0, document.body.scrollHeight);
    // socketRef.current.auth.serverOffset = serverOffset;
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
          localVideoRef.current.srcObject = stream;
          // const localVideoEl = document.getElementById("user1");
          // localVideoEl.srcObject = stream;
          // localStream.current.srcObject = stream;
        }
      } catch (error)  {
       console.log("Error accessing media devices: ", error);
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

      socketRef.current.on("chat message", handleChatMsg);

      let leaveChannel = async () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current.off("newUserJoined", handleUserJoined);
          socketRef.current.off("incomingMsg", handleIncomingMsg);
          socketRef.current.off("userDisconnected", handleUserLeft);
          socketRef.current.off("connect", handleSocketConnected);
          socketRef.current.off("remoteName", handleRemoteName);
          socketRef.current.off("chat message", handleChatMsg);

          socketRef.current = null;
        }
      };
      window.addEventListener("beforeunload", leaveChannel);

      return () => {
        leaveChannel();
      };
    }
  }, [stream]);

  // useEffect(() => {
  //   if (socketRef.current){
  //     socketRef.current.on("chat message", handleChatMsg);
  //   }

  //   let leaveChannel = async () => {
  //     if (socketRef.current) {
  //       socketRef.current.off("chat message", handleChatMsg);

  //       socketRef.current = null;
  //     }
  //   };
  //   window.addEventListener("beforeunload", leaveChannel);

  //   return () => {
  //     leaveChannel();
  //   };

  // }, [messages]);


  let createPeerConnection = async (userID) => {
    peerConnection = new RTCPeerConnection(servers); //passed ice servers into connection
    const remoteStream = new MediaStream();
    remoteVideoRef.current.srcObject = remoteStream; //set remote elemt srcobject to remotestream
    setRemoteStream(remoteVideoRef.current.srcObject);
   remoteVideoRef.current.style.display = "block";
   
    document.getElementById("user1_div").classList.add("smallFrame");

    if (!stream) {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      localVideoRef.current.srcObject = stream;
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
      console.log(event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        if (track.kind === "video") {
          remoteStream.addTrack(track, remoteStream);
        } 
        
        else if (track.kind === "screen") {
          const screenShareEl = document.getElementById("screenshare");
          
          if (screenShareEl) {
            screenShareEl.srcObject = new MediaStream([track]);
            screenShareEl.style.display = "block";
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

  // let returnVideo = () =>{
  //   return(<video
  //     className="videoPlayer p-0"
  //     id="user2"
  //     ref={remoteVideoRef}
  //     autoPlay
  //     playsInline
  //   ></video>)
  // }
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
  
  let getTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const setMembersContainer = ()=>{
    
  }

  let toggleChat = async () => {
    // if(!isChatVisible){
    //   setIsSettingsVisible(false);
    //   settingsEl.style.width = "0%";
    //   settingsEl.style.display = "none";
    //   membersVideoContainer.style.width = "100%";
    // }

    const messagesContainer = document.getElementById("messages_container");
    const membersVideoContainer = document.getElementById("members_container");
    const input = document.getElementById("msgInput");

    if (!isChatVisible) {
      try {
        membersVideoContainer.style.width = "75%";

        // Add event listener for transitionend event
        membersVideoContainer.addEventListener(
          "transitionend",
          () => {
            // Render the chat component contents after width adjustment is completed
            messagesContainer.style.width = "25%";
            messagesContainer.style.display = "block";
            input.focus();
            setIsChatVisible(true);
          },
          { once: true }
        ); // Ensure the event listener is removed after firing once
      } catch (e){
        console.log("could not set chat visible", e);
      }
    } else {
      try {
        setIsChatVisible(false);
        messagesContainer.style.width = "0%";
        messagesContainer.style.display = "none";
        membersVideoContainer.style.width = "100%";
      } catch {
        console.log("could not set chat not-visible");
      }
    }
  };
  const Message = ({ message, localClientName }) => {
  return (
    <li key={message.id} className={`msgItem mb-1 ${message.clientName === localClientName ? "right" : "left"}`}>
      <p className={`m-0 mb-1 clientNameDate ${message.clientName === localClientName ? "right" : "left"}`}>
        <span className="clientName"> {message.clientName} </span>
        <span className="chatTimeStamp">{message.time} </span>
      </p>
      <p className={`msg m-0 ${message.clientName === localClientName ? "right" : "left"}`}>
        {message.message}
      </p>
    </li>
  );
};
  //chat listener

  useEffect(()=>{
// if (typeof Window !== "undefined") {
    let counter = 0;
    const form = document.getElementById("form");
    const input = document.getElementById("msgInput");
    // const messages = document.getElementById("messages");

    if (form){
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (input.value) {
          // compute a unique offset
          if (socketRef.current) {
            const clientOffset = `${socketRef.current.id}-${counter++}`;
            socketRef.current.emit("chat message", {
              msg: input.value,
              clientOffset: clientOffset,
              roomAccessKey: accessKey,
              clientName: localClientName,
            });
            input.value = "";
          }
        }
      });
    }
  // }
  },[])

  // let toggleSettings = async () =>{
  //   const messagesContainer = document.getElementById("messages_container");
  //   const membersVideoContainer = document.getElementById("members_container");
  //   if (isChatVisible && !isSettingsVisible){
  //       setIsChatVisible(false);
  //       messagesContainer.style.width = "0%";
  //       messagesContainer.style.display = "none";
  //       membersVideoContainer.style.width = "100%";
  //   }

  //   // const settingsEl = document.getElementById("settings_container");
  //   // const membersVideoContainer = document.getElementById("members_container");
  //   membersVideoContainer.style.width = "75%";

  //   // isChatVisible?setIsChatVisible(false):null;

  //   if(!isSettingsVisible && !isChatVisible){
  //     // settingsEl.style.display = 'block';
  //     try {
  //       membersVideoContainer.style.width = "75%";

  //       // Add event listener for transitionend event
  //       membersVideoContainer.addEventListener(
  //         "transitionend",
  //         () => {
  //           // Render the chat component contents after width adjustment is completed
  //           settingsEl.style.width = "25%";
  //           settingsEl.style.display = "block";
  //           setIsSettingsVisible(true);
  //         },
  //         { once: true }
  //       ); // Ensure the event listener is removed after firing once
  //     } catch {
  //       console.log("could not set setings visible");
  //     }
  //   } else {
  //     try {
  //       setIsSettingsVisible(false);
  //       settingsEl.style.width = "0%";
  //       settingsEl.style.display = "none";
  //       membersVideoContainer.style.width = "100%";
  //     } catch {
  //       console.log("could not set settings not-visible");
  //     }
  //   }
  // }

  //switch cureent stream 
//  const switchStream =  (mediaStream) =>{
//       setStream(mediaStream);
//       setScreenSharingId(socketRef?.current.id || "")
//     };

  // Function to start screen sharing
  let toggleScreenSharing = async () => {
    if (!isScreenSharing && !screenSharingId) {
      // Check for screensharing true and existing screenshareID
      // If no IDs exist, get new stream for the screen stream
      setIsScreenSharing(true);
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(screenRecordConstraints);
        
        setStream(stream);
        setScreenStream(stream);
        localVideoRef.current.srcObject = stream;
        setScreenSharingId(socketID);
        console.log("current share screen user", localClientName, socketID);
        setIsScreenSharing(true);
      } catch (e) {
        console.error("Could not switch stream to screenshare", e);
      }
    } else {
      // Check for screensharing true and existing screenshareID
      // If IDs exist, get new stream for video and audio camera
      setIsScreenSharing(false);
  
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      setScreenSharingId("");
  
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints); // Get video and audio devices from user
        setStream(stream); // Switch stream to obtained media stream
        localVideoRef.current.srcObject = stream;
      } catch (e) {
        console.error("Could not turn on user screen & switch stream", e);
      }
    }
  
    if (socketID?.peerConnection) {
      Object.values(socketID.peerConnection).forEach((peer) => {
        const videoTrack = stream?.getTracks().find(track => track.kind === 'video');
        if (videoTrack) {
          peer.getSenders()[1].replaceTrack(videoTrack).catch((e) => {
            console.error(e);
          });
        }
      });
    }
  };
  
    //listen for end of stream from outside screen toggle button

    screenStream ? (screenStream.getVideoTracks()[0].onended = function () {
      setIsScreenSharing(false);
      toggleScreenSharing();
     // doWhatYouNeedToDo();
   })
 : null;
  // let displayFrame = document.getElementById

  // const reInitializeStream = (video, audio, type='userMedia') => {
  //   const media = type === 'userMedia' 
  //     ? getVideoAudioStream(video, audio) 
  //     : navigator.mediaDevices.getDisplayMedia({ video: true });

  //   return new Promise((resolve, reject) => {
  //     media.then((stream) => {
  //       if (type === 'displayMedia') {
  //         toggleVideoTrack({ audio, video });
  //       }
  //       createVideo({ id: myID, stream });
  //       replaceStream(stream);
  //       resolve(true);
  //     }).catch((error) => {
  //       console.error("Error in reInitializeStream: ", error);
  //       reject(error);
  //     });
  //   });
  // };

  // const toggleVideoTrack = (status) => {
  //   const myVideo = getMyVideo();
  //   if (myVideo && !status.video) {
  //     myVideo.srcObject?.getVideoTracks().forEach((track) => {
  //       if (track.kind === 'video') {
  //         track.stop();
  //       }
  //     });
  //   } else if (myVideo) {
  //     reInitializeStream(status.video, status.audio);
  //   }
  // };

  // const replaceStream = (mediaStream) => {
  //   Object.values(peers).forEach((peer) => {
  //     peer.peerConnection?.getSenders().forEach((sender) => {
  //       if (sender.track.kind === "audio" && mediaStream.getAudioTracks().length > 0) {
  //         sender.replaceTrack(mediaStream.getAudioTracks()[0]);
  //       }
  //       if (sender.track.kind === "video" && mediaStream.getVideoTracks().length > 0) {
  //         sender.replaceTrack(mediaStream.getVideoTracks()[0]);
  //       }
  //     });
  //   });
  // };

  return (
    <main className="containerr m-0 p-0">
      <Row id="room_container" className="p-0 m-0">
        <Col xs={12} id="members_container" className="p-0 m-0">
          <Row id="videos" className="p-0 m-0">
            {typeof window !== "undefined" && (
              <Col className="p-0 m-0" id="user1_div">
                {/* <h1 className="clientName">{localClientName}</h1> */}
                <video
                  className="videoPlayer p-0"
                  id="user1"
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted="muted"
                ></video>
              </Col>
            )}

            {typeof window !== "undefined" && (

              <video
                className="videoPlayer p-0"
                id="user2"
                ref={remoteVideoRef}
                autoPlay
                playsInline
              ></video>

            )}
          </Row>
        </Col>

        <Col xs={12} id="stream-container p-0 m-0">
          <div id="stream_box"></div>

          {/* {isScreenSharing && (
            // <div id="screenShareContainer smallerFrame">
            <video
              id="screenShare"
              ref={screenShareRef}
              className="videoPlayer smallerFrame"
              autoPlay
              playsInline
              // srcobject={screenStream}
            ></video>
            // </div>
          )} */}
        </Col>

        <Col xs={12} className="footer-container">
          <Row className="footer p-3">
            <Col title="Psymax Logo" className="logo_div logo">
              <img className="logo_icon" src="/icons/logo.svg" alt="logo" />
            </Col>

            <Col id="controls" className="">
              <div
               className="control-container"
                title="Mikrofon umschalten" 
                id="mic-btn"
                >
                <img
                  className="icon"
                  src={isMicOn ? "/icons/mic-on.svg" : "/icons/mic-off.svg"}
                  alt="Mikrofontaste"
                  onClick={toggleMic}
                />
              </div>

              <div className="control-container" id="camera-btn" title="Kamera umschalten">
                <img
                  id="cameraBtn"
                  className="icon"
                  src={
                    isCameraOn
                      ? "/icons/camera-on.svg"
                      : "/icons/camera-off.svg"
                  }
                  alt="Kamerataste"
                  onClick={toggleCamera}
                />
              </div>

              <div 
              className="control-container" 
              id="pres-btn" 
              title="Bildschirm teilen">
                <img
                  className="icon"
                  src={
                    isScreenSharing
                      ? "/icons/pres-on.svg"
                      : "/icons/pres-off.svg"
                  }
                  alt="Bildschirm teilen"
                  onClick={toggleScreenSharing}
                />
              </div>

              <div 
              className="control-container" 
              id="settings-btn"
              title="Einstellungen"
              >
                <img
                  className="icon"
                  src="/icons/settings.svg"
                  alt="settings button"
                  // onClick={toggleSettings}
                />
              </div>

              <a 
              href="/lobby"
              title="Anruf beenden"
              >
                <div className="control-container" id="leave-call-btn">
                  <img
                    className="icon"
                    src="/icons/leave-call.svg"
                    alt="leave call button"
                  />
                </div>
              </a>
            </Col>

            <Col
             className="chat_div control-container" 
             id="chat-btn"
             title="Plaudern"
             >
              <img
                className="icon"
                src="/icons/chat.svg"
                alt="Plaudern"
                onClick={toggleChat}
              />
            </Col>
          </Row>
        </Col>

        <Col id="messages_container" className="p-0">
          <div className="">
            <h2 className="p-3 chat-title mb-0">Chat</h2>
            <ul id="messages" className="p-3">
             {messages.map((message) => (
    <Message key={message.id} message={message} localClientName={localClientName} />
  ))}
            </ul>

            <form id="form" action="" className="">
              <Row id="sendMsgRow" className="p-0 m-0">
                <Col xs={11} className="p-0">
                  <input
                    placeholder="Nachricht absenden"
                    title="message area"
                    id="msgInput"
                    className="border-0 p-2"
                  />
                </Col>

                <Col xs={1} className="p-0">
                  <button
                    type="submit"
                    id="sendMsgBtn"
                    title="send message button"
                    className="sendMsgBtn btn"
                  >
                    <img src="/icons/send-chat-msg.svg"></img>
                  </button>
                </Col>
              </Row>
            </form>
          </div>
         {/* <p>hello settings oage</p> */}

        </Col>

        <Col id="settings_container">
         <p>hello settings oage</p>
        </Col>
      </Row>
    </main>
  );
};
// };

export { FullRtc };
