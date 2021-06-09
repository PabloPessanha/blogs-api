const createBlogPost = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, defaultValue: 1 },
    published: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, onUpdate: DataTypes.DATE },
  }, { timestamps: false });
  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return BlogPost;
};

module.exports = createBlogPost;
