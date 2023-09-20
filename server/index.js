const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const formidable = require("express-formidable");
// Import the Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const chatRoutes = require("./routes/chat");
const bodyParser = require("body-parser");
const multer = require("multer");
const http = require("http").Server(app);
const io = require("socket.io");
const { Socket } = require("dgram");

// app.use(formidable());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(cors());

// Import the Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);

// Connect the mongoDB
mongoose.connect(process.env.DB_CONNECTION).then(() => {
  // Listening port
  http.listen(3000, () => {
    console.log("App is running");
  });
});

const socket = io(http, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user with id: ${socket.id} joined room: ${data}`);

    socket.on("send_message", (data) => {
      // socket.in(data.room).emit("receive_message", data);
      // const data = {
      //   username: data.senderId.username,
      //   message: data.message,
      //   avatar: data.senderId.avatar,
      //   createdAt: data.createdAt,
      // };
      socket.to(data.room).emit("receive_message", data);
      console.log("receive_message", data);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});
