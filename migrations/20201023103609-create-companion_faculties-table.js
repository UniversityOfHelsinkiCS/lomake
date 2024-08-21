module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('companion_faculties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'faculties',
          key: 'id',
        },
      },
      studyprogramme_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'studyprogrammes',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable('companion_faculties')
  },
}
