'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('temp_answers', 'locked')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('temp_answers', 'locked', Sequelize.BOOLEAN)
  },
}
