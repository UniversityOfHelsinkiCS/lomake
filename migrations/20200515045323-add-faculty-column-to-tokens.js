module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens', 'faculty', Sequelize.STRING)
  },

  down: queryInterface => {
    return queryInterface.removeColumn('tokens', 'faculty')
  },
}
