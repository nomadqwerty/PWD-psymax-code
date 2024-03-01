const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authenticateJWT = require('./middleware/auth');
const routes = require('./routes');
const routesVault = require('./routesVault');
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

dotenv.config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const { PORT, DB_URL } = process.env;

const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details using the requestLogger
  requestLogger.error(`[${req.method}] ${req.url} - Error: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

async function connectToDatabase() {
  try {
    // TODO: fix DB url string.
    let newDB_URL = DB_URL.replace('/mongodb:', '/localhost:');
    await mongoose.connect(newDB_URL, {
      useNewUrlParser: true,
    });
    console.log(`Connected to ${DB_URL}`);
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
  console.log('here');
  next();
});
const publicUploadsDirectory = path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(publicUploadsDirectory));

// app.use(authenticateJWT);

// Use the setupLogoStorage function to set up multer for logo uploads
const upload = setupLogoStorage();
app.post('/api/saveLogo', upload.single('logo'), saveLogo);

// Use the setupEmailStorage function to set up multer for email attachments
const emailUpload = setupEmailStorage();
app.post('/api/email/send', emailUpload.array('attachments'), send);

app.use(express.json());

// Use the routes with the "/api" prefix
app.use('/api', routes);
app.use('/api', routesVault);

// Use the request error logger middleware globally
app.use(errorMiddleware);

const server = http.createServer(app);

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

server.listen(PORT || 4000, () => console.log(`Listening on port ${PORT}`));
