const User = require('../data/users');

// GET all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// POST user
exports.addUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err); 
  }
};


// DELETE user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'User deleted', user });
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};
