'use client';

import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axios';
import { SOMETHING_WRONG } from '../../utils/constants';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth.context';
import vaultContext from '@/context/vault.context';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { handleApiError } from '../../utils/apiHelpers';
import {
  decryptData,
  deriveAllKeys,
  encryptData,
  isEncrypted,
  vaultMerger,
} from '@/utils/utilityFn';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [userData, setUserData] = useState();
  const { dispatch } = useContext(AuthContext);
  const { vaultState } = useContext(vaultContext);
  const {
    fileVault,
    setFileVault,
    clientVault,
    setClientVault,
    serverVault,
    setServerVault,
    updateFileVault,
    setUpdateFileVault,
    updateClientVault,
    setUpdateClientVault,
  } = vaultState;

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/login`, data);
      const responseData = response?.data?.data;
      if (response?.status === 200) {
        // console.log(responseData);
        const user_id = responseData._id;
        const vaultRes = await axiosInstance.get(`/vault/user/${user_id}`);
        setUserData(responseData);
        if (vaultRes?.status === 200) {
          const vaultResData = vaultRes?.data?.data;
          const operations = window.crypto.subtle || window.crypto.webkitSubtle;
          let clientVault = vaultResData.clientVaults;
          let fileVault = vaultResData.vaults;

          let clientEncrypted = isEncrypted(clientVault);
          let fileEncrypted = isEncrypted(fileVault);

          if (!clientEncrypted && !fileEncrypted) {
            if (!operations) {
              alert('Web Crypto is not supported on this browser');
              console.warn('Web Crypto API not supported');
            } else {
              // TODO: request server vault.
              let userData = responseData;
              const response = await axiosInstance.get(`/vault/server`);
              let vault = response.data.data;
              let pass = userData.password;
              let ePass = userData.emergencyPassword;
              let dualKeySalt = vault.dualKeySalt;
              let masterKeySalt = vault.masterKeySalt;
              if (ePass) {
                // TODO: derive dualkeys and master keys.
                let allKeys = await deriveAllKeys(
                  pass,
                  ePass,
                  dualKeySalt,
                  masterKeySalt,
                  window
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
                    data: [
                      {
                        fileName: '',
                        fileReference: '',
                        fileKey: '',
                      },
                    ],
                  };

                  const passwordMainDirectory = {
                    data: [
                      {
                        fileName: '',
                        fileReference: '',
                        fileKey: '',
                      },
                    ],
                  };

                  const passwordArchiveDirectory = {
                    data: [{ fileName: '', fileReference: '', fileKey: '' }],
                  };

                  const passUpdateDirEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    passwordUpdateDirectory
                  );

                  const passMainDirEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    passwordMainDirectory
                  );

                  const passArchiveDirEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    passwordArchiveDirectory
                  );

                  const clientsUpdate = {
                    data: [{ clientId: '', clientKey: '' }],
                  };
                  const clientsMain = {
                    data: [{ clientId: '', clientKey: '' }],
                  };
                  const clientsArchive = {
                    data: [{ clientId: '', clientKey: '' }],
                  };

                  const clientUpdateEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    clientsUpdate
                  );
                  const clientMainEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    clientsMain
                  );
                  const clientArchiveEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    clientsArchive
                  );

                  const passUpdateUintArr = new Uint8Array(passUpdateDirEnc);
                  const passMainUintArr = new Uint8Array(passMainDirEnc);
                  const passArchiveUintArr = new Uint8Array(passArchiveDirEnc);

                  const clientsUpdateUintArr = new Uint8Array(clientUpdateEnc);
                  const clientsMainUintArr = new Uint8Array(clientMainEnc);
                  const clientsArchiveUintArr = new Uint8Array(
                    clientArchiveEnc
                  );

                  let fileVaultArray = [];
                  let clientVaultArray = [];

                  fileVault.map((e) => {
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

                  const resVault = await axiosInstance.post(
                    `/vault/user/update`,
                    {
                      fileVault: fileVaultArray,
                      clientVault: clientVaultArray,
                      recoveryKey: Array.from(masterKeyEncUint),
                    }
                  );

                  // // TODO: add vault to state, add keys to ram.
                  localStorage.setItem('dualKeyOne', dualKeyOne);
                  setServerVault(vault);
                  setUpdateFileVault({
                    data: [],
                    type: 'update',
                  });
                  setUpdateClientVault({
                    data: [],
                    type: 'update',
                  });
                }
              }
            }
          } else {
            if (!operations) {
              alert('Web Crypto is not supported on this browser');
              console.warn('Web Crypto API not supported');
            } else {
              let userData = responseData;
              const response = await axiosInstance.get(`/vault/server`);
              let vault = response.data.data;
              let pass = userData.password;
              let ePass = userData.emergencyPassword;
              let dualKeySalt = vault.dualKeySalt;
              let masterKeySalt = vault.masterKeySalt;
              if (ePass) {
                // TODO: derive dualkeys and master keys.
                let allKeys = await deriveAllKeys(
                  pass,
                  ePass,
                  dualKeySalt,
                  masterKeySalt,
                  window
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
                  } = allKeys;
                  // console.log(allKeys);

                  let fileUintArr = [];

                  fileVault.forEach((e) => {
                    if (e.type === 'update') {
                      let fileUpdateVault = new Uint8Array(e.passwords.data);
                      fileUintArr.push({ data: fileUpdateVault, type: e.type });
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

                  // console.log(recoveryKeyArr);

                  let recoveryKeyDec = await decryptData(
                    operations,
                    dualMasterKey,
                    backUpIv,
                    recoveryKeyArr
                  );

                  let backUpMaster = window.crypto.subtle.importKey(
                    'raw',
                    new Uint8Array(recoveryKeyDec.recovery),
                    'AES-GCM',
                    true,
                    ['encrypt', 'decrypt']
                  );

                  backUpMaster = await backUpMaster;
                  // console.log(backUpMaster, masterKey);
                  // file
                  let decryptedFiles = [];
                  encryptedVaults[0].forEach(async (e) => {
                    let dataDec = await decryptData(
                      operations,
                      backUpMaster,
                      iv,
                      e.data
                    );

                    dataDec.type = e.type;
                    if (dataDec.type !== 'archive') {
                      decryptedFiles.push(dataDec);
                    }
                    if (decryptedFiles.length == 2) {
                      let updateVault =
                        decryptedFiles[0].type !== 'update'
                          ? decryptedFiles[1]
                          : decryptedFiles[0];

                      let mainVault =
                        decryptedFiles[1].type !== 'main'
                          ? decryptedFiles[0]
                          : decryptedFiles[1];

                      // console.log(decryptedFiles);

                      const mergedVaults = vaultMerger(
                        'file',
                        updateVault,
                        mainVault
                      );
                      let newMainVault = { data: mergedVaults, type: 'main' };
                      // TODO: add new main vault to state
                      setFileVault(newMainVault);
                      const encMainVault = await encryptData(
                        operations,
                        masterKey,
                        iv,
                        newMainVault
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
                  encryptedVaults[1].forEach(async (e) => {
                    let dataDec = await decryptData(
                      operations,
                      backUpMaster,
                      iv,
                      e.data
                    );

                    // console.log(dataDec);

                    dataDec.type = e.type;
                    if (dataDec.type !== 'archive') {
                      decryptedClients.push(dataDec);
                    }
                    if (decryptedClients.length == 2) {
                      let updateVault =
                        decryptedClients[0].type !== 'update'
                          ? decryptedClients[1]
                          : decryptedClients[0];

                      let mainVault =
                        decryptedClients[1].type !== 'main'
                          ? decryptedClients[0]
                          : decryptedClients[1];

                      const mergedVaults = vaultMerger(
                        'client',
                        updateVault,
                        mainVault
                      );

                      let newMainVault = { data: mergedVaults, type: 'main' };
                      // TODO: add new main vault to state
                      setClientVault(newMainVault);
                      const encMainVault = await encryptData(
                        operations,
                        masterKey,
                        iv,
                        newMainVault
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
                          vault: 'client',
                        });
                      }
                    }
                  });

                  // // TODO: add vault to state, add keys to ram.
                  localStorage.setItem('dualKeyOne', dualKeyOne);
                  setServerVault(vault);
                  setUpdateFileVault({
                    data: [],
                    type: 'update',
                  });
                  setUpdateClientVault({
                    data: [],
                    type: 'update',
                  });
                }
              }
            }
          }
        }
        localStorage.setItem('psymax-loggedin', true);
        localStorage.setItem('psymax-token', responseData?.token);
        localStorage.setItem('psymax-user-data', JSON.stringify(responseData));
        localStorage.setItem('psymax-is-admin', responseData?.isAdmin);
        dispatch({
          type: 'LOGIN',
          payload: { isLoggedin: true, userData: responseData },
        });
      } else {
        toast.error(SOMETHING_WRONG);
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };
  useEffect(() => {
    let fileVaultLength = Object.keys(fileVault).length;
    let clientVaultLength = Object.keys(clientVault).length;
    let serverVaultLength = Object.keys(serverVault).length;
    let updateFileVaultLength = Object.keys(updateFileVault).length;
    let updateClientVaultLength = Object.keys(updateClientVault).length;

    if (
      fileVaultLength > 0 &&
      clientVaultLength > 0 &&
      serverVaultLength > 0 &&
      updateFileVaultLength > 0 &&
      updateClientVaultLength > 0
    ) {
      if (Object.keys(userData).length > 0) {
        localStorage.setItem('fileVault', JSON.stringify(fileVault));
        localStorage.setItem('clientVault', JSON.stringify(clientVault));
        localStorage.setItem('serverVault', JSON.stringify(serverVault));
        localStorage.setItem(
          'updateFileVault',
          JSON.stringify(updateFileVault)
        );
        localStorage.setItem(
          'updateClientVault',
          JSON.stringify(updateClientVault)
        );
        if (userData?.isAdmin === 1) {
          router.push('/admin');
        }
        if (userData?.isAdmin === 0) {
          router.push('/dashboard');
        }
      }
    } else if (
      serverVaultLength > 0 &&
      updateFileVaultLength > 0 &&
      updateClientVaultLength > 0
    ) {
      if (Object.keys(userData).length > 0) {
        localStorage.setItem('serverVault', JSON.stringify(serverVault));
        localStorage.setItem(
          'updateFileVault',
          JSON.stringify(updateFileVault)
        );
        localStorage.setItem(
          'updateClientVault',
          JSON.stringify(updateClientVault)
        );
        if (userData?.isAdmin === 1) {
          router.push('/admin');
        }
        if (userData?.isAdmin === 0) {
          router.push('/dashboard');
        }
      }
    }
  }, [fileVault, clientVault, serverVault, updateFileVault, updateClientVault]);
  return (
    <Layout>
      <div className="main-content">
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-middle">
            <Grid container>
              <Grid item xs={12}>
                <p className="text-center mt-16 interFonts text-2xl font-semibold text[#0e0e0e]">
                  Anmelden
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
                  name="email"
                  type="text"
                  focusColor="#3C3C3C"
                  id="email"
                  label="E-Mail Adresse"
                  variant="outlined"
                  {...register('email', { required: true })}
                  error={!!errors.email}
                  inputProps={{
                    className: 'interFonts',
                  }}
                />
                {errors?.email && (
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
                  id="password"
                  label="Passwort"
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
                sx={{ textAlign: 'center', mt: 1 }}
              >
                <Typography
                  sx={{
                    margin: 'auto',
                    color: '#989898',
                    textAlign: 'right',
                    fontFamily: 'Inter Tight',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  Passwort vergessen?
                </Typography>
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
                  <span style={{ color: '#0E0E0E' }}>Anmelden</span>
                </button>
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
                <Typography
                  sx={{
                    color: '#989898',
                    textAlign: 'center',
                    fontFamily: 'Inter Tight',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  Sie haben noch kein Konto und möchten sich registrieren.
                </Typography>
              </Grid>
              <Grid item sm={2.5} md={4.25} xl={4.25} />
            </Grid>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;
