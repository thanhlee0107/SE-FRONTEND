const router = require("express").Router();
const messageController = require("./message.controller");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API for managing messages
 */

/**
 * @swagger
 * /messages/send:
 *   post:
 *     summary: Send a new message
 *     description: API to send a message to a specific receiver
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the receiver
 *               message:
 *                 type: string
 *                 description: The content of the message
 *             example:
 *               receiverId: "12345"
 *               message: "Hello, how are you?"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Message sent successfully"
 *       400:
 *         description: Invalid input
 */
router.post("/send", messageController.insertMessage);
/**
/**
 * @swagger
 * /messages/get:
 *   get:
 *     summary: Get all messages or filter by receiver ID
 *     description: Retrieve all messages or filter by receiver ID if provided as a query parameter.
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: query
 *         name: receiverId
 *         required: false
 *         description: ID of the receiver to filter messages
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier of the message
 *                   receiverId:
 *                     type: string
 *                     description: ID of the receiver
 *                   message:
 *                     type: string
 *                     description: Content of the message
 *             example:
 *               - id: "1"
 *                 receiverId: "12345"
 *                 message: "Hello!"
 *               - id: "2"
 *                 receiverId: "67890"
 *                 message: "Hi there!"
 *       404:
 *         description: No messages found
 */

router.get("/get", messageController.getMessages);

/**
 * @swagger
 * /messages/getreceiver:
 *   get:
 *     summary: Get all receiver
 *     description: Retrieve messages for a specific receiver
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: Messages for the receiver retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier of the message
 *                   receiverId:
 *                     type: string
 *                     description: ID of the receiver
 *                   message:
 *                     type: string
 *                     description: Content of the message
 *             example:
 *               - id: "1"
 *                 receiverId: "12345"
 *                 message: "Hello!"
 *       404:
 *         description: No messages found for the specified receiver
 */
router.get("/getreceiver", messageController.getReceiver);

/**
 * @swagger
 * /messages/delete/{id}:
 *   delete:
 *     summary: Delete a message by ID
 *     description: Delete a specific message using its unique ID
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the message to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Message deleted successfully"
 *       404:
 *         description: Message not found
 */
router.delete("/delete/:id", messageController.deleteMessage);

module.exports = router;
