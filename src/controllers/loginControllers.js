const { Router } = require('express');
const { StatusCode, CustomError, tokenFunctions } = require('../helpers');
const { verifyEmail, verifyPassword } = require('../middlewares/verifications');
const { User } = require('../models');

const login = Router();

login.post('/', verifyEmail, verifyPassword, async (req, res) => {
  const { email, password } = req.body;
  try {
    const [checkUser] = await User.findAll({ where: { email, password } });
    if (!checkUser) CustomError('Invalid fields', StatusCode.BAD_REQUEST);

    const token = tokenFunctions.generateToken({ email, id: checkUser.id });
    return res.status(StatusCode.OK).json({ token });
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

module.exports = login;
