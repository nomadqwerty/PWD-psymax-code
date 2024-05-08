'use client';
import Layout from '../../components/Layout';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import { useEffect, useState } from 'react';
import {
  passwordGenerator,
  deriveAllKeys,
  decryptData,
  isEncrypted,
  encryptData,
} from '@/utils/utilityFn';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/navigation';
import { Password } from '@mui/icons-material';
let twoFaCode;

const PasswordResetPage = ({ id }) => {
  const [fileEncVault, setFileEncVault] = useState(false);
  const [clientEncVault, setClientEncVault] = useState(false);
  const [newRecoveryKey, setNewRecoveryKey] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log(fileEncVault, clientEncVault, newRecoveryKey);
    if (fileEncVault && clientEncVault && newRecoveryKey) {
      console.log(fileEncVault, clientEncVault, newRecoveryKey);
      (async () => {
        const resVault = await axiosInstance.post(`/vault/user/update`, {
          fileVault: fileEncVault,
          clientVault: clientEncVault,
          recoveryKey: newRecoveryKey,
        });
        console.log(resVault);
        if (resVault.status === 200) {
          router.push(`/login`);
        }
      })();
    }
  }, [fileEncVault, clientEncVault, newRecoveryKey]);

  const onSubmit = (data) => {
    // TODO: rest password.
    (async () => {
      let password = data.password;
      let passwordConfirm = data.passwordConfirm;

      if (password === passwordConfirm) {
        // console.log(data);

        const recoveryRes = await axiosInstance.post(`/user/resetpassword`, {
          userId: id,
          password: password,
        });

        if (recoveryRes.status === 200) {
          let vaults = recoveryRes.data.data;
          // console.log(vaults);
          if (vaults) {
            const {
              oldPasswordHash,
              emergencyPassword,
              serverVault,
              fileVaults,
              clientVaults,
              newPassword,
              recoveryKey,
            } = vaults;
            const { dualKeySalt, masterKeySalt } = serverVault[0];

            let allKeys = await deriveAllKeys(
              oldPasswordHash,
              emergencyPassword,
              dualKeySalt,
              masterKeySalt,
              window
            );
            let clientEncrypted = isEncrypted(clientVaults);
            let fileEncrypted = isEncrypted(fileVaults);
            let keysLength = Object.keys(allKeys).length;
            if (keysLength > 0 && clientEncrypted && fileEncrypted) {
              const operations =
                window.crypto.subtle || window.crypto.webkitSubtle;

              let oldMaster = allKeys.masterKey;
              let oldIv = allKeys.iv;

              let fileUintArr = [];

              let newKeys = await deriveAllKeys(
                newPassword,
                emergencyPassword,
                dualKeySalt,
                masterKeySalt,
                window
              );

              let newKeysLength = Object.keys(newKeys).length;

              if (newKeysLength > 0 && clientEncrypted && fileEncrypted) {
                let newMaster = newKeys.masterKey;
                let newIv = newKeys.iv;
                fileVaults.forEach((e) => {
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

                clientVaults.forEach((e) => {
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

                let recKeyEnc = Array.from(newKeys.recoveryKeyEnc);
                recKeyEnc = { recovery: recKeyEnc };

                const masterKeyEnc = await encryptData(
                  operations,
                  newKeys.dualMasterKey,
                  newKeys.backUpIv,
                  recKeyEnc
                );

                let masterKeyEncUint = new Uint8Array(masterKeyEnc);

                setNewRecoveryKey(Array.from(masterKeyEncUint));

                // decrypt vaults
                let decryptedFiles = [];
                let encryptedFiles = [];
                let decryptedClients = [];
                let encryptedClients = [];
                console.log(oldPasswordHash);
                console.log(encryptedVaults);

                encryptedVaults[0].forEach(async (e) => {
                  // console.log(e.type);
                  let dataDec = await decryptData(
                    operations,
                    oldMaster,
                    oldIv,
                    e.data
                  );
                  console.log(dataDec);
                  if (dataDec) {
                    dataDec.type = e.type;
                    decryptedFiles.push(dataDec);
                    console.log(dataDec.data);
                    const encrypted = await encryptData(
                      operations,
                      newMaster,
                      newIv,
                      dataDec
                    );
                    let encUint = new Uint8Array(encrypted);
                    encryptedFiles.push({
                      passwords: Array.from(encUint),
                      type: e.type,
                      userId: id,
                    });
                    if (encryptedFiles.length === 3) {
                      setFileEncVault([...encryptedFiles]);
                      console.log(encryptedFiles);
                    }
                  }
                });
                encryptedVaults[1].forEach(async (e) => {
                  let dataDec = await decryptData(
                    operations,
                    oldMaster,
                    oldIv,
                    e.data
                  );
                  console.log(dataDec);
                  if (dataDec) {
                    dataDec.type = e.type;
                    decryptedClients.push(dataDec);
                    console.log(dataDec.data);
                    const encrypted = await encryptData(
                      operations,
                      newMaster,
                      newIv,
                      dataDec
                    );
                    let encUint = new Uint8Array(encrypted);
                    encryptedClients.push({
                      clients: Array.from(encUint),
                      type: e.type,
                      userId: id,
                    });

                    if (encryptedClients.length === 3) {
                      console.log(encryptedClients);
                      setClientEncVault([...encryptedClients]);
                    }
                  }
                });
              }
            } else {
              console.log(clientEncrypted, fileEncrypted);
            }
          }
        }
      }
    })();
  };

  return (
    <>
      <Layout>
        <div className="main-content">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-middle">
              <Grid container>
                <Grid item xs={12}>
                  <p className="text-center mt-16 interFonts text-2xl font-semibold text[#0e0e0e]">
                    reset account password
                  </p>
                </Grid>
                <Grid item sm={2.5} md={4.25} xl={4.25} />
                <Grid
                  item
                  xs={12}
                  md={3.5}
                  sm={7}
                  xl={3.5}
                  sx={{ textAlign: 'center', mt: 4 }}
                >
                  <CssTextField
                    fullWidth
                    name="password"
                    type="password"
                    focusColor="#3C3C3C"
                    id="password"
                    label="password"
                    variant="outlined"
                    {...register('password', { required: true })}
                    error={!!errors.password}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.password && (
                    <p className="validationErr">
                      Dieses Feld ist ein Pflichtfeld
                    </p>
                  )}
                </Grid>
                <Grid item sm={2.5} md={4.25} xl={4.25} />
              </Grid>

              <Grid container>
                <Grid item sm={2.5} md={4.25} xl={4.25} />
                <Grid
                  item
                  xs={12}
                  md={3.5}
                  sm={7}
                  xl={3.5}
                  sx={{ textAlign: 'center', mt: 3 }}
                >
                  <CssTextField
                    fullWidth
                    name="password"
                    type="password"
                    focusColor="#3C3C3C"
                    id="passwordConfirm"
                    label="Password confirm"
                    variant="outlined"
                    {...register('passwordConfirm', { required: true })}
                    error={!!errors.password}
                    inputProps={{
                      className: 'interFonts',
                    }}
                  />
                  {errors?.password && (
                    <p className="validationErr">
                      Dieses Feld ist ein Pflichtfeld
                    </p>
                  )}
                </Grid>
                <Grid item sm={2.5} md={4.25} xl={4.25} />
              </Grid>

              <Grid container>
                <Grid item sm={2.5} md={4.25} xl={4.25} />
                <Grid
                  item
                  xs={12}
                  md={3.5}
                  sm={7}
                  xl={3.5}
                  sx={{ textAlign: 'center', mt: 3 }}
                  className="login"
                >
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      color: '#989898',
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: '20px',
                    }}
                    className="h-[42px] px-5 py-2 rounded-[4px] justify-center items-center text-center text-sm interFonts"
                  >
                    <span style={{ color: '#0E0E0E' }}>Submit</span>
                  </button>
                </Grid>
                <Grid item sm={2.5} md={4.25} xl={4.25} />
              </Grid>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default PasswordResetPage;
