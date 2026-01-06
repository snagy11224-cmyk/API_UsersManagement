const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User management API with JWT authentication and role-based access control',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      parameters: {
        AuthorizationHeader: {
          name: 'Authorization',
          in: 'header',
          description: "Bearer token for authentication. Use 'Bearer <token>'",
          required: false,
          schema: {
            type: 'string',
            example: 'Bearer <your_token_here>'
          }
        }
      }
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, 'routes/*.js')],
};

let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(options);
  console.log('Swagger spec generated successfully');
} catch (err) {
  console.error('ERROR generating Swagger spec:', err.message);
  swaggerSpec = { openapi: '3.0.0', info: { title: 'Error', version: '1.0.0' }, paths: {} };
}

module.exports = swaggerSpec;
