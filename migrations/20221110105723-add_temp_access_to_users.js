module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'temp_access', {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: true,
      defaultValue: [],
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'temp_access')
  },
}
