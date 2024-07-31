/**
 * @swagger
 * paths:
 *   /rooms:
 *     post:
 *       summary: Create or join a room
 *       tags:
 *         - Rooms
 *       requestBody:
 *         description: Room data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomToJoin:
 *                   type: string
 *                 clientName:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /localClientName:
 *     post:
 *       summary: Set local client name
 *       tags:
 *         - Clients
 *       requestBody:
 *         description: Client name data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientName:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /sendMessage:
 *     post:
 *       summary: Send a message
 *       tags:
 *         - Messages
 *       requestBody:
 *         description: Message data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userID:
 *                   type: string
 *                 roomAccessKey:
 *                   type: string
 *                 text:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /chatMessage:
 *     post:
 *       summary: Send a chat message
 *       tags:
 *         - Messages
 *       requestBody:
 *         description: Chat message data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 clientOffset:
 *                   type: number
 *                 roomAccessKey:
 *                   type: string
 *                 clientName:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /remoteCamera:
 *     post:
 *       summary: Toggle remote camera state
 *       tags:
 *         - Devices
 *       requestBody:
 *         description: Camera state data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomAccessKey:
 *                   type: string
 *                 cameraState:
 *                   type: boolean
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /retryRtcConnection:
 *     post:
 *       summary: Retry RTC connection
 *       tags:
 *         - WebRTC
 *       requestBody:
 *         description: Retry RTC connection data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /createdNewAnswer:
 *     post:
 *       summary: Notify creation of a new answer
 *       tags:
 *         - WebRTC
 *       requestBody:
 *         description: New answer data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /retryRtcConnectionFull:
 *     post:
 *       summary: Retry full RTC connection
 *       tags:
 *         - WebRTC
 *       requestBody:
 *         description: Retry full RTC connection data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /createRoom:
 *     post:
 *       summary: Create a new Mediasoup room
 *       tags:
 *         - Mediasoup
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /joinRoom:
 *     post:
 *       summary: Join an existing Mediasoup room
 *       tags:
 *         - Mediasoup
 *       requestBody:
 *         description: Join room data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /setClientProduce:
 *     post:
 *       summary: Set client producer
 *       tags:
 *         - Mediasoup
 *       requestBody:
 *         description: Client produce data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /setHostConsume:
 *     post:
 *       summary: Set host consumer
 *       tags:
 *         - Mediasoup
 *       requestBody:
 *         description: Host consume data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /createWebRtcTransport:
 *     post:
 *       summary: Create a WebRTC transport
 *       tags:
 *         - WebRTC
 *       requestBody:
 *         description: WebRTC transport data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sender:
 *                   type: boolean
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /getProducers:
 *     post:
 *       summary: Get producers information
 *       tags:
 *         - Mediasoup
 *       requestBody:
 *         description: Producer data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sender:
 *                   type: boolean
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /transport-produce:
 *     post:
 *       summary: Produce a transport
 *       tags:
 *         - Mediasoup
 *       requestBody:
 *         description: Transport produce data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kind:
 *                   type: string
 *                 rtpParameters:
 *                   type: object
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /transport-recv-connect:
 *     post:
 *       summary: Connect to a transport
 *       tags:
 *         - Mediasoup
 *       requestBody:
 *         description: Transport connect data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dtlsParameters:
 *                   type: object
 *       responses:
 *         200:
 *           description: Successful
 *         500:
 *           description: Internal server error
 */
