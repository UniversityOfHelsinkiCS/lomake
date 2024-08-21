module.exports = {
  up(queryInterface) {
    return queryInterface.removeColumn('users', 'irrelevant')
  },
  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'irrelevant', Sequelize.BOOLEAN)
  },
}
