import 'tailwindcss/tailwind.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AuthProvider } from '../context/auth.context';
import Head from 'next/head';
import { KlientProvider } from '../context/klient.context';

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

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Toaster position="top-right" />
        <KlientProvider>
          <AuthProvider>
            <Head>
              <meta charSet="utf-8" />
              <link rel="icon" href="/favicon.ico" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
              />
              <meta name="description" content="Psymax" />
              <title>Psymax</title>
            </Head>
            <Component {...pageProps} />
          </AuthProvider>
        </KlientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default MyApp;
