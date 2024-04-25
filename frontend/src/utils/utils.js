// How clients will locate each other.
let peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

const fetchUserMedia = (videoEl, setLocalStream) => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoEl.srcObject = stream;
      setLocalStream(stream);
      resolve();
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

const createPeerConnection = (
  offerObj,
  setPeerConnection,
  setRemoteStream,
  localStream
) => {
  return new Promise(async (resolve, reject) => {
    //RTCPeerConnection is the thing that creates the connection
    //we can pass a config object, and that config object can contain stun servers
    //which will fetch us ICE candidates
    let peerConnection = await new RTCPeerConnection(peerConfiguration);
    let remoteStream = new MediaStream();
    remoteVideoEl.srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
      //add localtracks so that they can be sent once the connection is established
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener("signalingstatechange", (event) => {
      console.log(event);
      console.log(peerConnection.signalingState);
    });

    peerConnection.addEventListener("icecandidate", (e) => {
      console.log("........Ice candidate found!......");
      console.log(e);
      if (e.candidate) {
        socket.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUserName: userName,
          didIOffer,
        });
      }
    });

    peerConnection.addEventListener("track", (e) => {
      console.log("Got a track from the other peer!! How excting");
      console.log(e);
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track, remoteStream);
        console.log("Here's an exciting moment... fingers cross");
      });
    });

    setPeerConnection(peerConnection);
    setRemoteStream(remoteStream);

    if (offerObj) {
      //this won't be set when called from call();
      //will be set when we call from answerOffer()
      // console.log(peerConnection.signalingState) //should be stable because no setDesc has been run yet
      await peerConnection.setRemoteDescription(offerObj.offer);
      // console.log(peerConnection.signalingState) //should be have-remote-offer, because client2 has setRemoteDesc on the offer
    }
    resolve();
  });
};

const addNewIceCandidate = (iceCandidate) => {
  peerConnection.addIceCandidate(iceCandidate);
  console.log("======Added Ice Candidate======");
};

export { peerConfiguration, fetchUserMedia };
