import Mongoose from "mongoose";

const notificationsModel = new Mongoose.Schema({
  matches: [
    {
      type: Mongoose.Schema.Types.Mixed,
      default: {
        match_id: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
        seen: {
          type: Mongoose.Schema.Types.Boolean,
          default: false,
        },
      },
    },
  ],
  messages: [
    {
      type: Mongoose.Schema.Types.Mixed,
      default: {
        conversation_id: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
        seen: {
          type: Mongoose.Schema.Types.Boolean,
          default: false,
        },
      },
    },
  ],
  profile_id: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
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

module.exports = Mongoose.model(
  "Notifications",
  notificationsModel,
  "notifications"
);
