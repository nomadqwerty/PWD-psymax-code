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
    let encoder = new TextEncoder();
    let code = encoder.encode(data);
    console.log(code);
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

export { passwordGenerator, psyMaxKDF, encryptData };
