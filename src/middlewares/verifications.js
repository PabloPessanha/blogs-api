const { CustomError, StatusCode: SCODE, tokenFunctions } = require('../helpers');
const { Category } = require('../models');

const verifyEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email === '') CustomError('"email" is not allowed to be empty', SCODE.BAD_REQUEST);
    if (!email) CustomError('"email" is required', SCODE.BAD_REQUEST);
    if (!regexEmail.test(email)) CustomError('"email" must be a valid email', SCODE.BAD_REQUEST);
    next();
  } catch ({ message, status }) {
    return res.status(status).json({ message });
  }
};

const verifyPassword = (req, res, next) => {
  try {
    const { password } = req.body;
    if (password === '') CustomError('"password" is not allowed to be empty', SCODE.BAD_REQUEST);
    if (!password) CustomError('"password" is required', SCODE.BAD_REQUEST);
    if (password.length < 6) {
      CustomError('"password" length must be 6 characters long', SCODE.BAD_REQUEST);
    }
    next();
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) CustomError('Token not found', SCODE.UNAUTHORIZED);
    const userInfo = tokenFunctions.decodeToken(authorization);
    req.userInfo = userInfo;
    next();
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
};

const verifyPost = async (req, res, next) => {
  const { title, content } = req.body;
  try {
    if (!title) CustomError('"title" is required', SCODE.BAD_REQUEST);
    if (!content) CustomError('"content" is required', SCODE.BAD_REQUEST);
    next();
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
};

const verifyCategories = async (req, res, next) => {
  const { categoryIds } = req.body;

  try {
    if (!categoryIds) CustomError('"categoryIds" is required', SCODE.BAD_REQUEST);
    await Promise.all(categoryIds.map(async (categoryId) => {
      const exists = await Category.findOne({ where: { id: categoryId } });
      if (!exists) CustomError('"categoryIds" not found', SCODE.BAD_REQUEST);
    }));
    next();
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
};

module.exports = { verifyEmail, verifyPassword, verifyToken, verifyPost, verifyCategories };
