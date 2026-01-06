const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleWare/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f123abc456"
 *                 name: "Salma"
 *                 role: "user"
 *       401:
 *         description: Not authenticated
 */
router.get(
  '/',
  auth.authenticate,
  userController.getUsers
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       description: Data required to create a new user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: Salsa
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 description: User role
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 */
router.post(
  '/',
  auth.authenticate,
  auth.authorize('admin'),
  userController.addUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (admin or self)
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     requestBody:
 *       required: true
 *       description: Fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: NewName
 *               password:
 *                 type: string
 *                 example: "newPassword123"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  auth.authenticate,
  auth.authorizeOrSelf('admin'),
  userController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: "64f123abc456"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  auth.authenticate,
  auth.authorize('admin'),
  userController.deleteUser
);

module.exports = router;
