const { Router } = require('express');
const { StatusCode: SCODE, CustomError, tokenFunctions } = require('../helpers');
const { verifyEmail, verifyPassword, verifyToken } = require('../middlewares/verifications');
const { User } = require('../models');

const user = Router();

user.get('/', verifyToken, async (req, res) => {
  const users = await User.findAll();
  return res.status(SCODE.OK).json(users);
});

user.post('/', verifyEmail, verifyPassword, async (req, res) => {
  const { displayName, email } = req.body;

  try {
    if (displayName.length < 8) {
      CustomError('"displayName" length must be at least 8 characters long', SCODE.BAD_REQUEST);
    }

    const [checkUser] = await User.findAll({ where: { email } });
    if (checkUser) CustomError('User already registered', SCODE.CONFLICT);

    const { dataValues: { id } } = await User.create(req.body);
    const token = tokenFunctions.generateToken({ email, id });

    return res.status(SCODE.CREATED).json({ token });
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

user.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const userByID = await User.findByPk(id);
    if (!userByID) CustomError('User does not exist', SCODE.NOT_FOUND);

    return res.status(SCODE.OK).json(userByID);
  } catch ({ message, status }) {
    return res.status(status).json({ message });
  }
});

user.delete('/me', verifyToken, async (req, res) => {
  const { email } = req.userInfo;
  await User.destroy({ where: { email } });

  return res.status(SCODE.NO_CONTENT).end();
});

module.exports = user;
