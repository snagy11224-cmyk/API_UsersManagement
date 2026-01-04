const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('TRYING TO CONNECT TO:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB FAILED:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
