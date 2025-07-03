import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res) => {
  try {
    let token = req.header.authorization;

    if (token && token.startswith('Bearer')) {
      token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } else {
      res.status(401).json({
        message: 'unauthorized access, token not found',
      });
    }
  } catch (error) {
    res.status(401).json({
      message: 'Token failed',
      success: false,
      error: error.message,
    });
  }
};
