require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/data/users');
const connectDB = require('../src/config/db');

async function run() {
  try {
    await connectDB();

    const name = process.argv[2] || 'admin';
    const password = process.argv[3] || 'password123';

    let user = await User.findOne({ name });
    if (user) {
      console.log('User already exists:', name);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, password: hashed, role: 'admin' });
    console.log('Created admin user:', { id: user._id.toString(), name: user.name });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
