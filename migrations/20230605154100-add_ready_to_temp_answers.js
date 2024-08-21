module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('temp_answers', 'ready', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('temp_answers', 'ready')
  },
}
