const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

let swaggerUi, swaggerSpec;
try {
  swaggerUi = require('swagger-ui-express');
  swaggerSpec = require('./swagger');
  console.log('Swagger dependencies loaded successfully');
} catch (err) {
  console.error('ERROR loading Swagger:', err.message);
  swaggerUi = null;
  swaggerSpec = null;
}

const app = express();
console.log('APP.JS LOADED');
const errorHandler = require('./middleWare/errorHandler');


app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});


// DEBUG LOG
app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url);
  next();
});

// Swagger UI
if (swaggerUi && swaggerSpec) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI mounted at /api-docs');
} else {
  console.warn('Swagger UI not available');
}


app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route Not Found' });
});

app.use(errorHandler);
module.exports = app;
