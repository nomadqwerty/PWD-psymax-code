import {
  encryptOnLoginB,
  encryptOnLoginA,
  fetchData_encryptOnLogout,
  restoreEncryption,
} from './AuthUtils';

onmessage = async (message) => {
  try {
    if (message?.data?.type === 'encryptOnLogout') {
      let {
        clientVault,
        fileVault,
        serverVault,
        updateFileVault,
        updateClientVault,
        storeFile,
        userData,
        psymaxToken,
      } = JSON.parse(message.data.data);

      await fetchData_encryptOnLogout(
        fileVault,
        clientVault,
        serverVault,
        updateFileVault,
        updateClientVault,
        storeFile,
        self,
        userData,
        psymaxToken
      );
    }
    if (message?.data?.type === 'encryptOnLoginA') {
      let { clientVault, fileVault, response, userData, psymaxToken } =
        JSON.parse(message.data.data);

      let results = await encryptOnLoginA(
        clientVault,
        fileVault,
        response,
        userData,
        self,
        psymaxToken
      );

      // console.log(results);
    }
    if (message?.data?.type === 'encryptOnLoginB') {
      let { clientVault, fileVault, response, userData, psymaxToken } =
        JSON.parse(message.data.data);
      // console.log(self);
      let results = await encryptOnLoginB(
        clientVault,
        fileVault,
        response,
        userData,
        self,
        psymaxToken
      );

      // console.log(results);
    }

    if (message?.data?.type === 'restoreAccountEncryption') {
      let { data, id, psymaxToken } = JSON.parse(message.data.data);

      await restoreEncryption(data, id, psymaxToken, self);
      // console.log(self);

      // console.log(results);
    }
  } catch (error) {
    // console.log(error.message);
  }
};
