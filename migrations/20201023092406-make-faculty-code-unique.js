'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('faculties', {
      fields: ['code'],
      type: 'unique',
      name: 'codeUnique',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('faculties', 'codeUnique')
  },
}
