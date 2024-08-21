module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('temp_answers', 'form', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('temp_answers', 'form')
  },
}
