// load reqired modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//class post;
class Posts extends Model {}
// create table on init
Posts.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT(1000),
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'posts',
  }
);

//eports posts
module.exports = Posts;
