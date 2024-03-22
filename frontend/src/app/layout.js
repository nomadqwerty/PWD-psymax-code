import Script from 'next/script';
import MyAppWrap from './AppWrap';

export const metadata = {
  title: 'Psymax',
  description: 'Psymax consultation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script defer src="/idb.js"></Script>
      </head>
      <body>
        <MyAppWrap>{children}</MyAppWrap>
      </body>
    </html>
  );
}
