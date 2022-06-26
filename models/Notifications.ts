import Mongoose from "mongoose";

const notificationsModel = new Mongoose.Schema({
  matches: [
    {
      type: Map,
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
      type: Map,
      of: new Mongoose.Schema({
        seen: Mongoose.Schema.Types.Boolean,
        conversation_id: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      }),
      // default: {
      //   conversation_id: {
      //     type: Mongoose.Schema.Types.ObjectId,
      //     ref: "Message",
      //   },
      //   seen: {
      //     type: Mongoose.Schema.Types.Boolean,
      //     default: false,
      //   },
      // },
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
