const createUser = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    image: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, { timestamps: false });

  return User;
};

module.exports = createUser;
