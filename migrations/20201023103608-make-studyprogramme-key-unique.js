module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('studyprogrammes', {
      fields: ['key'],
      type: 'unique',
      name: 'keyUnique',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('studyprogrammes', 'keyUnique')
  },
}
