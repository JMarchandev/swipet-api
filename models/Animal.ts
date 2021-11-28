import Mongoose from "mongoose";

const animalModel = new Mongoose.Schema({
  ownerId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sexe: {
    type: String,
    required: true,
  },
  animalType: {
    type: String,
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

module.exports = Mongoose.model("Animal", animalModel, "animal");
