onmessage = async (message) => {
  try {
    if (message?.data?.type === 'encryptOnConnectionLoss') {
      let {
        fileVaultLength,
        clientVaultLength,
        serverVaultLength,
        updateFileVaultLength,
        updateClientVaultLength,
        userData,
      } = JSON.parse(message.data.data);
      console.log(
        fileVaultLength,
        clientVaultLength,
        serverVaultLength,
        updateFileVaultLength,
        updateClientVaultLength,
        userData
      );
    }
  } catch (error) {
    // console.log(error.message);
  }
};
