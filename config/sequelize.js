const { Sequelize } = require('@models/index')

module.exports = {
  development: {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
    },
  },
  test: {
    database_url: 'postgres://postgres@127.0.0.1:5432/circle_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
  production: {
    database_url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
    },
    // https://stackoverflow.com/questions/71846885/in-sequelize-connection-i-am-getting-operation-timeout-error-how-to-fix-this-is
    retry: {
      match: [/Deadlock/i, Sequelize.ConnectionError], // Retry on connection errors
      max: 3,
      backoffBase: 3000,
      backoffExponent: 1.5,
    },
  },
}
