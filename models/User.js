// load required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
// class users
class Users extends Model {}
// cretae table user on init
Users.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'users',
  }
);
// exports users
module.exports = Users;

