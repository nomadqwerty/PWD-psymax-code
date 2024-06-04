import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { Form } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import "./settings.css";

const Settings = ({ ...props }) => {
  const [devices, setDevices] = useState({ audio: [], video: [], output: [] });
  const [selectedAudio, setSelectedAudio] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedOutput, setSelectedOutput] = useState("");
  const [videoTestOutput, setVideoTestOutput] = useState("");
  const [micTestOutput, setMicTestOutput] = useState("");
  const [speakerTestOutput, setSpeakerTestOutput] = useState("");

  const currentStream = useRef(null);
  const videoTestRef = useRef(null); //video test ref

  let localUserVideoRef = useRef(null);
  //   let localVideoRef = useRef(null);

  const audioOutputElement = useRef(null); // Reference to an audio element

  // Fetch available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceInfos.filter(
          (device) => device.kind === "audioinput"
        );
        const videoDevices = deviceInfos.filter(
          (device) => device.kind === "videoinput"
        );
        const outputDevices = deviceInfos.filter(
          (device) => device.kind === "audiooutput"
        );

        setDevices({
          audio: audioDevices,
          video: videoDevices,
          output: outputDevices,
        });
        //  console.log(outputDevices)

        //set speaker on to true if audio outputdevices > 0
        if (outputDevices.length > 0){
            props.setIsSpeakerOn(true);
        }

      } catch (error) {
        console.error("Error fetching devices: ", error);
      }
    };
    getDevices();
  }, []);

  //useeffect to set settings video ref
  useEffect(() => {
    const getStream = async () => {
      if (localUserVideoRef.current && props.stream) {
        localUserVideoRef.current.srcObject = await props.stream;
      }
    };
    getStream();
    return () => {
      // if (props.stream) {
      //   props.stream.getTracks().forEach(track => track.stop());
      // }
    };
  }),[props.stream];

  //give result of test video if camera on
  const getVideoTestOutput = () => {
    props.setIsCameraTest(true);
    setVideoTestOutput(
      props.isCameraOn ? "Camera Aukey" : "Kamera ist ausgeschaltet"
    );
    return;
  };

  //update video test result if/when test result has already been initiated in settings
  useEffect(() => {
    if (props.isCameraTest)
      setVideoTestOutput(
        props.isCameraOn ? "Camera Aukey" : "Kamera ist ausgeschaltet"
      );
  }),
    [props.isCameraOn];
    
  //handle video updates from control
    useImperativeHandle(props.videoTestRef, () => ({
      getVideoTestOutput: () => {
        setVideoTestOutput(
          props.isCameraOn ? "Camera Aukey" : "Kamera ist ausgeschaltet"
        );
      },
    }));

    //function to test micstate and give output result
  const getMicTestOutput = () => {
    props.setIsMicTest(true);
    setMicTestOutput(
      props.isMicOn ? "Mikrofon Aukey" : "Mikrofon ist ausgeschaltet"
    );
    return;
  };
  //update auido test result if audio test has already been initiated in settings
  useEffect(() => {
    if (props.isMicTest)
      setMicTestOutput(
        props.isMicOn ? "Mikrofon Aukey" : "Mikrofon ist ausgeschaltet"
      );
  }),[props.isMicOn];

  //handle mic updates from control
  useImperativeHandle(props.micTestRef, () => ({
    getMicTestOutput: () => {
      setMicTestOutput(
        props.isMicOn ? "Mikrofon Aukey" : "Mikrofon ist ausgeschaltet"
      );
    },
  }));

    //function to test speaker avaialble and give output result
    const getSpeakerTestOutput = () => {
        props.setIsSpeakerTest(true);
        setSpeakerTestOutput(
          props.isSpeakerOn ? "Lautsprecher Aukey" : "Lautsprecher nicht verfügbar"
        );
        return;
      };

  // Handle audio device change
  const handleAudioChange = async (event) => {
    const newAudioDeviceId = event.target.value;
    setSelectedAudio(newAudioDeviceId);
    await updateStream(newAudioDeviceId, selectedVideo);
  };

  // Handle video device change
  const handleVideoChange = async (event) => {
    const newVideoDeviceId = event.target.value;
    setSelectedVideo(newVideoDeviceId);
    await updateStream(selectedAudio, newVideoDeviceId);
  };

  // Handle output device change
  const handleOutputChange = async (event) => {
    const newOutputDeviceId = event.target.value;
    setSelectedOutput(newOutputDeviceId);
    updateAudioOutput(newOutputDeviceId);
    await updateStream(selectedAudio, selectedVideo, newOutputDeviceId); // Update stream with the selected output device
  };

  // Update the media stream with the selected devices
  const updateStream = async (audioDeviceId, videoDeviceId, outputDeviceId) => {
    if (props.stream) {
      props.stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
          output: outputDeviceId ? { deviceId: outputDeviceId } : undefined, // Include the selected output device ID
        },
        video: {
          deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
        },
      });

      props.stream = newStream;
      props.onDeviceChange(newStream);
      //   Update the video element with the new stream
      if (localUserVideoRef.current) {
        localUserVideoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error("Error updating media stream: ", error);
    }
  };

  // Update the audio output device
  const updateAudioOutput = (deviceId) => {
    if (audioOutputElement.current && audioOutputElement.current.setSinkId) {
      audioOutputElement.current
        .setSinkId(deviceId)
        .then(() => {
          console.log(`Audio output device set to ${deviceId}`);
        })
        .catch((error) => {
          console.error("Error setting audio output device: ", error);
        });
    } else {
      console.warn(
        "Audio output device selection is not supported in this browser."
      );
    }
  };

  return (
    <Row id="settings-wrapper">
      <Col className="settings-topic mt-1 mb-3">
        <h1>Einstellungen</h1>
      </Col>

      <Col className="mb-4">
        <p className="test-topic">Test Ihrer Kamera</p>

        <video
          className="videoPlayer p-0 mb-2"
          id="settingsVideo"
          autoPlay
          playsInline
          muted
          ref={localUserVideoRef}
        ></video>
        <Row className="device-test-wrapper" xxs={1} xs={2}>
          <Col xs={3} className="p-0">
            <button
            //   id="test-device-button"
              type="button"
              title="Klicken Sie auf Start, um die Kamera zu testen"
              className="btn settings-start-button"
              onClick={getVideoTestOutput}
            >
              Start
            </button>
          </Col>

          <Col
            xs={9}
            className={`device-test-output-wrapper p-0 
          ${
            props.isCameraOn && props.isCameraTest
              ? "border-primary"
              : !props.isCameraOn && props.isCameraTest
              ? "border-danger"
              : "border-1"
          }`}
          >
            <input
              id="videoTestOutput"
              value={videoTestOutput}
              placeholder="Klicken Sie auf Start, um die Kamera zu testen"
              className="device-test-output p-1 border-0"
              readOnly
            />
          </Col>
        </Row>
      </Col>

      <Col className="mb-4">
      <Row className="device-test-wrapper" xxs={1} xs={2}>
          <Col xs={12} className="p-0">
            <p className="test-topic">Test Ihrer Lautsprecher</p>
          </Col>
          <Col xs={3} className="p-0">
            <button
            //   id="test-device-button"
              type="button"
              title="Klicken Sie auf Start, um den Lautsprecher zu testen"
              className="btn settings-start-button"
              onClick={getSpeakerTestOutput}
            >
              Start
            </button>
          </Col>

          <Col
            xs={9}
            className={`device-test-output-wrapper p-0 
          ${
            props.isSpeakerOn && props.isSpeakerTest
              ? "border-primary"
              : !props.isSpeakerOn && props.isSpeakerTest
              ? "border-danger"
              : "border-1"
          }`}
          >
            <input
              id="speakerTestOutput"
              value={speakerTestOutput}
              placeholder="Klicken Sie auf Start, um den Lautsprecher zu testen"
              className="device-test-output p-1 border-0"
              readOnly
            />
          </Col>
        </Row>
        {/* <label htmlFor="output">Select Audio Output Device:</label>
        <select
          id="output"
          value={selectedOutput}
          onChange={handleOutputChange}
        >
          {devices.output.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label || `Output Device ${index + 1}`}
            </option>
          ))}
        </select> */}
      </Col>

      <Col className="mb-5">
        <Row className="device-test-wrapper" xxs={1} xs={2}>
          <Col xs={12} className="p-0">
            <p className="test-topic">Test Ihrer Mikrofons</p>
          </Col>
          <Col xs={3} className="p-0">
            <button
            //   id="test-device-button"
            title="Klicken Sie auf Start, um das Mikrofon zu testen"
              type="button"
              className="btn settings-start-button"
              onClick={getMicTestOutput}
            >
              Start
            </button>
          </Col>

          <Col
            xs={9}
            className={`device-test-output-wrapper p-0 
          ${
            props.isMicOn && props.isMicTest
              ? "border-primary"
              : !props.isMicOn && props.isMicTest
              ? "border-danger"
              : "border-1"
          }`}
          >
            <input
              id="micTestOutput"
              value={micTestOutput}
              placeholder="Klicken Sie auf Start, um das Mikrofon zu testen"
              className="device-test-output p-1 border-0"
              readOnly
            />
          </Col>
        </Row>
        {/* <label htmlFor="audio">Select Audio Input Device:</label>
        <select id="audio" value={selectedAudio} onChange={handleAudioChange}>
          {devices.audio.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label || `Audio Device ${index + 1}`}
            </option>
          ))}
        </select> */}
      </Col>

      <Col>
      <Form>
        <div className="mb-3">
      <p className="test-topic">Weitere Optionen</p>
          <Form.Check // prettier-ignore
            type="checkbox"
            id="radio-check"
            className="text-muted"
            label="Hintergrund weichzeichnen"
          />
          </div>
          </Form>
      </Col>

      {/* <Col>
        <label htmlFor="video">Select Video Device:</label>
        <select id="video" value={selectedVideo} onChange={handleVideoChange}>
          {devices.video.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label || `Video Device ${index + 1}`}
            </option>
          ))}
        </select>
      </Col> */}

      <audio ref={audioOutputElement} style={{ display: "none" }} />
    </Row>
  );
};

export default Settings;
