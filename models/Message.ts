import Mongoose from "mongoose";

const messageModel = new Mongoose.Schema({
  content_text: {
    type: String,
    required: false,
  },
  sender: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  conversation: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = Mongoose.model("Message", messageModel);