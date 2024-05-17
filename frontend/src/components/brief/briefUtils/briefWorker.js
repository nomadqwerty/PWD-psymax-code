import { decryptClient, encryptBriefFile } from './briefUtils';

onmessage = async (message) => {
  if (message?.data?.type === 'decryptClient') {
    let { responseData, pass, ePass, dualKeySalt, masterKeySalt } = JSON.parse(
      message.data.data
    );

    let setEmpfaenger;
    // console.log(responseData, pass, ePass, dualKeySalt, masterKeySalt);

    await decryptClient(
      responseData,
      pass,
      ePass,
      dualKeySalt,
      masterKeySalt,
      setEmpfaenger,
      self
    );
  }
  if (message?.data?.type === 'encryptClientBrief') {
    let { responseData, serverVault, userData, fileVault, storeFile } =
      JSON.parse(message.data.data);

    let setStoreFile;
    let setUpdateFileVault;
    let setFileVault;

    // console.log(responseData, serverVault, userData, fileVault, storeFile);
    await encryptBriefFile(
      responseData,
      serverVault,
      userData,
      setStoreFile,
      fileVault,
      setUpdateFileVault,
      setFileVault,
      storeFile,
      self
    );
  }
};
