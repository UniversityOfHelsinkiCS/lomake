module.exports = {
  up(queryInterface) {
    return queryInterface.removeColumn('deadlines', 'passed')
  },
  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('deadlines', 'passed', Sequelize.BOOLEAN)
  },
}
