import {
  deriveAllKeys,
  encryptData,
  decryptData,
} from '../../../../utils/utilityFn';
import { axiosWrap } from '../../../../utils/axios';

const encryptNewClient = async (
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
) => {
  if (pass !== undefined) {
    let ePass = userData.emergencyPassword;
    let dualKeySalt = serverVault.dualKeySalt;
    let masterKeySalt = serverVault.masterKeySalt;
    const operations = self.crypto.subtle || self.crypto.webkitSubtle;
    let response;
    const axiosInstance = axiosWrap(psymaxToken);

    let allKeys = await deriveAllKeys(
      pass,
      ePass,
      dualKeySalt,
      masterKeySalt,
      self
    );

    let clientKeys = await deriveAllKeys(
      userData.password,
      ePass,
      dualKeySalt,
      masterKeySalt,
      self
    );

    let keysLength = Object.keys(allKeys).length;
    let clientKeyLength = Object.keys(clientKeys).length;
    if (keysLength > 0 && clientKeyLength > 0) {
      const { masterKey, iv } = allKeys;

      const fieldsToEncrypt = [
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

      for (let i = 0; i < fieldsToEncrypt.length; i++) {
        const dataField = data[fieldsToEncrypt[i]];
        const encField = await encryptData(
          operations,
          masterKey,
          iv,
          dataField
        );
        const uintField = new Uint8Array(encField);
        const arrayField = Array.from(uintField);
        data[fieldsToEncrypt[i]] = arrayField;
      }

      if (isEdit) {
        data.id = params?.id;
        data.isEncrypted = true;
        delete data?.Chiffre;
        delete data?.userChiffre;
        // console.log('here for editing');
        // console.log(data);
        response = await axiosInstance.put('/klient/update', data);
      } else {
        data.isEncrypted = true;
        // console.log(data);
        response = await axiosInstance.post('/klient/save', data);
        // TODO: Add client key and id to client vault

        let updateVault = {
          data: [
            ...updateClientVault.data,
            {
              clientId: response.data.data._id,
              clientKey: pass,
            },
          ],
          type: 'update',
        };

        let mainVault = {
          data: [
            ...clientVault.data,
            {
              clientId: response.data.data._id,
              clientKey: pass,
            },
          ],
          type: 'update',
        };

        setUpdateClientVault = updateVault;
        setClientVault = mainVault;
        const vaultEnc = await encryptData(
          operations,
          clientKeys.masterKey,
          clientKeys.iv,
          updateVault.data
        );
        // console.log(vaultEnc);
        let clientUpdateUint = new Uint8Array(vaultEnc);
        // console.log(clientUpdateUint);
        let clientVaultRes = await axiosInstance.post(
          `/vault/user/update/main`,
          {
            userId: userData._id,
            type: 'update',
            clients: Array.from(clientUpdateUint),
            vault: 'client',
          }
        );
        if (clientVaultRes.status === 200) {
          self.postMessage(
            JSON.stringify({
              setUpdateClientVault,
              setClientVault,
              response,
            })
          );
        }
      }
    }

    // TODO: encrypt client data fields.
  }
};

const decryptClient = async (
  clientVault,
  params,
  self,
  userData,
  serverVault,
  responseData,
  modifiedArzt,
  setDefaultValues,
  setEditData
) => {
  if (clientVault?.data?.length >= 0) {
    let fieldsToDec = [
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
    const operations = self.crypto.subtle || self.crypto.webkitSubtle;
    const decClientsList = [];

    clientVault.data.forEach(async (vault) => {
      let clientId = vault.clientId;
      let clientKey = vault.clientKey;
      // console.log(params.id === clientId);

      if (params.id === clientId) {
        let serverVaultLength = Object.keys(serverVault).length;

        if (serverVaultLength > 0 && userData) {
          userData = JSON.parse(userData);

          let pass = clientKey;
          let ePass = userData.emergencyPassword;
          let dualKeySalt = serverVault.dualKeySalt;
          let masterKeySalt = serverVault.masterKeySalt;
          // console.log(pass, ePass, dualKeySalt, masterKeySalt);
          if (
            pass.length > 0 &&
            ePass.length > 0 &&
            dualKeySalt.length > 0 &&
            masterKeySalt.length > 0
          ) {
            let allKeys = await deriveAllKeys(
              pass,
              ePass,
              dualKeySalt,
              masterKeySalt,
              self
            );

            let dataObj = { ...responseData, ...modifiedArzt };
            // console.log(responseData, modifiedArzt);
            for (let i = 0; i < fieldsToDec.length; i++) {
              const dataField = new Uint8Array(dataObj[fieldsToDec[i]].data);

              const decField = await decryptData(
                operations,
                allKeys.masterKey,
                allKeys.iv,
                dataField
              );

              dataObj[fieldsToDec[i]] = decField;
            }
            if (
              typeof dataObj['Anrede'] === 'string' &&
              typeof dataObj['Anrede'] !== '[object][object]'
            ) {
              // return dataObj
              setDefaultValues = dataObj;
              setEditData = dataObj;
              self.postMessage(
                JSON.stringify({
                  setDefaultValues,
                  setEditData,
                })
              );
              // console.log(dataObj);
            }
          }
        }
      }
    });
  }
};

export { encryptNewClient, decryptClient };
