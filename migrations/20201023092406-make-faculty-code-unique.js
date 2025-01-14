module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint('faculties', {
      fields: ['code'],
      type: 'unique',
      name: 'codeUnique',
    })
  },

  down: queryInterface => {
    return queryInterface.removeConstraint('faculties', 'codeUnique')
  },
}
