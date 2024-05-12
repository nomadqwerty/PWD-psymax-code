import {
  deriveAllKeys,
  encryptData,
  decryptData,
  vaultMerger,
} from '@/utils/utilityFn';
// import axiosInstance from '@/utils/axios';
import { axiosWrap } from '@/utils/axios';

let encryptOnLoginA = async (
  clientVault,
  fileVault,
  response,
  userData,
  self,
  psymaxToken,
  setFileVault = {},
  setClientVault = {},
  setServerVault = {},
  setUpdateFileVault = {},
  setUpdateClientVault = {}
) => {
  console.log('A');
  let vault = response.data.data;
  let pass = userData.password;
  let ePass = userData.emergencyPassword;
  let dualKeySalt = vault.dualKeySalt;
  let masterKeySalt = vault.masterKeySalt;
  const operations = self.crypto.subtle || self.crypto.webkitSubtle;
  const axiosInstance = axiosWrap(psymaxToken);

  if (ePass) {
    // TODO: Import function.
    let allKeys = await deriveAllKeys(
      pass,
      ePass,
      dualKeySalt,
      masterKeySalt,
      self
    );
    let keysLength = Object.keys(allKeys).length;
    if (keysLength > 0) {
      const {
        masterKey,
        iv,
        dualKeyOne,
        dualKeyTwo,
        dualMasterKey,
        backUpIv,
        recoveryKeyEnc,
      } = allKeys;

      const passwordUpdateDirectory = {
        data: [],
      };

      const passwordMainDirectory = {
        data: [],
      };

      const passwordArchiveDirectory = {
        data: [],
      };

      const passUpdateDirEnc = await encryptData(
        operations,
        masterKey,
        iv,
        passwordUpdateDirectory.data
      );

      const passMainDirEnc = await encryptData(
        operations,
        masterKey,
        iv,
        passwordMainDirectory.data
      );

      const passArchiveDirEnc = await encryptData(
        operations,
        masterKey,
        iv,
        passwordArchiveDirectory.data
      );

      const clientsUpdate = {
        data: [],
      };
      const clientsMain = {
        data: [],
      };
      const clientsArchive = {
        data: [],
      };

      const clientUpdateEnc = await encryptData(
        operations,
        masterKey,
        iv,
        clientsUpdate.data
      );

      const clientMainEnc = await encryptData(
        operations,
        masterKey,
        iv,
        clientsMain.data
      );

      const clientArchiveEnc = await encryptData(
        operations,
        masterKey,
        iv,
        clientsArchive.data
      );

      const passUpdateUintArr = new Uint8Array(passUpdateDirEnc);
      const passMainUintArr = new Uint8Array(passMainDirEnc);
      const passArchiveUintArr = new Uint8Array(passArchiveDirEnc);

      const clientsUpdateUintArr = new Uint8Array(clientUpdateEnc);
      const clientsMainUintArr = new Uint8Array(clientMainEnc);
      const clientsArchiveUintArr = new Uint8Array(clientArchiveEnc);

      let fileVaultArray = [];
      let clientVaultArray = [];

      fileVault.map((e) => {
        console.log(e);
        if (e.type === 'update') {
          e.passwords = Array.from(passUpdateUintArr);
        }
        if (e.type === 'main') {
          e.passwords = Array.from(passMainUintArr);
        }
        if (e.type === 'archive') {
          e.passwords = Array.from(passArchiveUintArr);
        }
        e.isEncrypted = true;
        fileVaultArray.push(e);
      });

      clientVault.map((e) => {
        console.log(e);
        if (e.type === 'update') {
          e.clients = Array.from(clientsUpdateUintArr);
        }
        if (e.type === 'main') {
          e.clients = Array.from(clientsMainUintArr);
        }
        if (e.type === 'archive') {
          e.clients = Array.from(clientsArchiveUintArr);
        }
        e.isEncrypted = true;
        clientVaultArray.push(e);
      });
      let recKeyEnc = Array.from(recoveryKeyEnc);
      recKeyEnc = { recovery: recKeyEnc };

      const masterKeyEnc = await encryptData(
        operations,
        dualMasterKey,
        backUpIv,
        recKeyEnc
      );

      let masterKeyEncUint = new Uint8Array(masterKeyEnc);

      // TODO: import axiosInstance
      console.log(fileVaultArray, clientVaultArray);
      const resVault = await axiosInstance.post(`/vault/user/update`, {
        fileVault: fileVaultArray,
        clientVault: clientVaultArray,
        recoveryKey: Array.from(masterKeyEncUint),
      });

      if (resVault.status === 200) {
        // sessionStorage.setItem('dualKeyOne', dualKeyOne);

        setServerVault = vault;
        setUpdateFileVault = {
          data: [],
          type: 'update',
        };
        setUpdateClientVault = {
          data: [],
          type: 'update',
        };
        setFileVault = {
          data: [],
          type: 'main',
        };
        setClientVault = {
          data: [],
          type: 'main',
        };

        self.postMessage(
          JSON.stringify({
            setFileVault,
            setClientVault,
            setServerVault,
            setUpdateClientVault,
            setUpdateFileVault,
            dualKeyOne,
          })
        );
      }
    }
  }
};

//////////////////////////////////////////

let encryptOnLoginB = async (
  clientVault,
  fileVault,
  response,
  userData,
  self,
  psymaxToken,
  setFileVault = {},
  setClientVault = {},
  setServerVault = {},
  setUpdateFileVault = {},
  setUpdateClientVault = {}
) => {
  console.log('B');
  let vault = response.data.data;
  let pass = userData.password;
  let ePass = userData.emergencyPassword;
  let dualKeySalt = vault.dualKeySalt;
  let masterKeySalt = vault.masterKeySalt;
  const operations = self.crypto.subtle || self.crypto.webkitSubtle;
  const axiosInstance = axiosWrap(psymaxToken);
  let isFile = false;
  let isClient = false;
  if (ePass) {
    // TODO: import FN
    let allKeys = await deriveAllKeys(
      pass,
      ePass,
      dualKeySalt,
      masterKeySalt,
      self
    );
    let keysLength = Object.keys(allKeys).length;
    if (keysLength > 0) {
      const { masterKey, iv, dualKeyOne, dualKeyTwo, dualMasterKey, backUpIv } =
        allKeys;

      let fileUintArr = [];

      fileVault.forEach((e) => {
        if (e.type === 'update') {
          let fileUpdateVault = new Uint8Array(e.passwords.data);
          fileUintArr.push({
            data: fileUpdateVault,
            type: e.type,
          });
        }
        if (e.type === 'main') {
          let fileMainVault = new Uint8Array(e.passwords.data);
          fileUintArr.push({ data: fileMainVault, type: e.type });
        }
        if (e.type === 'archive') {
          let fileArchiveVault = new Uint8Array(e.passwords.data);
          fileUintArr.push({
            data: fileArchiveVault,
            type: e.type,
          });
        }
      });

      let clientUintArr = [];

      clientVault.forEach((e) => {
        if (e.type === 'update') {
          let clientUpdateVault = new Uint8Array(e.clients.data);
          clientUintArr.push({
            data: clientUpdateVault,
            type: e.type,
          });
        }
        if (e.type === 'main') {
          let clientMainVault = new Uint8Array(e.clients.data);
          clientUintArr.push({
            data: clientMainVault,
            type: e.type,
          });
        }
        if (e.type === 'archive') {
          let clientArchiveVault = new Uint8Array(e.clients.data);
          clientUintArr.push({
            data: clientArchiveVault,
            type: e.type,
          });
        }
      });

      let encryptedVaults = [fileUintArr, clientUintArr];

      let recoveryKeyArr = userData.recoveryKey.data;

      recoveryKeyArr = new Uint8Array(recoveryKeyArr);

      // TODO: Import decrypt FN
      let recoveryKeyDec = await decryptData(
        operations,
        dualMasterKey,
        backUpIv,
        recoveryKeyArr
      );

      let backUpMaster = self.crypto.subtle.importKey(
        'raw',
        new Uint8Array(recoveryKeyDec.recovery),
        'AES-GCM',
        true,
        ['encrypt', 'decrypt']
      );

      backUpMaster = await backUpMaster;
      // file
      let decryptedFiles = [];
      let decryptedArchive = [];

      encryptedVaults[0].forEach(async (e) => {
        // console.log(e);

        let vault = {};
        let dataDec = await decryptData(operations, masterKey, iv, e.data);
        vault.data = dataDec;
        vault.type = e.type;

        if (e.type !== 'archive') {
          decryptedFiles.push(vault);
        } else {
          decryptedArchive.push(vault);
        }
        // console.log(vault, e);
        if (decryptedFiles.length == 2 && decryptedArchive.length == 1) {
          let updateVault =
            decryptedFiles[0].type !== 'update'
              ? decryptedFiles[1]
              : decryptedFiles[0];

          let mainVault =
            decryptedFiles[1].type !== 'main'
              ? decryptedFiles[0]
              : decryptedFiles[1];

          let archiveVault = decryptedArchive[0];

          if (mainVault.data.length >= 250) {
            // TODO: import vaultMerger
            const newArchive = vaultMerger('file', archiveVault, mainVault);

            let newArchiveVault = {
              data: newArchive,
              type: 'archive',
            };

            let newMainVault = { data: [], type: 'main' };

            const encMainVault = await encryptData(
              operations,
              masterKey,
              iv,
              newMainVault.data
            );

            const encArchiveVault = await encryptData(
              operations,
              masterKey,
              iv,
              newArchiveVault.data
            );

            let mainUint = new Uint8Array(encMainVault);
            let archiveUint = new Uint8Array(encArchiveVault);
            let archiveUpdateRes = await axiosInstance.post(
              `/vault/user/update/archive`,
              {
                userId: userData._id,
                type: 'archive',
                passwordsMain: Array.from(mainUint),
                passwordsArchive: Array.from(archiveUint),
                vault: 'file',
              }
            );
          }

          const mergedVaults = vaultMerger('file', updateVault, mainVault);

          // console.log(mergedVaults);

          let newMainVault = { data: mergedVaults, type: 'main' };
          // console.log(newMainVault);
          // TODO: add state to params
          setFileVault = newMainVault;
          isFile = true;
          const encMainVault = await encryptData(
            operations,
            masterKey,
            iv,
            newMainVault.data
          );

          let mergeUint = new Uint8Array(encMainVault);
          // update main vault
          let hasSent = false;
          if (!hasSent) {
            hasSent = true;
            await axiosInstance.post(`/vault/user/update/main`, {
              userId: userData._id,
              type: 'main',
              passwords: Array.from(mergeUint),
              vault: 'file',
            });
          }
        }
      });

      // client
      let decryptedClients = [];
      let decClientArchive = [];
      encryptedVaults[1].forEach(async (e) => {
        let vault = {};

        let dataDec = await decryptData(operations, masterKey, iv, e.data);

        vault.data = dataDec;
        vault.type = e.type;
        if (e.type !== 'archive') {
          decryptedClients.push(vault);
        } else {
          decClientArchive.push(vault);
        }
        // console.log(vault);
        if (decryptedClients.length == 2 && decClientArchive.length == 1) {
          let updateVault =
            decryptedClients[0].type !== 'update'
              ? decryptedClients[1]
              : decryptedClients[0];

          let mainVault =
            decryptedClients[1].type !== 'main'
              ? decryptedClients[0]
              : decryptedClients[1];

          let archiveVault = decClientArchive[0];
          // console.log(decryptedClients);
          if (mainVault.data.length >= 250) {
            const newArchive = vaultMerger('client', archiveVault, mainVault);

            let newArchiveVault = {
              data: newArchive,
              type: 'archive',
            };

            let newMainVault = { data: [], type: 'main' };

            const encMainVault = await encryptData(
              operations,
              masterKey,
              iv,
              newMainVault.data
            );

            const encArchiveVault = await encryptData(
              operations,
              masterKey,
              iv,
              newArchiveVault.data
            );

            let mainUint = new Uint8Array(encMainVault);
            let archiveUint = new Uint8Array(encArchiveVault);
            let archiveUpdateRes = await axiosInstance.post(
              `/vault/user/update/archive`,
              {
                userId: userData._id,
                type: 'archive',
                clientsMain: Array.from(mainUint),
                clientsArchive: Array.from(archiveUint),
                vault: 'client',
              }
            );
          }
          const mergedVaults = vaultMerger('client', updateVault, mainVault);

          let newMainVault = { data: mergedVaults, type: 'main' };
          // console.log(newMainVault);
          // TODO: add new main vault to state
          setClientVault = newMainVault;
          isClient = true;
          const encMainVault = await encryptData(
            operations,
            masterKey,
            iv,
            newMainVault.data
          );
          let mergeUint = new Uint8Array(encMainVault);
          // update main vault
          let hasSent = false;
          if (!hasSent) {
            hasSent = true;
            await axiosInstance.post(`/vault/user/update/main`, {
              userId: userData._id,
              type: 'main',
              clients: Array.from(mergeUint),
              vault: 'client',
            });
          }
        }
      });

      // TODO: add vault to state, add keys to ram.
      // sessionStorage.setItem('dualKeyOne', dualKeyOne);
      setServerVault = vault;
      setUpdateFileVault = {
        data: [],
        type: 'update',
      };
      setUpdateClientVault = {
        data: [],
        type: 'update',
      };

      const checkInt = setInterval(() => {
        if (isFile === true && isClient === true) {
          self.postMessage(
            JSON.stringify({
              setFileVault,
              setClientVault,
              setServerVault,
              setUpdateClientVault,
              setUpdateFileVault,
              dualKeyOne,
            })
          );
          clearInterval(checkInt);
        }
      }, 1000);
    }
  }
};
///////////////////////////////
const fetchData_encryptOnLogout = async (
  fileVault,
  clientVault,
  serverVault,
  updateFileVault,
  updateClientVault,
  storeFile,
  self,
  userData,
  psymaxToken
) => {
  try {
    console.log('logout encrypt');
    let fileVaultLength = Object.keys(fileVault).length;
    let clientVaultLength = Object.keys(clientVault).length;
    let serverVaultLength = Object.keys(serverVault).length;
    let updateFileVaultLength = Object.keys(updateFileVault).length;
    let updateClientVaultLength = Object.keys(updateClientVault).length;
    const axiosInstance = axiosWrap(psymaxToken);

    if (
      fileVaultLength > 0 &&
      clientVaultLength > 0 &&
      serverVaultLength > 0 &&
      updateFileVaultLength > 0 &&
      updateClientVaultLength > 0 &&
      userData
    ) {
      // TODO: encrypt update vault.
      const operations = self.crypto.subtle || self.crypto.webkitSubtle;
      let pass = userData.password;
      let ePass = userData.emergencyPassword;
      let dualKeySalt = serverVault.dualKeySalt;
      let masterKeySalt = serverVault.masterKeySalt;
      let allKeys = await deriveAllKeys(
        pass,
        ePass,
        dualKeySalt,
        masterKeySalt,
        self
      );
      let keysLength = Object.keys(allKeys).length;
      if (keysLength > 0) {
        const {
          masterKey,
          iv,
          dualKeyOne,
          dualKeyTwo,
          dualMasterKey,
          backUpIv,
          recoveryKeyEnc,
        } = allKeys;
        if (updateFileVault.data.length > 0 && storeFile) {
          const fileUpdateEnc = await encryptData(
            operations,
            masterKey,
            iv,
            updateFileVault.data
          );
          let fileUpdateUint = new Uint8Array(fileUpdateEnc);
          console.log(fileUpdateUint);
          await axiosInstance.post(`/vault/user/update/main`, {
            userId: userData._id,
            type: 'update',
            passwords: Array.from(fileUpdateUint),
            vault: 'file',
          });
          storeFile.forEach(async (data, i) => {
            console.log(storeFile);
            const response = await axiosInstance.post(`/file/store`, {
              userId: userData._id,
              file: data.file,
              name: data.name,
            });
            console.log(response);
          });
        }
        if (updateClientVault.data) {
          const clientUpdateEnc = await encryptData(
            operations,
            masterKey,
            iv,
            updateClientVault.data
          );
          let clientUpdateUint = new Uint8Array(clientUpdateEnc);
          console.log(clientUpdateUint);
          await axiosInstance.post(`/vault/user/update/main`, {
            userId: userData._id,
            type: 'update',
            clients: Array.from(clientUpdateUint),
            vault: 'client',
          });
        }
        if (clientVault.data) {
          console.log(clientVault.data);
          const clientEnc = await encryptData(
            operations,
            masterKey,
            iv,
            clientVault.data
          );
          let clientUint = new Uint8Array(clientEnc);
          console.log(clientUint);
          await axiosInstance.post(`/vault/user/update/main`, {
            userId: userData._id,
            type: 'main',
            clients: Array.from(clientUint),
            vault: 'client',
          });
        }
      }
    }

    const response = await axiosInstance.delete(`/logout`);
    if (response?.status === 200) {
      self.postMessage('clearData');
    }
  } catch (error) {
    self.postMessage('error: ' + error.message);
    console.error('Logout error:', error);
  }
};

export { encryptOnLoginA, encryptOnLoginB, fetchData_encryptOnLogout };
