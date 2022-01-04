module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('temp_answers', 'year', {
      type: Sequelize.INTEGER,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('temp_answers', 'year')
  },
}
