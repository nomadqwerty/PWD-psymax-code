import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({
  maxSize,
  acceptExtensions,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [error, setError] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptExtensions,
    maxSize: maxSize * 1024 * 1024,
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

        setUploadedFiles([...uploadedFiles, ...validFiles]);
        setError(false);
      } else {
        setError(true);
      }
    },
  });

  return (
    <>
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
    </>
  );
};

export default FileUpload;
