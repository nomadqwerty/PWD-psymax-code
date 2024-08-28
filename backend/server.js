const {
  onJoinRoom,
  onCreateRtcTransport,
  getProducers,
  transportConnect,
  transportProduce,
  createRcvTransport,
  rcvTransportConnect,
  onConsume,
  onDisconnect,
  onDeleteReceiver,
  onResumeConsumer,
  onStoppedScreen,
  onNewMessage,
  onToggleMedia,
} = require('./utils/socketHandlers');
const {
  findRoom,
  createWorker,
  createRoomRouters,
  createRtcTransport,
  findParticipant,
} = require('./utils/mediaSoupUtils');

const rtcHandler = (io) => {
  const conferences = [];
  const workers = [];

  createWorker()
    .then((res) => workers.push(res))
    .catch((err) => console.log(err.message));

  setInterval(() => {
    console.log('creating new worker...');
    workers = [];
    createWorker()
      .then((res) => workers.push(res))
      .catch((err) => console.log(err.message));
    console.log('created new worker');
    console.log('clearing conferences...');
    console.log(conferences.length);
    conferences = [];
    console.log('cleared conferences');
    console.log(conferences.length);
  }, 7200000);

  return async (socket) => {
    try {
      let socketLog = null;
      //listen for roomAccesskey event on socket join and add socket to the provided acceskey
      socketLog?.log('some one connected', socket.id);
      socket.on('disconnect', onDisconnect(conferences, socket));
      socket.on('disconnected', onDisconnect(conferences, socket));
      // join room;
      socket.on(
        'joinConferenceRoom',
        onJoinRoom(findRoom, createRoomRouters, conferences, workers, socket)
      );

      // createWebRtcTransport
      socket.on(
        'createWebRtcTransport',
        onCreateRtcTransport(
          findRoom,
          findParticipant,
          createRtcTransport,
          conferences
        )
      );

      // Return all available producers.
      socket.on(
        'getAvailableProducers',
        getProducers(conferences, findRoom, findParticipant)
      );

      // Rtc producer transport handler;
      // connect
      socket.on(
        'transport-connect',
        transportConnect(conferences, findRoom, findParticipant)
      );
      // produce
      socket.on(
        'transport-produce',
        transportProduce(conferences, findRoom, findParticipant, socket)
      );

      // Rtc producer transport handler;
      // rcv tp
      socket.on(
        'createRcvTransport',
        createRcvTransport(conferences, findRoom, findParticipant)
      );

      // delete rcv Transport
      socket.on(
        'deleteRcvTransport',
        onDeleteReceiver(conferences, findRoom, findParticipant)
      );

      // rcv connect
      socket.on(
        'transport-recv-connect',
        rcvTransportConnect(conferences, findRoom, findParticipant)
      );
      // rcv consume
      socket.on('consume', onConsume(conferences, findRoom, findParticipant));

      // resume consume;
      socket.on(
        'consumerResume',
        onResumeConsumer(conferences, findRoom, findParticipant)
      );

      // delete screen consumers
      socket.on(
        'stoppedScreenShare',
        onStoppedScreen(conferences, findRoom, socket, findParticipant)
      );

      // BC message to room
      socket.on('newMessage', onNewMessage(socket, findRoom, conferences));

      // media controls.
      socket.on(
        'toggleMedia',
        onToggleMedia(socket, conferences, findRoom, findParticipant)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
};

module.exports = { rtcHandler };
