const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

// validate name, email, password with mongoose
// hash password (with bcrypt.js)
// create token
// send token as response
const register = async (req, res) => {
    // try to create user with req.body
    // mongoose middle ware hashes the password
    // mongoose saves the user
    const user = await User.create({ ...req.body });
    const token = user.createToken();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("provide email and password");
    }

    const user = await User.findOne({ email });
    // compare pw
    if (!user) {
        throw new UnauthenticatedError("invalid credentials.");
    }
    const isPwCorrect = await user.comparePassword(password);
    if (!isPwCorrect) {
        throw new UnauthenticatedError("invalid credentials.");
    }

    const token = user.createToken();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
    register,
    login,
};
