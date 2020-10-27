'use strict'

module.exports = {
  up: function (queryInterface) {
    return queryInterface.removeColumn('faculties', 'programmes')
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('faculties', 'programmes', Sequelize.JSONB)
  },
}
