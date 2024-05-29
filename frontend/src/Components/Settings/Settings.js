import React, { useState, useEffect } from 'react';

const Settings = ({ ...props }) => {
  const [audioInputs, setAudioInputs] = useState([]);
  const [audioOutputs, setAudioOutputs] = useState([]);
  const [videoInputs, setVideoInputs] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [selectedVideoInput, setSelectedVideoInput] = useState('');

    //function to update new constraints (video&audio) settings
    const applySettings = async (audioDeviceId, videoDeviceId) => {
        constraints = {
         audio: {
           ...constraints.audio,
           deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
         },
         video: {
           ...constraints.video,
           deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
         },
       };
   
       try {
         const newStream = await navigator.mediaDevices.getUserMedia(constraints);
         if (!localVideoRef.current && !isScreenSharing) {
           localVideoRef.current.srcObject = newStream;
         }
         // setStream(newStream);
       } catch (error) {
         console.error('Error accessing media devices.', error);
       }
     };
       //
       useEffect(() => {
         // Get initial media stream with default devices
         applySettings();
       }, [selectedAudioInput,selectedVideoInput]);

       
  useEffect(() => {
    const updateDeviceList = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        setAudioInputs(audioInputs);
        setAudioOutputs(audioOutputs);
        setVideoInputs(videoInputs);
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };

    updateDeviceList();

    navigator.mediaDevices.ondevicechange = updateDeviceList;

    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
  }, []);

  const handleApplySettings = () => {
    applySettings(selectedAudioInput, selectedVideoInput);
  };

  return (
    <div>
      <h3>Settings</h3>
      <div>
        <label htmlFor="audioSource">Audio input source: </label>
        <select
          id="audioSource"
          value={selectedAudioInput}
          onChange={(e) => setSelectedAudioInput(e.target.value)}
        >
          {audioInputs.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${audioInputs.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="audioOutput">Audio output destination: </label>
        <select
          id="audioOutput"
          value={selectedAudioOutput}
          onChange={(e) => setSelectedAudioOutput(e.target.value)}
          disabled={!('sinkId' in HTMLMediaElement.prototype)}
        >
          {audioOutputs.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Speaker ${audioOutputs.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="videoSource">Video source: </label>
        <select
          id="videoSource"
          value={selectedVideoInput}
          onChange={(e) => setSelectedVideoInput(e.target.value)}
        >
          {videoInputs.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${videoInputs.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleApplySettings}>Apply Settings</button>
    </div>
  );
};

export default Settings;
