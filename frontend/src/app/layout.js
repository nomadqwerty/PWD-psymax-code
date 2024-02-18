export const metadata = {
  title: "Psymax",
  description: "Psymax consultation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
