module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studyprogrammes', 'locked_all', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {
        yearly: false,
        'degree-reform': false,
        evaluation: false,
        'evaluation-faculty': false,
      },
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('studyprogrammes', 'locked_all')
  },
}
