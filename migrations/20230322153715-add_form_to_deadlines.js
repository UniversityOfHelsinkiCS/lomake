module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deadlines', 'form', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deadlines', 'form')
  },
}
