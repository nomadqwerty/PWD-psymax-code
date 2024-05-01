'use client';

import { useParams } from 'next/navigation';
import axiosInstance from '../../../utils/axios';
import { useEffect, useState } from 'react';
import {
  deriveAllKeys,
  decryptData,
  decryptFile,
  downloadFile,
} from '@/utils/utilityFn';

const ClientFileDownLoad = () => {
  const params = useParams();
  const userId = params.fileInformation[0];
  const fileName = params.fileInformation[1];
  const [stage, setStage] = useState('file download page');

  useEffect(() => {
    (async () => {
      setStage('retrieving file details...');
      const response = await axiosInstance.post(`/file/download`, {
        userId: userId,
        name: fileName,
      });
      if (response.status === 200) {
        setStage('preparing file for decryption...');
        const operations = window.crypto.subtle || window.crypto.webkitSubtle;

        const { password, ePassword, serverVault, fileData, vault } =
          response.data;

        const { dualKeySalt, masterKeySalt } = serverVault;
        let allKeys = await deriveAllKeys(
          password,
          ePassword,
          dualKeySalt,
          masterKeySalt,
          window
        );
        let keysLength = Object.keys(allKeys).length;

        if (keysLength > 0) {
          const { masterKey, iv } = allKeys;

          let data = new Uint8Array(fileData.data).buffer;
          const fileVault = new Uint8Array(vault.passwords.data);

          let dataDec = await decryptData(operations, masterKey, iv, fileVault);

          const fileKeys = dataDec.data.forEach(async (e) => {
            if (e.fileName.includes(fileName)) {
              const { fileKey, fileName } = e;
              setStage('decrypting file...');
              let allKeys = await deriveAllKeys(
                fileKey,
                ePassword,
                dualKeySalt,
                masterKeySalt,
                window
              );
              // console.log(allKeys);

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
                downloadFile(decFile, fileName);
                setStage('file download successful...');
              }
            }
          });
        }
      }
    })();
  }, []);

  return <>{stage}</>;
};

export default ClientFileDownLoad;
