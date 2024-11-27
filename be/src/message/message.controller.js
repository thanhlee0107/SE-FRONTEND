const messageModule = require("./message.module");

exports.insertMessage = async (req, res) => {
  const senderId = req.user.id;
  const message = req.body.message;
  try {
    messageModule.insertMessage(senderId, message);
    return res.status(201).json({ message: "Message sent" });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getMessages = async (req, res) => {
  const userId = req.user.id;
  const receiver_id = Number(req.query.receiverId);
  //   console.log(req.query.receiverId);
  try {
    const result = await messageModule.getMessages(userId, receiver_id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getReceiver = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await messageModule.getReceiver(userId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  try {
    messageModule.deleteMessage(messageId);
    return res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};
