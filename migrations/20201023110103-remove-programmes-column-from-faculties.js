module.exports = {
  up(queryInterface) {
    return queryInterface.removeColumn('faculties', 'programmes')
  },
  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('faculties', 'programmes', Sequelize.JSONB)
  },
}
