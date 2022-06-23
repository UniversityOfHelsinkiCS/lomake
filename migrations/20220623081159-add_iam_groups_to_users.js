module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'iam_groups', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: [],
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'iam_groups')
  },
}
