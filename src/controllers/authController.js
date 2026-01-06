const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../data/users');

exports.register = async (req, res) => {
  const { name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save user with the provided role (if not provided, default to 'user')
  const user = await User.create({
    name,
    password: hashedPassword,
    role: role || 'user', 
  });
  const token = jwt.sign(
    { id: user._id.toString(), role: role || 'user' }, 
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  console.log('Generated token for register:', token); 
  res.status(201).json({ token });
};


    
exports.login = async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // compare
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
};
