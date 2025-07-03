import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// GENERATE JSON WEB TOKEN
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// REGISTER USER FUNCTION
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({
      email: email,
    });
    //  CHECK IF USER ALREADY EXIST
    if (userExist) {
      return res.status(400).json({
        message: 'User already exist',
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Passowrd Should atleast 8 characters',
        success: false,
      });
    }

    //  HASHING PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Srever error',
      success: false,
      error: error.message,
    });
  }
};

// LOGIN USER FUNCTION
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(500).json({
        message: 'Invalid email or password',
        success: false,
      });
    }

    //   COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(500).json({
        message: 'Invalid email or password',
        success: false,
      });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Srever error',
      success: false,
      error: error.message,
    });
  }
};

// GET USER PROFILE FUNCTION
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Srever error',
      success: false,
      error: error.message,
    });
  }
};
