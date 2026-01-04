const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const errorHandler = require('./middleWare/errorHandler');


app.use(express.json());

// DEBUG LOG
app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url);
  next();
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);
module.exports = app;
