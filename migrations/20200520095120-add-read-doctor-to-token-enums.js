module.exports = {
  up: queryInterface => {
    return queryInterface.sequelize.query(`
    ALTER TYPE "enum_tokens_type" ADD VALUE 'READ_DOCTOR';
  `)
  },

  down: () => {
    // https://stackoverflow.com/questions/25811017/how-to-delete-an-enum-type-value-in-postgres
  },
}
