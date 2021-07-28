'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('users', {
      fields: ['uid'],
      type: 'unique',
      name: 'uidUnique',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('users', 'uidUnique')
  },
}
