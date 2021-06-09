require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomError = require('./customError');
const StatusCode = require('./statusCode');

const secret = process.env.JWT_SECRET || 'secret';

const headers = {
  algorithm: 'HS256',
  expiresIn: '15m',
};

const generateToken = (payload) => jwt.sign(payload, secret, headers);
const decodeToken = (token) => jwt.verify(token, secret, (err, data) => {
  if (err) CustomError('Expired or invalid token', StatusCode.UNAUTHORIZED);
  return data;
});

module.exports = { generateToken, decodeToken };
