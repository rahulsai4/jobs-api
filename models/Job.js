const mongoose = require("mongoose");
const { applyTimestamps } = require("./User");

const JobSchema = mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "please provide company name"],
        },
        position: {
            type: String,
            required: [true, "please provide position"],
        },
        status: {
            type: String,
            enum: ["interview", "declined", "pending"],
            default: "pending",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "please provide an user"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
