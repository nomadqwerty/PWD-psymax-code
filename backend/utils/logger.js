const winston = require('winston');
const { getFormattedDate } = require('./common');

const todayDate = new Date();
const formattedDate = getFormattedDate(todayDate);

// Set up Winston logger for all log levels
const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `./logs/${formattedDate}.log`,
    }),
  ],
});

// Middleware for logging requests and errors
const requestLoggerMiddleware = (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    // Log request details
    logger.info({
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      body: req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  next();
};

// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
  console.log('err', err);
  // Log error details
  logger.error({
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    error: err.message,
    stack: err.stack,
  });
  // Call next to ensure the error is propagated
  next(err);
};

module.exports = { requestLoggerMiddleware, errorMiddleware, logger };
