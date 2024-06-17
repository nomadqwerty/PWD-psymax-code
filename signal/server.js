// import {Server} from "socket.io";
// import express from 'express';
// import { createServer } from 'node:http';
const express = require('express');
const fs = require('fs/promises');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
// import { fileURLToPath } from 'node:url';
// import {dirname, join} from 'node:path';
// import { Server } from "socket.io";
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const cors = require('cors'); // Import the cors middleware
const PORT = process.env.PORT || 3050;

// async function main() {
// open the database file
// const db = await open({
//   filename: "chat.db",
//   driver: sqlite3.Database,
// });

// create our 'messages' table (you can ignore the 'client_offset' column for now)
//   await db.exec(`
//   CREATE TABLE IF NOT EXISTS messages (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_offset TEXT UNIQUE,
//       content TEXT
//   );
// `);

// const express = require('express');
const app = express();
const corsOptions = {
  /* origin: function (origin, callback) {
    // Check if the request origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, */
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable passing cookies, authorization headers, etc.
};

app.use(cors(corsOptions));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  console.log('req');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  debug: true,
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
  origins: '*',
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Origin': '*', //or the specific origin you want to give access to,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

//   const corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));
app.use(cors()); // Use cors middleware for all routes

// app.get('/',(req,res) => {
//     res.send('<h1>Damn we getting into the backend</h1>');
// });
// const __dirname = dirname(fileURLToPath(import.meta.url));

//get chatapp directory and ouput selected file
// app.get('/chatapp', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });

//get homepage and output file
// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'HomePage.js'));
// });

// Initialize a counter for connected clients
let connectedClients = 0;
let roomAccessKey;

io.on('connection', async (socket) => {
  console.log('connection');
  //listen for roomAccesskey event on socket join and add socket to the provided acceskey
  socket.on('roomAccessKey', (data) => {
    const { roomToJoin, clientName } = data;
    try {
      roomAccessKey = roomToJoin;
      socket.join(roomToJoin);
      // console.log("joined room",roomToJoin)
      socket.broadcast.to(roomToJoin).emit('newUserJoined', {
        userSocketID: socket.id,
        room: roomToJoin,
        remoteName: clientName,
      });
    } catch (e) {
      console.log('could not join roomAccessKey', e);
    }
  });

  socket.on('localClientName', (data) => {
    try {
      console.log('local user', data, 'joined room', roomAccessKey);
      socket.broadcast
        .to(roomAccessKey)
        .emit('remoteName', { remoteName: data });
    } catch (e) {
      console.log('could not emit remotename', e);
    }
  });

  // return all Socket instances of the main namespace
  // const sockets = await io.fetchSockets();

  //       for (const socket of sockets) {
  //         console.log(socket.id);
  //         console.log(socket.handshake);
  //         console.log(socket.rooms);
  //         console.log(socket.data);
  //       }

  // Increment the counter when a new client connects
  connectedClients++;
  console.log(
    socket.id + ' connected. Total connected clients:',
    connectedClients
  );

  // Listen for sendoffer event and forward to recepient
  socket.on('sendMessage', (data) => {
    // get data of socket who initiated sendMessage { recipientId, message }
    const { userID, roomAccessKey, text } = data;

    // Send the message to the a user who just joined the server
    socket.broadcast
      .to(roomAccessKey)
      .emit('incomingMsg', { userID: socket.id, text });
  });

  socket.on('chat message', (data) => {
    const { msg, clientOffset, roomAccessKey, clientName } = data;
    console.log('message from: ', msg, clientOffset, 'room', roomAccessKey);

    io.to(roomAccessKey).emit('chat message', {
      msg: msg,
      serverOffset: clientOffset,
      clientName: clientName,
    });
  });

  socket.on('disconnect', () => {
    connectedClients--;
    console.log(
      socket.id + ' disconnected. Total connected clients:',
      connectedClients
    );
    socket.broadcast
      .to(roomAccessKey)
      .emit('userDisconnected', { userID: socket.id });
  });

  socket.on('remote-camera', (data) => {
    const { roomAccessKey, cameraState } = data;
    if (cameraState == 'off' || false) {
      console.log('user off cam', data);
    } else {
      console.log('user ON cam', data);
    }
    socket.broadcast.to(roomAccessKey).emit('remote-camera', cameraState);
  });

  // socket.on("hello", async (data) => {
  //     // Assuming data contains { recipientId, message }
  //     // const { recipientId, message } = data;
  //     // Send the message to the recipient
  //     // io.emit("incomingMessage", data);

  //     //   socket.on('chat message', async (msg, clientOffset, callback) => {
  //     console.log('message: ' + data);
  //   });
});

// io.compress(true);

server.listen(PORT, async () => {
  await fs.writeFile('path.txt', String(PORT));
  console.log(`My server is actively running on port ${PORT}`);
});
// }

// main();
