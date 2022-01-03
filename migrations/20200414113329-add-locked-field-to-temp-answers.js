module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('temp_answers', 'locked', Sequelize.BOOLEAN)
  },

  down: queryInterface => {
    return queryInterface.removeColumn('temp_answers', 'locked')
  },
}
