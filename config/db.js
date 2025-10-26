const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("rsi_softwarehouse", "root", "280406", {
  host: "127.0.0.1",
  dialect: "mariadb",
  port: 3306,
  dialectOptions: {
    allowPublicKeyRetrieval: true,
  },
  logging: false,
});

module.exports = sequelize;
