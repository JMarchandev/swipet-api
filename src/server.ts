/**
 * Required External Modules
 */
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { createServer } from "http";
import { Server } from "socket.io";

import * as MessageService from "../service/socket/message";

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT);
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;

/**
 *  App Configuration
 */
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://app-swipet.netlify.app",
    methods: ["GET", "POST"],
  },
});

// app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );

  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Credentials", "true");
  // res.header(
  //   "Access-Control-Allow-Methods",
  //   "POST, GET, PUT, OPTIONS, DELETE, PATCH"
  // );
  // res.header(
  //   // "Access-Control-Allow-Headers",
  //   "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  // );
  next();
});

app.use(express.json());

const mongoConfig = {
  useNewUrlParser: true,
};

// const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
io.on("connection", (socket) => {
  socket.on("join", ({ id, room }: { id: string; room: string }) => {
    console.log("user " + id + " join room :" + room);

    socket.join(room);
  });

  socket.on("sendMessage", async ({ room, message, sender }, callback) => {
    console.log(room, message, sender);

    try {
      const newMessage = await MessageService.createMessage(
        message,
        sender,
        room
      );
      io.to(room).emit("message", { message: newMessage });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
});

mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`,
  // @ts-ignore
  mongoConfig
);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("database connected"));

const profileRouter = require("../routes/profiles");
app.use("/profiles", profileRouter);

const conversationRouter = require("../routes/conversations");
app.use("/conversations", conversationRouter);

const messageRouter = require("../routes/messages");
app.use("/messages", messageRouter);

const matchRouter = require("../routes/matches");
app.use("/matches", matchRouter);

const fakeRouter = require("../routes/fakes");
app.use("/fakes", fakeRouter);

/**
 * Server Activation
 */
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
