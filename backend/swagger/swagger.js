const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Psymax API Documentation',
      version: '1.0.0',
      // description: 'API documentation for Psymax',
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints for user authentication',
      },
      // { name: 'Admin', description: 'Endpoints for admin operations' },
    ],
    servers: [
      {
        url:
          process.env.NODE_ENV === 'development'
            ? process.env.API_HOST_DEV + ':' + process.env.PORT + '/api'
            : process.env.API_HOST_PROD,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-access-token',
        },
      },
    },
  },
  apis: ['./swagger/annotations/*.js'], // Update with the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
