'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'name', 'firstname')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'firstname', 'name')
  },
}
