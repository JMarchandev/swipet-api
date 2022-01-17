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
  likes: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      default: [],
    },
  ],
  unlikes: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      default: [],
    },
  ],
  img_uri: {
    type: String,
    required: false,
  },
  profileImage: {
    croppedImage: {
      type: String,
      required: true,
      default:
        "https://swipet-api-pi.s3.eu-west-3.amazonaws.com/default/no_image.png",
    },
    defaultSource: {
      type: String,
      required: true,
      default:
        "https://swipet-api-pi.s3.eu-west-3.amazonaws.com/default/no_image.png",
    },
  },
  matches: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      default: [],
    },
  ],
  isLookingForAnimal: {
    type: Mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  },
  isLookingForPetSitter: {
    type: Mongoose.Schema.Types.Boolean,
    required: false,
    default: false,
  },
  animals: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
      default: [],
    },
  ],
  proposalPayments: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "ProposalPayment",
      required: true,
      default: [],
    },
  ],
  notifications: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Notifications",
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

module.exports = Mongoose.model("Profile", profileModel, "profiles");
