module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'special_group', {
      type: Sequelize.STRING,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'special_group')
  },
}
