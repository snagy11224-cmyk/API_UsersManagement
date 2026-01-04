const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleWare/authMiddleware');

// GET all users - admin only
router.get('/', auth.authenticate, auth.authorize('admin'), userController.getUsers);

// Create user - admin only (use /auth/register for public signup)
router.post('/', auth.authenticate, auth.authorize('admin'), userController.addUser);

// DELETE user - admin only
router.delete('/:id', auth.authenticate, auth.authorize('admin'), userController.deleteUser);

// UPDATE user - admin or the user themself
router.put('/:id', auth.authenticate, auth.authorizeOrSelf('admin'), userController.updateUser);

module.exports = router;
