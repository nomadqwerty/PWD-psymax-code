import { deriveAllKeys, encryptData } from '../../utils/utilityFn';

const encryptOnConnectionLoss = async (dataObject, window) => {
  const {
    fileVaultLength,
    clientVaultLength,
    serverVaultLength,
    updateFileVaultLength,
    updateClientVaultLength,
    userData,
  } = dataObject;

  if (
    fileVaultLength > 0 &&
    clientVaultLength > 0 &&
    serverVaultLength > 0 &&
    updateFileVaultLength > 0 &&
    updateClientVaultLength > 0 &&
    userData
  ) {
    const operations = window.crypto.subtle || window.crypto.webkitSubtle;
    let pass = userData.password;
    let ePass = userData.emergencyPassword;
    let dualKeySalt = serverVault.dualKeySalt;
    let masterKeySalt = serverVault.masterKeySalt;

    let allKeys = await deriveAllKeys(
      pass,
      ePass,
      dualKeySalt,
      masterKeySalt,
      window
    );

    let keysLength = Object.keys(allKeys).length;

    if (keysLength > 0) {
      const { masterKey, iv } = allKeys;

      const fileUpdateEnc = await encryptData(
        operations,
        masterKey,
        iv,
        updateFileVault.data
      );
      let fileUpdateUint = new Uint8Array(fileUpdateEnc);

      const clientUpdateEnc = await encryptData(
        operations,
        masterKey,
        iv,
        updateClientVault.data
      );
      let clientUpdateUint = new Uint8Array(clientUpdateEnc);

      // Return fileUpdateUint, clientUpdateUint.

      // TODO: reposition bg task.

      // if (fileUpdateUint && clientUpdateUint) {
      //   let readySw = await window.navigator.serviceWorker.ready;
      //   if (readySw) {
      //     let updateVaultData = {
      //       userId: userData._id,
      //       files: Array.from(fileUpdateUint),
      //       clients: Array.from(clientUpdateUint),
      //     };

      //     if (indexDB) {
      //       let storeName = 'updateVault';
      //       let db = createStore(indexDB, storeName, 'bgSync-store');

      //       if (db) {
      //         await addToIdb(
      //           storeName,
      //           'updateVault',
      //           updateVaultData,
      //           'bgSync',
      //           db
      //         );

      //         readySw.sync.register('updateVaultRequest');
      //         toast.success('Directories queued for update');
      //         // console.log('set bg task');
      //       }
      //     }
      //   }
      // }
    }
  }
};
