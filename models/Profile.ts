import Mongoose from "mongoose";

const profileModel = new Mongoose.Schema({
  firebaseId: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  role: {
    type: String,
    required: false,
  },
  likes: {
    type: [Mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    required: true,
    default: [],
  },
  unlikes: {
    type: [Mongoose.Schema.Types.ObjectId],
    ref: "Profile",
    required: true,
    default: [],
  },
  img_uri: {
    type: String,
    required: false,
  },
  matches: {
    type: [Mongoose.Schema.Types.ObjectId],
    ref: "Match",
    required: true,
    default: [],
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

module.exports = Mongoose.model("Profile", profileModel);
