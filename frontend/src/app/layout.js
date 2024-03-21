import Script from 'next/script';
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
      <body>{children}</body>
    </html>
  );
}
