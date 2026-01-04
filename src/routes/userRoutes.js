const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleWare/authMiddleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [user, admin]
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 */
router.get('/', auth.authenticate, auth.authorize('admin'), userController.getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *             required:
 *               - name
 *               - password
 *     responses:
 *       201:
 *         description: User created
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 */
router.post('/', auth.authenticate, auth.authorize('admin'), userController.addUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: User not found
 */
router.delete('/:id', auth.authenticate, auth.authorize('admin'), userController.deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (admin or self)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put('/:id', auth.authenticate, auth.authorizeOrSelf('admin'), userController.updateUser);

module.exports = router;
