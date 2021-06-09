const { Router } = require('express');
const { Op } = require('sequelize');
const { StatusCode: SCODE, CustomError } = require('../helpers');
const { verifyToken, verifyPost, verifyCategories } = require('../middlewares/verifications');
const { BlogPost, User, Category, PostCategory } = require('../models');

const post = Router();

post.get('/', verifyToken, async (req, res) => {
  const posts = await BlogPost.findAll({ 
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });
  return res.status(SCODE.OK).json(posts);
});

post.post('/', verifyToken, verifyPost, verifyCategories, async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const { id: userId } = req.userInfo;

  const response = await BlogPost.create({ title, content, userId });
  await Promise.all(categoryIds.map((catId) => PostCategory.create({ 
    postId: response.dataValues.id, 
    categoryId: catId,
  })));
  return res.status(SCODE.CREATED).json(response);
});

post.get('/search', verifyToken, async (req, res) => {
  const { q: term } = req.query;
  const { id: userId } = req.userInfo;
  try {
    const posts = await BlogPost.findAll({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories' },
      ],
      where: {
        userId,
        [Op.or]: [{ title: { [Op.like]: `%${term}%` } }, { content: { [Op.like]: `%${term}%` } }],
      },
    });
    return res.status(SCODE.OK).json(posts);
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

post.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await BlogPost.findOne({ 
      where: { id }, 
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories' },
      ],
    });
    if (!result) CustomError('Post does not exist', SCODE.NOT_FOUND);
    return res.status(SCODE.OK).json(result);
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

post.put('/:id', verifyToken, verifyPost, async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryIds } = req.body;
  const { id: userIdToken } = req.userInfo;
  try {
    const { userId, categories } = await BlogPost.findOne({
      where: { id },
      include: { model: Category, as: 'categories' },
    });
    if (userId !== userIdToken) CustomError('Unauthorized user', SCODE.UNAUTHORIZED);
    if (categoryIds) CustomError('Categories cannot be edited', SCODE.BAD_REQUEST);

    await BlogPost.update({ title, content }, { where: { id } });
    return res.status(SCODE.OK).json({ title, content, userId, categories });
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

post.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { id: userIdToken } = req.userInfo;
  try {
    const srchPost = await BlogPost.findOne({ where: { id } });
    if (!srchPost) CustomError('Post does not exist', SCODE.NOT_FOUND);
    if (srchPost.userId !== userIdToken) CustomError('Unauthorized user', SCODE.UNAUTHORIZED);

    await BlogPost.destroy({ where: { id } });
    return res.status(SCODE.NO_CONTENT).end();
  } catch ({ status, message }) {
    return res.status(status).json({ message });
  }
});

module.exports = post;
