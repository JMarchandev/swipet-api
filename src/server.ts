/**
 * Required External Modules
 */
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import * as MessageService from "../service/socket/message";

const jwt = require("../service/jwt");
const errorHandler = require("../service/error-handler");

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
const NODE_ORIGINS_LIST = process.env.NODE_ORIGINS_LIST
  ? process.env.NODE_ORIGINS_LIST.split(" ")
  : [];
const LOCAL_MONGO_CLUSTER = process.env.LOCAL_MONGO_CLUSTER;

/**
 *  App Configuration
 */
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: NODE_ORIGINS_LIST,
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: NODE_ORIGINS_LIST,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../")));
app.use(jwt());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

const mongoConfig = {
  useNewUrlParser: true,
};

io.on("connection", (socket) => {
  console.log("somewone coming");
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

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
  // "mongodb://127.0.0.1:27017",
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

// app.use("/", (req, res) => {
//   res.json("alive");
// });

app.use(errorHandler);

/**
 * Server Activation
 */
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
