'use client';

import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import CssTextField from '../../components/CssTextField';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axios';
import { SOMETHING_WRONG } from '../../utils/constants';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { handleApiError } from '../../utils/apiHelpers';
import { decryptData, deriveAllKeys, encryptData } from '@/utils/utilityFn';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { dispatch } = useContext(AuthContext);

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      console.log(process.env.NEXT_PUBLIC_API_HOST);
      const response = await axiosInstance.post(`/login`, data);
      const responseData = response?.data?.data;
      if (response?.status === 200) {
        console.log(responseData);
        const user_id = responseData._id;
        const vaultRes = await axiosInstance.get(`/vault/user/${user_id}`);
        if (vaultRes?.status === 200) {
          const vaultResData = vaultRes?.data?.data;
          console.log(vaultResData);
          const operations = window.crypto.subtle || window.crypto.webkitSubtle;
          if (!vaultResData.isEncrypted) {
            console.log(vaultResData.isEncrypted);

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
                console.log('login');
                let allKeys = await deriveAllKeys(
                  pass,
                  ePass,
                  dualKeySalt,
                  masterKeySalt,
                  window
                );
                let keysLength = Object.keys(allKeys).length;

                if (keysLength > 0) {
                  console.log(allKeys);
                  const {
                    masterKey,
                    backUpMasterKey,
                    iv,
                    backUpIv,
                    dualKeyOne,
                    dualKeyTwo,
                  } = allKeys;

                  const passwordDirectory = {
                    fileName: '',
                    fileReference: '',
                    fileKey: '',
                  };
                  const backUpPasswordDirectory = { ...passwordDirectory };
                  const passDirEnc = await encryptData(
                    operations,
                    masterKey,
                    iv,
                    passwordDirectory
                  );
                  const backUpPassDirEnc = await encryptData(
                    operations,
                    backUpMasterKey,
                    backUpIv,
                    backUpPasswordDirectory
                  );
                  console.log(passDirEnc, backUpPassDirEnc);
                  const passUintArr = new Uint8Array(passDirEnc);
                  const backUpPassUintArr = new Uint8Array(backUpPassDirEnc);
                  let encVault = { ...vaultResData };
                  encVault.passwords = Array.from(passUintArr);
                  encVault.backupPasswords = Array.from(backUpPassUintArr);
                  encVault.isEncrypted = true;
                  console.log(encVault);
                  const resVault = await axiosInstance.post(
                    `/vault/user/update`,
                    encVault
                  );
                  console.log(resVault);
                  // TODO: add (dec) vault to state, add keys to ram.
                }
              }
            }
          } else {
            if (!operations) {
              alert('Web Crypto is not supported on this browser');
              console.warn('Web Crypto API not supported');
            } else {
              console.log('vault encrypted');
              let userData = responseData;
              const response = await axiosInstance.get(`/vault/server`);
              let vault = response.data.data;
              let pass = userData.password;
              let ePass = userData.emergencyPassword;
              let dualKeySalt = vault.dualKeySalt;
              let masterKeySalt = vault.masterKeySalt;
              if (ePass) {
                // TODO: derive dualkeys and master keys.
                console.log('login');
                let allKeys = await deriveAllKeys(
                  pass,
                  ePass,
                  dualKeySalt,
                  masterKeySalt,
                  window
                );
                let keysLength = Object.keys(allKeys).length;

                if (keysLength > 0) {
                  console.log(allKeys);
                  const {
                    masterKey,
                    backUpMasterKey,
                    iv,
                    backUpIv,
                    dualKeyOne,
                    dualKeyTwo,
                  } = allKeys;
                  const encPassDir = new Uint8Array(
                    vaultResData.passwords.data
                  );
                  console.log(encPassDir);
                  let passDirDec = await decryptData(
                    operations,
                    masterKey,
                    iv,
                    encPassDir
                  );
                  console.log(passDirDec);
                  // TODO: add vault to state, add keys to ram.
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
        // if (responseData?.isAdmin === 1) {
        //   router.push('/admin');
        // } else {
        //   router.push('/dashboard');
        // }
      } else {
        toast.error(SOMETHING_WRONG);
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };
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

// useEffect(() => {
//   const operations = window.crypto.subtle || window.crypto.webkitSubtle;
//   if (!operations) {
//     alert('Web Crypto is not supported on this browser');
//     console.warn('Web Crypto API not supported');
//   } else {
//     (async () => {
//       // TODO: request server vault.
//       let userLoginData = localStorage.getItem('userData');

//       if (userLoginData !== undefined) {
//         userLoginData = JSON.parse(userLoginData);
//         if (typeof userLoginData === 'string') {
//           userLoginData = JSON.parse(userLoginData);
//         }
//       }
//       const response = await axiosInstance.get(`/vault/server`);
//       let vault = response.data.data;
//       let userData = userLoginData;
//       let pass = userData.password;
//       let ePass = userData.emergencyPassword;
//       let dualKeySalt = vault.dualKeySalt;
//       let masterKeySalt = vault.masterKeySalt;
//       console.log(userData);

//       if (ePass) {
//         // TODO: derive dualkeys and master keys.
//         console.log('accounts set');
//         let allKeys = await deriveAllKeys(
//           pass,
//           ePass,
//           dualKeySalt,
//           masterKeySalt,
//           window
//         );
//         let keysLength = Object.keys(allKeys).length;

//         if (keysLength > 0) {
//           const {
//             masterKey,
//             backUpMasterKey,
//             iv,
//             backUpIv,
//             dualKeyOne,
//             dualKeyTwo,
//           } = allKeys;
//           setMasterKey(masterKey);
//           setMasterKeyBackUp(backUpMasterKey);
//           setIv(iv);
//           setIvBackUp(backUpIv);
//           setOperations(operations);
//         }
//       }
//     })();
//   }
// }, [state]);
////////////////////////////////
