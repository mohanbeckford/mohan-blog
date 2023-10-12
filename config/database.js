// load require modules
const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;
// set jawsdb or local databse
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}
// exports sequelize 
module.exports = sequelize;