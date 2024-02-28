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
    console.log(data);
    let stringData = JSON.stringify(data);
    let encoder = new TextEncoder();
    let code = encoder.encode(stringData);

    //////////////////////////////////////
    console.log(code, 'encoded');
    const encrypted = await operations.encrypt(
      { name: algoName, iv },
      encKey,
      code
    );
    const uint8 = new Uint8Array(encrypted);
    console.log(uint8, 'encrypted');

    ////////////////////////////
    const decrypted = await operations.decrypt(
      {
        name: algoName,
        iv,
      },
      encKey,
      uint8
    );
    console.log(decrypted, 'decrypted');
    const uint8Dec = new Uint8Array(decrypted);
    console.log(uint8Dec, 'decrypted but encoded');

    let decoder = new TextDecoder();
    let decodeDec = decoder.decode(uint8Dec);
    console.log(decodeDec, 'decrypted data');

    // return decodeEnc;
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
    let encoder = new TextEncoder();
    let code = encoder.encode(data);
    console.log(code, 'decryption...');
    const decrypted = await operations.decrypt(
      {
        name: algoName,
        iv,
      },
      decKey,
      data
    );

    let decoder = new TextDecoder();
    let decodeDec = decoder.decode(decrypted);
    console.log(decodeDec, 'decrypted data');
    return decodeDec;
  } catch (error) {
    console.log(error.message);
  }
};

export { passwordGenerator, psyMaxKDF, encryptData, decryptData };
