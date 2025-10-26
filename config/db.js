const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("rsi-softwarehouse", "root", "280406", {
  host: "localhost",
  dialect: "mariadb",
  port: 3306,
  dialectOptions: {
    allowPublicKeyRetrieval: true,
  },
  logging: false,
});

module.exports = sequelize;