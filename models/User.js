const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide name"],
        minlength: 3,
        maxlength: 10,
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ,
            "please provide valid email",
        ],
        unique: [true, "already used email"],
    },
    password: {
        type: String,
        required: [true, "please provide password"],
        minlength: 8,
    },
});

// try to create user with req.body
// mongoose middle ware hashes the password
// mongoose saves the user
UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);

    this.password = hashPassword;
});

UserSchema.methods.createToken = function () {
    const token = jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY_TIME,
        }
    );

    return token;
};

UserSchema.methods.comparePassword = async function (pw) {
    const isMatch = await bcrypt.compare(pw, this.password);

    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
