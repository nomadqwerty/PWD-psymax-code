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
  useEffect(() => {
    let statusChecker;
    if (navigator) {
      registerSW(navigator)
        .then((e) => {
          console.log('registered');
          statusChecker = setInterval(() => {
            let networkStatus;
            if (navigator.onLine === true) {
              networkStatus = true;
            } else if (navigator.onLine === false) {
              networkStatus = false;
            } else if (navigator.onLine === undefined) {
              axiosInstance.get(`/vault/user/status`).then((res) => {
                if (res.status.startsWith('40')) {
                  networkStatus = false;
                }
              });
            }
            console.log(networkStatus);
            if (networkStatus === false) {
              // TODO: encrypt data and register BG sync task
            }
          }, 15000);
          setIntervalId(statusChecker);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
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
