module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint('users', {
      fields: ['uid'],
      type: 'unique',
      name: 'uidUnique',
    })
  },

  down: queryInterface => {
    return queryInterface.removeConstraint('users', 'uidUnique')
  },
}
