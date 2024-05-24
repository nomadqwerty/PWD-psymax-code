import {
  decryptData,
  deriveAllKeys,
  encryptFile,
  passwordGenerator,
} from '../../../utils/utilityFn';

const decryptClient = async (
  responseData,
  pass,
  ePass,
  dualKeySalt,
  masterKeySalt,
  setEmpfaenger,
  self
) => {
  if (pass !== undefined) {
    let allKeys = await deriveAllKeys(
      pass,
      ePass,
      dualKeySalt,
      masterKeySalt,
      self
    );
    // console.log(allKeys);
    const operations = self.crypto.subtle || self.crypto.webkitSubtle;

    let keysLength = Object.keys(allKeys).length;

    if (keysLength > 0) {
      const { masterKey, iv } = allKeys;

      const fieldsToDec = [
        'Anrede',
        'Titel',
        'Firma',
        'Vorname',
        'Nachname',
        'Strasse_und_Hausnummer',
        'PLZ',
        'Ort',
        'Land',
        'Diagnose',
        'Geburtsdatum',
        'ArztTitel',
        'ArztAnrede',
        'ArztVorname',
        'ArztNachname',
        'ArztStrasse_und_Hausnummer',
        'ArztPLZ',
        'ArztOrt',
        'ArztLand',
      ];
      for (let i = 0; i < fieldsToDec.length; i++) {
        if (responseData[fieldsToDec[i]]) {
          // console.log(responseData[fieldsToDec[i]]);
          const dataField = new Uint8Array(responseData[fieldsToDec[i]].data);
          const decField = await decryptData(
            operations,
            masterKey,
            iv,
            dataField
          );

          responseData[fieldsToDec[i]] = decField;
        }
      }
      // console.log('dec client fields');
      if (responseData?._id !== undefined) {
        setEmpfaenger = responseData;
        self.postMessage(
          JSON.stringify({
            setEmpfaenger,
          })
        );
      }
    }
  }
};

const encryptBriefFile = async (
  responseData,
  serverVault,
  userData,
  setStoreFile,
  fileVault,
  setUpdateFileVault,
  setFileVault,
  storeFile,
  self
) => {
  if (responseData?.raw) {
    const operations = self.crypto.subtle || self.crypto.webkitSubtle;
    let serverVaultLength = Object.keys(serverVault).length;

    if (serverVaultLength > 0 && userData) {
      userData = JSON.parse(userData);
      let filePass = passwordGenerator();
      let ePass = userData.emergencyPassword;
      let dualKeySalt = serverVault.dualKeySalt;
      let masterKeySalt = serverVault.masterKeySalt;
      let allKeys = await deriveAllKeys(
        filePass,
        ePass,
        dualKeySalt,
        masterKeySalt,
        self
      );
      // console.log(allKeys);

      let keysLength = Object.keys(allKeys).length;

      if (keysLength > 0) {
        const { masterKey, iv } = allKeys;

        let data = new Uint8Array(responseData.raw.data).buffer;
        let name = responseData.fileName.split('.')[0];

        let encFile = await encryptFile(operations, data, masterKey, iv);
        let file = new Blob([data]);
        let uintFile = new Uint8Array(encFile);
        let fileArrayData = Array.from(uintFile);

        setStoreFile = [...storeFile, { name, file: fileArrayData }];

        if (file) {
          // TODO: Store file key and reference in vault.
          const newFileVault = {
            data: [
              ...fileVault.data,
              {
                fileName: `${name}.${'pdf'}`,
                fileReference: `${userData._id}-${name}.${'pdf'}`,
                fileKey: filePass,
              },
            ],
            type: 'update',
          };
          // console.log(newFileVault);
          setUpdateFileVault = newFileVault;
          setFileVault = newFileVault;
          self.postMessage(
            JSON.stringify({
              fileName: `${name}.${'pdf'}`,
              setStoreFile,
              setUpdateFileVault,
              setFileVault,
              file: responseData.raw.data,
            })
          );
        }
      }
    }
  }
};

export { decryptClient, encryptBriefFile };
