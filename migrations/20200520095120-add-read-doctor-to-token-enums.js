'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    ALTER TYPE "enum_tokens_type" ADD VALUE 'READ_DOCTOR';
  `)
  },

  down: (queryInterface, Sequelize) => {
    // https://stackoverflow.com/questions/25811017/how-to-delete-an-enum-type-value-in-postgres
    return
  },
}
