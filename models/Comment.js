// load required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// class comments
class Comments extends Model {}
// on init cretae table
Comments.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comments',
  }
);

// exports comments
module.exports = Comments;
