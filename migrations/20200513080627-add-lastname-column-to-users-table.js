module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'lastname', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'lastname')
  },
}
