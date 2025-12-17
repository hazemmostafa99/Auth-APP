const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // if the user is already exist
    const checkUserExistance = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkUserExistance) {
      return res.status(400).json({
        success: false,
        message: "the user is already exist",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: "the user registered successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "unable to register user",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if username is exist
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "this username is not exist",
      });
    }

    // check the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "this password is not correct",
      });
    }
    // create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "logined successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    // check user existance
    const user = await User.findById(userId);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not exist",
      });
    }

    // check oldpassword correct or not
    const isUserPasswordMatched = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isUserPasswordMatched) {
      return res.status(404).json({
        success: false,
        message: "The old password not correct",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
};
module.exports = {
  register,
  login,
  changePassword,
};
