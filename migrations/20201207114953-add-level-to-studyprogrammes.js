module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studyprogrammes', 'level', {
      type: Sequelize.STRING,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('studyprogramme', 'level')
  },
}
