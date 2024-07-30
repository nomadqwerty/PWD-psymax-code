const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authenticateJWT = require('./middleware/auth');
const routes = require('./routes');
const routesVault = require('./routesVault');
const fileRoutes = require('./fileRoutes');
const meetingScheduleRoutes = require('./meetingRoutes');
const path = require('path');
const { saveLogo } = require('./controllers/auth');
const seedBriefData = require('./seeders/brief');
const { send } = require('./controllers/email');
const { setupLogoStorage, setupEmailStorage } = require('./utils/multerSetup');
const {
  requestLoggerMiddleware,
  requestLogger,
  errorMiddleware,
} = require('./utils/logger');
const { Server } = require('socket.io');
const { rtcHandler } = require('./server');

// const {
//   dailyQueue,
//   processBonusCycleReset,
//   processNonCommittedUserDelete,
// } = require('./payment/queues/subscription');

dotenv.config({
  path: path.join(__dirname, './config.env'),
});

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const { PORT, DB_URL } = process.env;

const app = express();

// Process the daily task
// dailyQueue.process(processBonusCycleReset);
// dailyQueue.process(processNonCommittedUserDelete);

// Error handling middleware
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  debug: true,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', rtcHandler());

app.use((err, req, res, next) => {
  // Log error details using the requestLogger
  requestLogger.error(`[${req.method}] ${req.url} - Error: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
    });
    console.log(DB_URL);

    // Run seeder after connecting to the database
    await seedBriefData();
    console.log('Seeder executed successfully');
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

// Use the request logger middleware globally
app.use(requestLoggerMiddleware);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://psymax.de',
  'https://psymax.de/api/',
  'https://34.175.225.136/',
];

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

app.use(
  '/api/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Psymax API Documentation',
  })
);

// app.use('/public', express.static(__dirname + '/public'));
app.use('*', (req, res, next) => {
  console.log('Pymax API.');
  next();
});
const publicUploadsDirectory = path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(publicUploadsDirectory));

app.use(express.json({ limit: '5000kb' }));
app.use((req, res, next) => {
  authenticateJWT(req, res, next);
});

// Use the setupLogoStorage function to set up multer for logo uploads
const upload = setupLogoStorage();
app.post('/api/saveLogo', upload.single('logo'), saveLogo);

// Use the setupEmailStorage function to set up multer for email attachments
const emailUpload = setupEmailStorage();
app.post('/api/email/send', emailUpload.array('attachments'), send);

// Use the routes with the "/api" prefix
app.use('/api', routes);
app.use('/api', routesVault);
app.use('/api', fileRoutes);
app.use('/api', meetingScheduleRoutes);

// Use the request error logger middleware globally
app.use(errorMiddleware);

// const server = http.createServer(app);

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server gracefully shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server gracefully shut down');
    process.exit(0);
  });
});
process.on('uncaughtException', (error) => {
  console.log(error.message);
});
process.on('unhandledRejection', (error) => {
  console.log(error.message);
});

server.listen(PORT || 4000, () => console.log(`Listening on port ${PORT}`));

module.exports = { server };
