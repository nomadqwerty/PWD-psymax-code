'use client';
import React from 'react';

//bootstrap imports
import BootstrapClient from '@/utils/bootstrap/BootstrapClient';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { SocketContext, socket } from "./context/SocketContext";
import { Container } from 'react-bootstrap';

export default function RtcLayout({ children }) {
  return (
    <div>
      {/* <div  > */}
      <Container id="root" className="p-0 m-0" fluid>
        {children}
      </Container>
      {/* </div> */}
      <BootstrapClient />
    </div>
  );
}
