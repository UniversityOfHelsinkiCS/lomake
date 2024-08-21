module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint('studyprogrammes', {
      fields: ['key'],
      type: 'unique',
      name: 'keyUnique',
    })
  },

  down: queryInterface => {
    return queryInterface.removeConstraint('studyprogrammes', 'keyUnique')
  },
}
