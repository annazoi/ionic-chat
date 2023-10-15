const Chat = require("../model/Chat");

const createChat = async (req, res) => {
  const { name, type, avatar, members } = req.body;

  if (type === "private") {
    const existingChat = await Chat.find({
      members: { $all: members },
      type: "private",
    });
    if (existingChat.length > 0) {
      console.log(existingChat);
      return res.status(400).json({ exist: true, chatId: existingChat[0]._id });
    }
  }

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
    const chat = await Chat.findById(req.params.chatId).populate(
      "members creatorId messages.senderId",
      "-password"
    );
    chat.messages.push({
      senderId: req.userId,
      message: req.body.message,
    });

    await chat.populate("members creatorId messages.senderId");

    await chat.save();

    // await chat
    //   .find()
    //   .populate("members creatorId messages.senderId", "-password");

    // const updatedChat = await chat
    //   .findById(req.params.chatId)
    //   .populate("members creatorId messages.senderId", "-password");
    // await updatedChat.save();

    res.status(200).json({ message: "ok", chat: chat });
  } catch (err) {
    res.status(500).json({ message: err, chat: null });
  }
};

const updateChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat)
      return res.status(404).json({
        message: "The Chat with the given ID was not found.",
        chat: null,
      });

    let query = { $set: {} };
    for (let key in req.body) {
      query.$set[key] = req.body[key];
    }
    await Chat.updateOne({ _id: req.params.chatId }, query).exec();

    const updatedChat = await Chat.findById(req.params.chatId).exec();

    res.status(201).json({ message: "ok", chat: updatedChat });
  } catch (err) {
    res.status(404).json({ message: err, chat: null });
  }
};

module.exports = { createChat, getChats, getChat, createMessage, updateChat };
