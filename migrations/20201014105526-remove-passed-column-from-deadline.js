'use strict'

module.exports = {
  up: function(queryInterface) {
    return queryInterface.removeColumn(
      'deadlines',
      'passed'
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'deadlines',
      'passed',
     Sequelize.BOOLEAN
    )
  }
}
