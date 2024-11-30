// const express = require("express");
// const router = express.Router();
// const userController = require("./user.controller");

// router.post("/update/:id", userController.updateUser);
// router.get("/all", userController.getAllUser);
// router.get("/:id", userController.getUserById);
// router.get("/:mssv", userController.getUserByMssv);
// router.get("/:email", userController.getUserByEmail);
// router.delete("/:id", userController.deleteUser);

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("./user.controller");

/**
 *
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - name
 *         - mssv
 *         - password
 *         - email
 *         - pageBalance
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         mssv:
 *           type: string
 *           description: The student ID (MSSV) of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         pageBalance:
 *           type: integer
 *           description: Page balance available for printing
 *       example:
 *         name: John Doe
 *         mssv: 12345678
 *         password: password123
 *         email: johndoe@example.com
 *         pageBalance: 100
 *
 *     LoginUserDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         email: johndoe@example.com
 *         password: password123
 *
 *     UpdateUserDto:
 *       type: object
 *       required:
 *         - name
 *         - pageBalance
 *         - mssv
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         pageBalance:
 *           type: integer
 *           description: Page balance available for printing
 *         mssv:
 *           type: string
 *           description: The student ID (MSSV) of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         name: John Doe
 *         pageBalance: 150
 *         mssv: 12345678
 *         password: newpassword123
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /user/update/{id}:
 *   post:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/update/:id", userController.updateUser);

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CreateUserDto'
 *       500:
 *         description: Server error
 */
//! IF - CHECK ROLE ADMIN
// router.get("/all", isAdmin, userController.getAllUser);
router.get("/all", userController.getAllUser);

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: My profile
 *       500:
 *         description: Server error
 */
router.get("/me", userController.getMyProfile);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserDto'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /user/mssv/{mssv}:
 *   get:
 *     summary: Get a user by MSSV
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: mssv
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID (MSSV) of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserDto'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/mssv/:mssv", userController.getUserByMssv);

/**
 * @swagger
 * /user/email/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserDto'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/email/:email", userController.getUserByEmail);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 * /user/page-balance/{mssv}:
 *   get:
 *     summary: Get the page balance of a user by mssv
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: mssv
 *         schema:
 *           type: integer
 *         required: true
 *         description: The mssv of the user
 *     responses:
 *       200:
 *         description: The page balance of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pageBalance:
 *                   type: integer
 *                   description: The page balance of the user
 *       404:
 *         description: Page balance not found
 *       500:
 *         description: Server error
 */
router.get("/page-balance/:mssv", userController.getPageBalance);


/**
 * @swagger
 * /user/update-page-balance/{mssv}:
 *   patch:
 *     summary: Update page balance for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: mssv
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student ID (mssv) of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageBalance:
 *                 type: integer
 *                 description: The new page balance value to update
 *                 example: 100
 *     responses:
 *       200:
 *         description: Page balance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     mssv:
 *                       type: integer
 *                       example: 12345
 *                     pageBalance:
 *                       type: integer
 *                       example: 100
 *       400:
 *         description: Invalid mssv or pageBalance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid mssv or pageBalance"
 *       404:
 *         description: Page balance not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Page balance not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.patch("/update-page-balance/:mssv", userController.updatePageBalance);

module.exports = router;
