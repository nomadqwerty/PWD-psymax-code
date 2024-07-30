import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({
  maxSize,
  acceptExtensions,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [error, setError] = useState(false);
  let [mediaChunks, setMediaChunks] = useState([]);
  let [recorder, setRecorder] = useState(null);
  let [stream, setStream] = useState(null);
  let [action, setAction] = useState('start');
  let chunksStream = [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptExtensions,
    maxSize: process.env.NEXT_PUBLIC_MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      const isValidFile =
        acceptedFiles.length > 0 &&
        acceptedFiles.every((file) =>
          acceptExtensions.some((extension) =>
            file.type.startsWith(`${extension}`)
          )
        );
      if (isValidFile) {
        const validFiles = acceptedFiles.filter((file) =>
          acceptExtensions.some((extension) =>
            file.type.startsWith(`${extension}`)
          )
        );

        console.log(validFiles);

        setUploadedFiles([...uploadedFiles, ...validFiles]);
        setError(false);
      } else {
        setError(true);
      }
    },
  });

  const onVoiceRecord = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        if (!recorder) {
          let audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setRecorder(new MediaRecorder(audioStream));
          setStream(audioStream);
        } else {
          recorder.stop();
          setAction('start');
        }
      }
    } catch (error) {}
  };
  const onRemoveRecord = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        const playBack = document.querySelector('#audioTracks');
        playBack.src = null;
        setRecorder(null);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (recorder) {
      recorder.ondataavailable = (e) => {
        chunksStream.push(e.data);
      };

      recorder.onstop = (e) => {
        setMediaChunks(chunksStream);
        chunksStream = [];
      };
      recorder.start();
      setAction('stop');
    }
  }, [recorder]);
  useEffect(() => {
    if (mediaChunks.length > 0) {
      const playBack = document.querySelector('#audioTracks');
      const blob = new Blob(mediaChunks, { type: 'audio/ogg; codecs=opus' });
      setMediaChunks([]);
      console.log(blob);

      const audioUrl = window.URL.createObjectURL(blob);
      const newFile = new File([blob], 'recordingAttachment');
      setUploadedFiles([...uploadedFiles, newFile]);
      playBack.src = audioUrl;
    }
  }, [mediaChunks]);

  return (
    <div style={{ width: '50vw' }}>
      <div
        {...getRootProps()}
        className={`fileUpload ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <p className="interFonts text-[#2B86FC] text-base">
          Datei hineinziehen <br />
          oder{' '}
          <span style={{ textDecoration: 'underline' }}>Datei auswählen</span>
        </p>
      </div>
      {error && (
        <p className="text-red-500">
          Nur PDF-Dateien mit einer Größe von bis zu 1.5 MB sind erlaubt.
        </p>
      )}

      <div
        className="voiceRecordWrap"
        style={{ display: 'flex', paddingTop: '10px', paddingBottom: '10px' }}
      >
        <button
          className="voiceRecordBtn"
          id="mic"
          style={{
            background: '#eee9e9',
            marginRight: '15px',
            marginLeft: '5px',
            border: '1px solid red',
            borderRadius: '25%',
            width: '50px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.preventDefault();
            onVoiceRecord();
          }}
        >
          <span>{action}</span>
        </button>
        <button
          className="voiceRecordBtn"
          id="delete"
          onClick={(e) => {
            e.preventDefault();
            onRemoveRecord();
          }}
          style={{
            background: '#eee9e9',
            marginRight: '15px',
            marginLeft: '5px',
            border: '1px solid red',
            borderRadius: '25%',
            width: '50px',
            cursor: 'pointer',
          }}
        >
          <span>delete</span>
        </button>
        <audio controls id="audioTracks"></audio>
      </div>
    </div>
  );
};

export default FileUpload;
