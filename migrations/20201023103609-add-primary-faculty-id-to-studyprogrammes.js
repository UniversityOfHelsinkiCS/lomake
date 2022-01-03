module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studyprogrammes', 'primary_faculty_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'faculties',
        key: 'id',
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('studyprogramme', 'primary_faculty_id')
  },
}
