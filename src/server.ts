import { Server } from "socket.io";
import cors from "cors";
import { createServer } from "http";
/**
 * Required External Modules
 */
import dotenv from "dotenv";
import express from "express";
import { initConnection } from "../service/socket/socket";
import mongoose from "mongoose";

const jwt = require("../service/jwt");
const errorHandler = require("../service/error-handler");
const morgan = require("../service/loggers/morgan");

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

/**
 * App Variables
 */
const PORT: number = parseInt(process.env.PORT);
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const NODE_ORIGINS_LIST = process.env.NODE_ORIGINS_LIST
  ? process.env.NODE_ORIGINS_LIST.split(" ")
  : [];

/**
 *  App Configuration
 */
const app = express();

const httpServer = createServer(app);

const corsOptions = {
  origin: NODE_ORIGINS_LIST,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(morgan);
app.use(cors(corsOptions));
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

const io = new Server(httpServer, {
  cors: {
    origin: NODE_ORIGINS_LIST,
    methods: ["GET", "POST"],
  },
});

initConnection(io);

mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`,
  // "mongodb://127.0.0.1:27017",
  // @ts-ignore
  mongoConfig
);

/**
 * API Routers
 */
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

const animalRouter = require("../routes/animals");
app.use("/my-animal", animalRouter);

const proposalPaymentRouter = require("../routes/proposalPayment");
app.use("/proposal-payment", proposalPaymentRouter);

const notificationRouter = require("../routes/notifications");
app.use("/notifications", notificationRouter);

const fakeRouter = require("../routes/fakes");
app.use("/fakes", fakeRouter);

app.use(errorHandler);

/**
 * Server Activation
 */
httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
