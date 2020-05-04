'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studyprogrammes', 'claimed', Sequelize.BOOLEAN)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('studyprogrammes', 'claimed')
  },
}
