const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
