module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('answers', 'submitted_by', Sequelize.STRING)
  },

  down: queryInterface => {
    return queryInterface.removeColumn('answers', 'submitted_by')
  },
}
