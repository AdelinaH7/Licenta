const Sequelize = require("sequelize");
const config = require("./config.json");

const sequelize = new Sequelize(
  config.db.dbname,
  config.db.dbusername,
  config.db.dbpass,
  {
    dialect: config.db.dblang,
    host: config.db.dbhost,
    define: {
      timestamps: true,
    },
  }
);

module.exports = sequelize;
