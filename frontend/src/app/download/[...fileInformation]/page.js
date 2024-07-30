'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '../../../utils/axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  deriveAllKeys,
  decryptData,
  decryptFile,
  downloadFile,
} from '../../../utils/utilityFn';

const ClientFileDownLoad = () => {
  const params = useParams();
  const userId = params.fileInformation[0];
  const fileName = params.fileInformation[1];
  const [stage, setStage] = useState('file download page');

  useEffect(() => {
    (async () => {
      setStage('retrieving file details...');
      toast('Dateidetails abrufen...');
      const response = await axiosInstance.post(`/file/download`, {
        userId: userId,
        name: fileName,
        reqType: 'fileDownload',
      });
      if (response.status === 200) {
        setStage('preparing file for decryption...');
        const operations = window.crypto.subtle || window.crypto.webkitSubtle;

        const {
          password,
          ePassword,
          serverVault,
          fileData,
          vault,
          updateVault,
        } = response.data;

        const { dualKeySalt, masterKeySalt } = serverVault;
        let allKeys = await deriveAllKeys(
          password,
          ePassword,
          dualKeySalt,
          masterKeySalt,
          window
        );
        let keysLength = Object.keys(allKeys).length;

        if (keysLength > 0 && fileData) {
          const { masterKey, iv } = allKeys;

          let data = new Uint8Array(fileData.data).buffer;
          const fileVault = new Uint8Array(vault.passwords.data);
          const fileVaultUpdate = new Uint8Array(updateVault.passwords.data);
          let dataDec = await decryptData(operations, masterKey, iv, fileVault);
          if (dataDec.length <= 0) {
            dataDec = await decryptData(
              operations,
              masterKey,
              iv,
              fileVaultUpdate
            );
            toast('Speicher auf Datei prüfen');
          }
          if (dataDec.length > 0) {
            dataDec.forEach(async (e) => {
              if (e.fileName.includes(fileName)) {
                const { fileKey, fileName } = e;
                setStage('decrypting file...');
                toast('Datei entschlüsseln...');
                let allKeys = await deriveAllKeys(
                  fileKey,
                  ePassword,
                  dualKeySalt,
                  masterKeySalt,
                  window
                );
                // console.log(allKeys);
                // brief_1716322693878

                let keysLength = Object.keys(allKeys).length;

                if (keysLength > 0) {
                  const { masterKey, iv } = allKeys;

                  const decFile = await decryptFile(
                    operations,
                    data,
                    masterKey,
                    iv
                  );
                  setStage('downloading file...');
                  toast.success('Datei wird heruntergeladen...');
                  downloadFile(decFile, fileName);
                  setStage('file download successful...');
                  toast.success('Dateidownload erfolgreich...');
                }
              }
            });
          } else {
            toast.error('Datei nicht gefunden');
          }
        }
      }
    })();
  }, []);

  return <>{stage}</>;
};

export default ClientFileDownLoad;
