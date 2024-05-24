'use client';
import 'tailwindcss/tailwind.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Head from 'next/head';
import { AuthProvider } from '../context/auth.context';
import { KlientProvider } from '../context/klient.context';
import { ProviderKonto } from '../context/konto.context';
('');
import '../../public/styles/globals.css';
import '../../public/styles/custom.css';

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
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Toaster position="top-right" />
        <KlientProvider>
          <AuthProvider>
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
          </AuthProvider>
        </KlientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default MyAppWrap;
