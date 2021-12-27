import Mongoose from "mongoose";

const proposalPaymentModel = new Mongoose.Schema({
    ownerId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    receiverId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    match_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Match",
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
})

module.exports = Mongoose.model("ProposalPayment", proposalPaymentModel, "proposalPayment");
