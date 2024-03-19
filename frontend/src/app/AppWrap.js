'use client';
import 'tailwindcss/tailwind.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Head from 'next/head';
import { AuthProvider } from '@/context/auth.context';
import { KlientProvider } from '@/context/klient.context';
import { ProviderKonto } from '@/context/konto.context';
import { VaultProvider } from '@/context/vault.context';
import { registerSW } from '@/utils/pwaUtils';
import axiosInstance from '@/utils/axios';
import { deriveAllKeys, encryptData } from '@/utils/utilityFn';

import '../../public/styles/globals.css';
import '../../public/styles/custom.css';
import { useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3C3C3C',
    },
    primary_light: {
      main: '#44A6A7',
    },
    primary_lite: {
      main: '#1E9091',
    },
    whiteBtn: {
      main: '#FFFFFF',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

function MyAppWrap({ Component, pageProps, children }) {
  const [intervalId, setIntervalId] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [registeredServiceWorker, setRegisteredServiceWorker] = useState(false);
  useEffect(() => {
    if (navigator) {
      registerSW(navigator)
        .then((e) => {
          console.log('registered');
          setRegisteredServiceWorker(true);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, []);

  useEffect(() => {
    let statusChecker;
    if (registeredServiceWorker === true) {
      statusChecker = setInterval(async () => {
        let networkStatus;
        console.log('check');
        if (navigator.onLine === true) {
          networkStatus = true;
          if (isOffline === true) {
            setIsOffline(false);
          }
        } else if (navigator.onLine === false) {
          networkStatus = false;
          if (isOffline === false) {
            setIsOffline(true);
          }
        } else if (navigator.onLine === undefined) {
          axiosInstance.get(`/vault/user/status`).then((res) => {
            if (res.status.startsWith('40')) {
              networkStatus = false;
              if (isOffline === false) {
                setIsOffline(true);
              }
            }
          });
        }
      }, 10000);
    }

    if (statusChecker !== undefined) {
      setIntervalId(statusChecker);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOffline, registeredServiceWorker]);
  useEffect(() => {
    const syncManager = window.SyncManager;
    if (isOffline === true && syncManager !== undefined) {
      console.log(isOffline, syncManager);
      (async () => {
        if (isOffline === true) {
          // TODO: encrypt data and register BG sync task.
          let fileVault = localStorage.getItem('fileVault');
          let clientVault = localStorage.getItem('clientVault');
          let serverVault = localStorage.getItem('serverVault');
          let updateFileVault = localStorage.getItem('updateFileVault');
          let updateClientVault = localStorage.getItem('updateClientVault');
          let userData = localStorage.getItem('psymax-user-data');
          if (
            fileVault &&
            clientVault &&
            serverVault &&
            updateFileVault &&
            updateClientVault &&
            userData
          ) {
            fileVault = JSON.parse(fileVault);
            clientVault = JSON.parse(clientVault);
            serverVault = JSON.parse(serverVault);
            updateFileVault = JSON.parse(updateFileVault);
            updateClientVault = JSON.parse(updateClientVault);
            userData = JSON.parse(userData);
            // TODO: encrypt update vault.
            const operations =
              window.crypto.subtle || window.crypto.webkitSubtle;
            let pass = userData.password;
            let ePass = userData.emergencyPassword;
            let dualKeySalt = serverVault.dualKeySalt;
            let masterKeySalt = serverVault.masterKeySalt;

            let allKeys = await deriveAllKeys(
              pass,
              ePass,
              dualKeySalt,
              masterKeySalt,
              window
            );
            let keysLength = Object.keys(allKeys).length;
            console.log(allKeys);
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

              const fileUpdateEnc = await encryptData(
                operations,
                masterKey,
                iv,
                updateFileVault
              );
              let fileUpdateUint = new Uint8Array(fileUpdateEnc);

              const clientUpdateEnc = await encryptData(
                operations,
                masterKey,
                iv,
                updateClientVault
              );
              let clientUpdateUint = new Uint8Array(clientUpdateEnc);

              // TODO: send update store enc vault, use bgSync to schedule the request.

              if (fileUpdateUint && clientUpdateUint) {
                let readySw = await window.navigator.serviceWorker.ready;
                if (readySw) {
                  localStorage.setItem(
                    'encryptedFileUpdateVault',
                    // SON.stringify({ data: fileUpdateUint }) - pass
                    JSON.stringify({ data: fileUpdateUint })
                  );

                  localStorage.setItem(
                    'encryptedClientUpdateVault',
                    JSON.stringify({ data: clientUpdateUint })
                  );

                  readySw.sync.register('updateVaultRequest');
                  console.log('set bg task');
                }
              }

              //  let fileRes = await axiosInstance.post(`/vault/user/update/main`, {
              //     userId: userData._id,
              //     type: 'update',
              //     passwords: Array.from(fileUpdateUint),
              //     vault: 'file',
              //   });
              //  let clientRes = await axiosInstance.post(`/vault/user/update/main`, {
              //     userId: userData._id,
              //     type: 'update',
              //     passwords: Array.from(clientUpdateUint),
              //     vault: 'client',
              //   });

              // if(fileRes.status === '200' && clientRes.status === 200){
              //   isUpdated = true;
              // }
            }
          }
        }
      })();
    }
  }, [isOffline]);
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Toaster position="top-right" />
        <KlientProvider>
          <AuthProvider>
            <VaultProvider>
              <ProviderKonto>
                <Head>
                  <meta charSet="utf-8" />
                  <link rel="icon" href="/favicon.svg" />
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                  />
                  <meta name="description" content="Psymax" />
                  <title>Psymax</title>
                </Head>
                {children}
              </ProviderKonto>
            </VaultProvider>
          </AuthProvider>
        </KlientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default MyAppWrap;

/* 

*/
