const jwt = require('jsonwebtoken');
const { TimeForTokenExpire } = require('../utils/constants');

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  const excludeRoutes = [
    '/api/register',
    '/api/login',
    '/api/webhooks/checkout',
  ];

  if (excludeRoutes.includes(req.path)) {
    // Skip authentication for these routes
    return next();
  }

  if (!token) {
    let response = {
      status_code: 403,
      message: 'A token is required for authentication',
    };
    return res.status(403).send(response);
  }
  try {
    const decoded = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    if (decoded.exp - currentTime <= TimeForTokenExpire) {
      req.user = decoded;
    } else {
      let response = {
        status_code: 401,
        message: 'Token Expired',
      };
      return res.status(401).send(response);
    }
  } catch (err) {
    let response = {
      status_code: 401,
      message: 'Token Expired',
    };
    return res.status(401).send(response);
  }
  return next();
};

module.exports = verifyToken;
