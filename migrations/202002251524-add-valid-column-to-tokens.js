module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens', 'valid', Sequelize.BOOLEAN)
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('tokens', 'valid')
  }
}
