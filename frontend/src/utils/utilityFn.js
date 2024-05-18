import argon2 from 'argon2-browser';

const passwordGenerator = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*?_+';
  let result = '';

  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const psyMaxKDF = async (password, salt) => {
  try {
    const hashObj = await argon2.hash({
      pass: password,
      salt: salt,
      time: 3,
      mem: 65536,
      hashLen: 32,
      parallelism: 1,
      type: argon2.ArgonType.Argon2id,
    });
    const hashStr = hashObj.hashHex;
    return hashStr;
  } catch (e) {
    // console.log(e.message);
  }
};

const encryptData = async (
  operations,
  encKey,
  iv,
  data,
  algoName = 'AES-GCM'
) => {
  try {
    //////////////////////////////////
    let stringData = JSON.stringify(data);
    let encoder = new TextEncoder();
    let code = encoder.encode(stringData);
    //////////////////////////////////////
    const encrypted = await operations.encrypt(
      { name: algoName, iv },
      encKey,
      code
    );

    return encrypted;
  } catch (error) {
    // console.log(error.message, ':- encryption error');
  }
};
let downloadFile = (file, fileName) => {
  file = new Blob([file]);
  let elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(file);
  elem.download = `${fileName}`;
  // console.log('here');

  elem.click();
};
const decryptFile = async (
  operations,
  file,
  encKey,
  iv,
  algoName = 'AES-GCM'
) => {
  const decryptedData = await operations.decrypt(
    {
      name: algoName,
      iv,
    },
    encKey,
    file
  );

  return decryptedData;
};
const encryptFile = async (
  operations,
  file,
  encKey,
  iv,
  algoName = 'AES-GCM'
) => {
  try {
    const encrypted = await operations.encrypt(
      { name: algoName, iv },
      encKey,
      file
    );
    return encrypted;
  } catch (error) {
    // console.log(error.message, ':- encryption error');
  }
};
const decryptData = async (
  operations,
  decKey,
  iv,
  data,
  algoName = 'AES-GCM'
) => {
  try {
    ////////////////////////////
    const decrypted = await operations.decrypt(
      {
        name: algoName,
        iv,
      },
      decKey,
      data.buffer
    );

    const uint8Dec = new Uint8Array(decrypted);

    let decoder = new TextDecoder();
    let decodeDec = decoder.decode(uint8Dec);
    let decData = JSON.parse(decodeDec);
    // console.log(decData);
    return decData;
  } catch (error) {
    // console.log(error);
  }
};

const deriveAllKeys = async (
  pass,
  ePass,
  dualKeySalt,
  masterKeySalt,
  window
) => {
  // console.log(pass);
  // console.log(dualKeySalt);
  // TODO: derive dualkeys and master keys.
  const dualKeyOne = await psyMaxKDF(pass, dualKeySalt);
  const dualKeyTwo = await psyMaxKDF(ePass, dualKeySalt);
  // console.log(dualKeyOne);
  const masterKeyOne = await psyMaxKDF(dualKeyOne, masterKeySalt);
  const masterKeyTwo = await psyMaxKDF(dualKeyTwo, masterKeySalt);

  let encoder = new TextEncoder();
  let masterKeyOneEnc = encoder.encode(masterKeyOne?.slice(0, 16));
  let masterKeyTwoEnc = encoder.encode(masterKeyTwo?.slice(0, 16));

  let masterKeyMain = window.crypto.subtle.importKey(
    'raw',
    masterKeyOneEnc,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
  let recoveryMasterKey = window.crypto.subtle.importKey(
    'raw',
    masterKeyTwoEnc,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
  let masterKey = await masterKeyMain;
  let dualMasterKey = await recoveryMasterKey;
  let iv = masterKeyOneEnc;
  let backUpIv = masterKeyOneEnc;
  // console.log(masterKey, dualMasterKey, 'keys master');
  // console.log(iv, backUpIv, 'ivs');
  // console.log(dualKeyOne, dualKeyTwo, 'dual keys');

  const requirements = {
    masterKey,
    dualMasterKey,
    iv,
    backUpIv,
    dualKeyOne,
    dualKeyTwo,
    recoveryKeyEnc: masterKeyOneEnc,
  };
  return requirements;
};

const isEncrypted = (vaultArray) => {
  let count = 0;
  for (let i = 0; i < vaultArray.length; i++) {
    if (vaultArray[i].isEncrypted) {
      count = count + 1;
    }
  }
  return count === vaultArray.length ? true : false;
};

let vaultMerger = (type, vault1, vault2) => {
  let mergeFn = (list1, list2) => {
    let match = [];
    for (let i = 0; i < list1.length; i++) {
      let data1Json = JSON.stringify(list1[i]);

      let data2Json;
      for (let j = 0; j < list2.length; j++) {
        data2Json = JSON.stringify(list2[j]);

        if (data2Json === data1Json) {
          match.push(data2Json);
          break;
        }
      }
    }
    let noMatch = [];
    for (let i = 0; i < list1.length; i++) {
      let data1Json = JSON.stringify(list1[i]);
      if (!match.includes(data1Json)) {
        noMatch.push(data1Json);
      }
    }
    for (let i = 0; i < list2.length; i++) {
      let data2Json = JSON.stringify(list2[i]);
      if (!match.includes(data2Json)) {
        noMatch.push(data2Json);
      }
    }
    let mergedVault = [...match, ...noMatch];
    return mergedVault;
  };
  try {
    type = type.toLowerCase();
    let data1 = vault1.data;
    let data1Str = JSON.stringify(vault1.data);
    let data2 = vault2.data;
    let data2Str = JSON.stringify(vault2.data);

    if (data1Str === data2Str) {
      return data2;
    } else {
      if (type === 'client') {
        let vaultList = [];
        let mergedVault = mergeFn(data1, data2);

        for (let i = 0; i < mergedVault.length; i++) {
          let vaultItem = JSON.parse(mergedVault[i]);
          if ('clientId' in vaultItem && 'clientKey' in vaultItem) {
            vaultList.push(vaultItem);
          }
        }
        return vaultList;
      } else if (type === 'file') {
        let vaultList = [];
        let mergedVault = mergeFn(data1, data2);

        for (let i = 0; i < mergedVault.length; i++) {
          let vaultItem = JSON.parse(mergedVault[i]);

          if (
            'fileName' in vaultItem &&
            'fileReference' in vaultItem &&
            'fileKey' in vaultItem
          ) {
            vaultList.push(vaultItem);
          }
        }
        return vaultList;
      }
    }
  } catch (error) {
    return { error: true, message: error.message };
  }
};

/*
{
  "data": [
    {
      "clientId": "",
      "clientKey": ""
    }
  ],
  "type": "update"
}

{
  "data": [
    {
      "fileName": "",
      "fileReference": "",
      "fileKey": ""
    }
  ],
  "type": "main"
}
*/
export {
  passwordGenerator,
  psyMaxKDF,
  encryptData,
  decryptData,
  deriveAllKeys,
  isEncrypted,
  vaultMerger,
  encryptFile,
  decryptFile,
  downloadFile,
};
