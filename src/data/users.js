const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  password: {
  type: String,
  required: true,
  minlength: 6
}

  ,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

});

module.exports = mongoose.model('User', userSchema);
