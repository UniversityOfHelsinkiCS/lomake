module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint('temp_answers', {
      fields: ['programme'],
      type: 'unique',
      name: 'programmeUnique',
    })
  },

  down: queryInterface => {
    return queryInterface.removeConstraint('temp_answers', 'programmeUnique')
  },
}
