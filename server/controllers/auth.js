const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const cloudinary = require("../utils/cloudinary");

const register = async (req, res, next) => {
  const { phone, username, password, avatar } = req.body;
  console.log(req.body);

  if (avatar === "") {
    return (avatar =
      "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png");
  }

  let existingUser;
  try {
    existingUser = await User.findOne({
      $or: [
        {
          username: username,
        },
      ],
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Signing up failed, please try again later. 1" });
  }

  if (existingUser) {
    return res.status(400).send({ message: "User already exits" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);

    return res.status(400).send({ message: "Could not create user" });
  }

  try {
    const result = await cloudinary.uploader.upload(avatar, {
      folder: "users",
    });
    console.log(result.url);
    const createdUser = await User.create({
      phone,
      username,
      password: hashedPassword,
      avatar: result.url,
    });

    let token;

    token = jwt.sign(
      {
        userId: createdUser.id,
        username: createdUser.username,
      },
      process.env.JWT_SECRET
      // { expiresIn: "" }
    );
    res.status(201).json({
      userId: createdUser.id,
      token: token,
      avatar: result.url,
      username: createdUser.username,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Could not create user" });
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      $or: [
        {
          username: username,
        },
      ],
    });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Logging in failed, please try again later." });
  }

  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  if (!isValidPassword) {
    return res
      .status(400)
      .send({ message: "Invalid credentials, could not log you in." });
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Logging in failed, please try again later.2" });
  }

  res.status(200).json({
    userId: existingUser.id,
    token: token,
    avatar: existingUser.avatar,
    username: existingUser.username,
  });
};

exports.register = register;
exports.login = login;
