import Mongoose from "mongoose";

const matchModel = new Mongoose.Schema({
  members: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  ],
  conversation_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
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

module.exports = Mongoose.model("Match", matchModel, "matches");
