import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

//bootstrap imports
import BootstrapClient from "@/utils/bootstrap/BootstrapClient";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { SocketContext, socket } from "./context/SocketContext";
import { Container } from "react-bootstrap";
import { ChatProvider } from "@/Components/Chat/ChatContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Psymax",
  description: "Psymax video chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
          <Container id="root" className="p-0 m-0" fluid>
          <ChatProvider> 
            {children}
          </ChatProvider>
          </Container>
          <div id="portal"></div>
        <BootstrapClient />
      </body>
    </html>
  );
}
