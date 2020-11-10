
module.exports = {
  up: function(queryInterface) {
    return queryInterface.removeColumn(
      'users',
      'irrelevant'
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'irrelevant',
     Sequelize.BOOLEAN
    )
  }
}
