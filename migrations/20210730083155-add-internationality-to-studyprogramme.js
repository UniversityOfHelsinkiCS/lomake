module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studyprogrammes', 'international', {
      type: Sequelize.BOOLEAN,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('studyprogrammes', 'international')
  },
}
