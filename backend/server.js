const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const fs = require("fs");

const key = fs.readFileSync("key.pem", "utf-8");
const cert = fs.readFileSync("cert.pem", "utf-8");

const { Server } = require("socket.io");

const server = https.createServer({ key, cert }, app);

app.use(cors({ origin: "*" }));
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const offers = [];
const connectedSockets = [];
io.on("connection", (socket) => {
  console.log("incoming connection");
  const userName = socket.handshake.auth.userName;
  const accessKey = socket.handshake.auth.accessKey;

  connectedSockets.push({
    socketId: socket.id,
    userName,
    accessKey,
  });

  socket.on("newOffer", (data) => {
    let newOffer = data.offer;
    console.log(data.id, "data");

    console.log(userName, accessKey);
    console.log("received new offer");
    offers.push({
      offererUserName: userName,
      offerAccessKey: accessKey,
      offer: newOffer,
      offerIceCandidates: [],
      answererUserName: null,
      answer: null,
      answererIceCandidates: [],
      callerId: data.id,
    });
    //send out to all connected sockets EXCEPT the caller
    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
  });

  socket.on("newAnswer", (data, ackFunction) => {
    let offerObj = data.offer;
    let answerId = data.answerId;
    let accessKey = data.answererAccessKey;
    const socketToAnswer = connectedSockets.find(
      (s) =>
        s.userName === offerObj.offererUserName &&
        s.accessKey === offerObj.offerAccessKey
    );

    if (!socketToAnswer) {
      console.log("No matching socket");
      return;
    }
    //we found the matching socket, so we can emit to it!
    const socketIdToAnswer = offerObj.callerId;
    console.log(socketIdToAnswer);
    //we find the offer to update so we can emit it
    const offerToUpdate = offers.find(
      (o) =>
        o.offererUserName === offerObj.offererUserName &&
        o.offerAccessKey === offerObj.offerAccessKey
    );

    if (!offerToUpdate) {
      console.log("No OfferToUpdate");
      return;
    }
    //send back to the answerer all the iceCandidates we have already collected
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUserName = userName;
    offerToUpdate.answerId = answerId;
    offerToUpdate.answererAccessKey = accessKey;
    //socket has a .to() which allows emiting to a "room"
    //every socket has it's own room
    console.log("answer emit");
    socket.to(socketIdToAnswer).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { didIOffer, iceUserName, iceCandidate, iceAccessKey } =
      iceCandidateObj;
    // console.log(iceCandidate);
    if (didIOffer) {
      //this ice is coming from the offerer. Send to the answerer
      const offerInOffers = offers.find(
        (o) => o.offerAccessKey === iceAccessKey
      );
      console.log(offerInOffers.answerId, "here");
      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        // 1. When the answerer answers, all existing ice candidates are sent
        // 2. Any candidates that come in after the offer has been answered, will be passed through
        if (offerInOffers.answererAccessKey && offerInOffers.answerId) {
          //pass it through to the other socket
          const socketToSendTo = connectedSockets.find(
            (s) => s.accessKey === offerInOffers.answererAccessKey
          );
          if (socketToSendTo) {
            console.log(offerInOffers.answerId, "answer id");
            socket
              .to(offerInOffers.answerId)
              .emit("receivedIceCandidateFromServer", iceCandidate);
          } else {
            console.log("Ice candidate recieved but could not find answere");
          }
        }
      }
    } else {
      //this ice is coming from the answerer. Send to the offerer
      //pass it through to the other socket
      const offerInOffers = offers.find(
        (o) => o.offerAccessKey === iceAccessKey
      );
      const socketToSendTo = connectedSockets.find(
        (s) => s.accessKey === offerInOffers.answererAccessKey
      );
      if (socketToSendTo && offerInOffers.callerId) {
        console.log(offerInOffers.callerId, "call id");
        socket
          .to(offerInOffers.callerId)
          .emit("receivedIceCandidateFromServer", iceCandidate);
      } else {
        console.log("Ice candidate recieved but could not find offerer");
      }
    }
    // console.log(offers)
  });

  socket.on("addedCallerIce", (data) => {
    if (data.myIce) {
      console.log("received caller ice");
      socket.to(data.fromId).emit("receivedCallerIce", data);
      console.log(data.fromId);
      console.log("sent");
    } else {
      console.log("added caller ice");
      socket.to(data.toId).emit("hasCallerIce", data);
    }
  });
  socket.on("newMessage", (data) => {
    console.log(data, "new message");
    socket.to(data.to).emit("incomingMessage", data);
  });
});

server.listen(3000, () => {
  console.log("signalling server is up");
});
