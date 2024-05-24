import MyAppWrap from './AppWrap';
//bootstrap imports
import BootstrapClient from '../utils/bootstrap/BootstrapClient';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { SocketContext, socket } from "./context/SocketContext";
import { Container } from 'react-bootstrap';

export const metadata = {
  title: 'Psymax',
  description: 'Psymax consultation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MyAppWrap>
          <Container id="root" className="p-0 m-0" fluid>
            {children}
          </Container>
          <BootstrapClient />
        </MyAppWrap>
      </body>
    </html>
  );
}
