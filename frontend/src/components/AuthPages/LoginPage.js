'use client';
import Worker from 'worker-loader!./AuthUtils/authWorker';
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
import { encryptOnLoginA, encryptOnLoginB } from './AuthUtils/AuthUtils';

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
        const user_id = responseData._id;
        const vaultRes = await axiosInstance.get(`/vault/user/${user_id}`);
        setUserData(responseData);
        if (vaultRes?.status === 200) {
          toast('Encrypting Client and Password Directories');
          const vaultResData = vaultRes?.data?.data;
          const operations = window.crypto.subtle || window.crypto.webkitSubtle;
          let clientVault = vaultResData.clientVaults;
          let fileVault = vaultResData.vaults;

          let clientEncrypted = isEncrypted(clientVault);
          let fileEncrypted = isEncrypted(fileVault);
          //
          // TODO: create user vault if none is found.
          if (!clientEncrypted && !fileEncrypted) {
            if (!operations) {
              alert('Web Crypto is not supported on this browser');
              console.warn('Web Crypto API not supported');
            } else {
              const authWorker = new Worker();
              let userData = responseData;
              const response = await axiosInstance.get(`/vault/server`);
              const psymaxToken = localStorage.getItem('psymax-token');
              authWorker.postMessage({
                type: 'encryptOnLoginA',
                data: JSON.stringify({
                  clientVault,
                  fileVault,
                  response,
                  userData,
                  psymaxToken,
                }),
              });
              authWorker.onmessage = (message) => {
                const decryptedData = JSON.parse(message.data);
                // console.log(decryptedData);
                setClientVault(decryptedData.setClientVault);
                setFileVault(decryptedData.setFileVault);
                setServerVault(decryptedData.setServerVault);
                setUpdateClientVault(decryptedData.setUpdateClientVault);
                setUpdateFileVault(decryptedData.setUpdateFileVault);
                toast.success(
                  'successfully encrypted Client and Password directories'
                );
              };
            }
          }
          //
          else {
            const authWorker = new Worker();

            if (!operations) {
              alert('Web Crypto is not supported on this browser');
              console.warn('Web Crypto API not supported');
            } else {
              let userData = responseData;
              const response = await axiosInstance.get(`/vault/server`);
              toast('Loading Client and Password Directories');
              const psymaxToken = localStorage.getItem('psymax-token');
              authWorker.postMessage({
                type: 'encryptOnLoginB',
                data: JSON.stringify({
                  clientVault,
                  fileVault,
                  response,
                  userData,
                  psymaxToken,
                }),
              });
              authWorker.onmessage = (message) => {
                const decryptedData = JSON.parse(message.data);

                setClientVault(decryptedData.setClientVault);
                setFileVault(decryptedData.setFileVault);
                setServerVault(decryptedData.setServerVault);
                setUpdateClientVault(decryptedData.setUpdateClientVault);
                setUpdateFileVault(decryptedData.setUpdateFileVault);
                toast.success(
                  'successfully loaded Client and Password directories'
                );
              };
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
    // console.log(
    //   fileVault,
    //   clientVault,
    //   serverVault,
    //   updateClientVault,
    //   updateFileVault
    // );
    if (
      fileVaultLength > 0 &&
      clientVaultLength > 0 &&
      serverVaultLength > 0 &&
      updateFileVaultLength > 0 &&
      updateClientVaultLength > 0
    ) {
      const vaultStateJson = JSON.stringify(vaultState);
      sessionStorage.setItem('vaultState', vaultStateJson);
      // console.log(vaultState);
      if (userData?.isAdmin === 1) {
        router.push('/admin');
      } else if (userData?.isAdmin === 0) {
        router.push(`/twofactorauthentication/${userData._id}-login`);
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
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    router.push(`/accountrecovery`);
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
