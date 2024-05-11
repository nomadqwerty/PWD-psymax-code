import { encryptOnLoginB } from './AuthUtils';

onmessage = async (message) => {
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
};
