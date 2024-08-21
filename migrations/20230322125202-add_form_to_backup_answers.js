module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('backup_answers', 'form', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('backup_answers', 'form')
  },
}
