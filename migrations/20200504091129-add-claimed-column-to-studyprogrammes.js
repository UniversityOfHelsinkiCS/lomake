module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studyprogrammes', 'claimed', Sequelize.BOOLEAN)
  },

  down: queryInterface => {
    return queryInterface.removeColumn('studyprogrammes', 'claimed')
  },
}
