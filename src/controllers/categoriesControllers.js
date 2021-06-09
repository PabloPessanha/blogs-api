const { Router } = require('express');
const { StatusCode, CustomError } = require('../helpers');
const { verifyToken } = require('../middlewares/verifications');
const { Category } = require('../models');

const categories = Router();

categories.get('/', verifyToken, async (req, res) => {
  const allCategories = await Category.findAll({ order: [['id', 'asc']] });
  return res.status(StatusCode.OK).json(allCategories);
});
categories.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) CustomError('"name" is required', StatusCode.BAD_REQUEST);

    const createdCategory = await Category.create({ name });
    return res.status(StatusCode.CREATED).json(createdCategory);
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

module.exports = categories;