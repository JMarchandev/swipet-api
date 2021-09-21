import Mongoose from "mongoose";

const conversationModel = new Mongoose.Schema({
  members: {
    type: [Mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    required: true,
    default: [],
  },
  messages: {
    type: [Mongoose.Schema.Types.ObjectId],
    ref: "Message",
    required: true,
    default: [],
  },
  match_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: false,
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedDate: {
    type: Date,
    required: false,
  },
  deletedDate: {
    type: Date,
    required: false,
  },
});

module.exports = Mongoose.model("Conversation", conversationModel);