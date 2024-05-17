import { encryptNewClient, decryptClient } from './clientUtils';

onmessage = async (message) => {
  if (message?.data?.type === 'encryptClient') {
    let {
      data,
      pass,
      userData,
      serverVault,
      updateClientVault,
      clientVault,
      psymaxToken,
      isEdit,
    } = JSON.parse(message.data.data);

    // console.log(data);

    let setUpdateClientVault;
    let setClientVault;

    await encryptNewClient(
      data,
      pass,
      userData,
      serverVault,
      setUpdateClientVault,
      updateClientVault,
      setClientVault,
      clientVault,
      self,
      psymaxToken,
      isEdit
    );
  }
  if (message?.data?.type === 'decryptClient') {
    let {
      clientVault,
      params,
      userData,
      serverVault,
      responseData,
      modifiedArzt,
    } = JSON.parse(message.data.data);

    let setDefaultValues;
    let setEditData;

    await decryptClient(
      clientVault,
      params,
      self,
      userData,
      serverVault,
      responseData,
      modifiedArzt,
      setDefaultValues,
      setEditData
    );
  }
};
