module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('temp_answers', {
      fields: ['programme'],
      type: 'unique',
      name: 'programmeUnique',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('temp_answers', 'programmeUnique')
  },
}
