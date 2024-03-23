import MyAppWrap from './AppWrap';
export const metadata = {
  title: 'Psymax',
  description: 'Psymax consultation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MyAppWrap>{children}</MyAppWrap>
      </body>
    </html>
  );
}
