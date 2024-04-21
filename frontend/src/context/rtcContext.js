import { createContext, useState } from "react";

const rtcContext = createContext();

const RtcProvider = ({ children }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [didIOffer, setDidIOffer] = useState(false);

  let state = {
    rtcState: {
      localStream,
      setLocalStream,
      remoteStream,
      setRemoteStream,
      peerConnection,
      setPeerConnection,
      didIOffer,
      setDidIOffer,
    },
  };

  return <rtcContext.Provider value={state}>{children}</rtcContext.Provider>;
};

export { RtcProvider };

export default rtcContext;
