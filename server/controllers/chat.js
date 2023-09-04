const Chat = require("../model/Chat");

const createChat = async (req, res) => {
  const { name, type, avatar, members } = req.body;
  console.log(req.body);

  try {
    const chat = await Chat.create({
      name,
      type,
      avatar,
      members,
      creatorId: req.userId,
    });

    res.status(200).json({ message: "ok", chat: chat });
  } catch (err) {
    res.status(500).json({ message: err, chat: null });
  }
};
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.userId }).populate(
      "members creatorId messages.senderId",
      "-password"
    );
    res.status(200).json({ message: "ok", chats: chats });
  } catch (err) {
    res.status(500).json({ message: err, chats: null });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "members creatorId messages.senderId",
      "-password"
    );
    res.status(200).json({ message: "ok", chat: chat });
  } catch (err) {
    res.status(500).json(err);
  }
};

const createMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    chat.messages.push({
      senderId: req.userId,
      message: req.body.message,
    });
    await chat.save();
    res.status(200).json({ message: "ok", chat: chat });
  } catch (err) {
    res.status(500).json({ message: err, chat: null });
  }
};

module.exports = { createChat, getChats, getChat, createMessage };
