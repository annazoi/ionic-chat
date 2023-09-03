const User = require("../model/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "Users Not Found", users: null });
    }
    res.json({ message: "ok", users: users });
  } catch (err) {
    res.json({ message: "Users Not Found", users: null });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found", user: null });
    }
    res.status(201).json({ message: "ok", user: user });
  } catch (err) {
    res.status(404).json({ message: err, user: null });
  }
};

const deleteUser = async (req, res) => {
  try {
    const removedUser = await User.deleteOne({ _id: req.params.id });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user)
      return res.status(404).json({
        message: "The User with the given ID was not found.",
        user: null,
      });

    let query = { $set: {} };
    for (let key in req.body) {
      if (user[key]) {
        if (key == "password") {
          req.body[key] = await bcrypt.hash(req.body[key], 10);
        } else if (key == "avatar") {
          const result = await cloudinary.uploader.upload(req.body[key], {
            folder: "users",
          });
          req.body[key] = result.url;
        }
        query.$set[key] = req.body[key];
      }
    }
    await User.updateOne({ _id: req.params.id }, query).exec();

    const userInfo = await User.findById(req.params.id, "-password").exec();

    res.status(201).json({ message: "ok", user: userInfo });
  } catch (err) {
    res.status(404).json({ message: err, user: null });
  }
};
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
