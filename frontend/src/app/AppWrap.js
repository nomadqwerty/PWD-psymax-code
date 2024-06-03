'use client';
import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Head from 'next/head';
import { AuthProvider } from '../context/auth.context';
import { KlientProvider } from '../context/klient.context';
import { ClientProvider } from '../context/client.context';
import { ProviderKonto } from '../context/konto.context';
import { VaultProvider } from '../context/vault.context';
import { registerSW } from '../utils/pwaUtils';
import VaultSession from './VaultSession';
import { useRouter, usePathname } from 'next/navigation';

import ConnectionChecker from './ConnectionCheck';

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
  const router = useRouter();
  const pathname = usePathname();
  const [registeredServiceWorker, setRegisteredServiceWorker] = useState(false);
  useEffect(() => {
    if (navigator) {
      registerSW(navigator)
        .then((e) => {
          setRegisteredServiceWorker(true);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      if (!pathname.includes('login') || !pathname.includes('logout')) {
        console.log('page reload');
        event.preventDefault();
        return true;
      }
      // show warning popup on page reload.
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Toaster position="top-right" />
        <KlientProvider>
          <AuthProvider>
            <VaultProvider>
              <ProviderKonto>
                <ClientProvider>
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
                  <VaultSession>
                    <ConnectionChecker
                      registeredServiceWorker={registeredServiceWorker}
                    >
                      {children}
                    </ConnectionChecker>
                  </VaultSession>
                </ClientProvider>
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
