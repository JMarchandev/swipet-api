import Mongoose from "mongoose";

const profileModel = new Mongoose.Schema({
  fireBaseId: {
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
  description: {
    type: String,
    required: false,
    default: "",
  },
  role: {
    type: "PET_SITTER" || "PET_OWNER",
    required: false,
  },
  like: {
    type: Array,
    required: true,
    default: [],
  },
  unlike: {
    type: Array,
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
