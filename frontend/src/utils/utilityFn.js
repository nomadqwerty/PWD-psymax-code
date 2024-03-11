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
    console.log(e.message);
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
    console.log(error.message, ':- encryption error');
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
      data
    );
    const uint8Dec = new Uint8Array(decrypted);

    let decoder = new TextDecoder();
    let decodeDec = decoder.decode(uint8Dec);
    let decData = JSON.parse(decodeDec);
    return decData;
  } catch (error) {
    console.log(error.message);
  }
};

const deriveAllKeys = async (
  pass,
  ePass,
  dualKeySalt,
  masterKeySalt,
  window
) => {
  console.log(pass);
  // TODO: derive dualkeys and master keys.
  const dualKeyOne = await psyMaxKDF(pass, dualKeySalt);
  const dualKeyTwo = await psyMaxKDF(ePass, dualKeySalt);
  const masterKeyOne = await psyMaxKDF(dualKeyOne, masterKeySalt);
  const masterKeyTwo = await psyMaxKDF(dualKeyTwo, masterKeySalt);

  let encoder = new TextEncoder();
  let masterKeyOneEnc = encoder.encode(masterKeyOne.slice(0, 16));
  let masterKeyTwoEnc = encoder.encode(masterKeyTwo.slice(0, 16));

  let masterKeyMain = window.crypto.subtle.importKey(
    'raw',
    masterKeyOneEnc,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
  let masterKeyBackUp = window.crypto.subtle.importKey(
    'raw',
    masterKeyTwoEnc,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
  let masterKey = await masterKeyMain;
  let backUpMasterKey = await masterKeyBackUp;
  console.log(masterKey, backUpMasterKey, 'keys master');
  let iv = masterKeyOneEnc;
  let backUpIv = masterKeyTwoEnc;
  console.log(iv, backUpIv, 'ivs');
  console.log(dualKeyOne, dualKeyTwo, 'dual keys');
  const requirements = {
    masterKey,
    backUpMasterKey,
    iv,
    backUpIv,
    dualKeyOne,
    dualKeyTwo,
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

export {
  passwordGenerator,
  psyMaxKDF,
  encryptData,
  decryptData,
  deriveAllKeys,
  isEncrypted,
};
