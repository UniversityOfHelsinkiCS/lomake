module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('studyprogrammes_locked', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      key: {
        type: Sequelize.STRING,
      },
      studyprogramme_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'studyprogrammes',
          key: 'id',
        },
      },
      locked: {
        type: Sequelize.JSONB,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: queryInterface => queryInterface.dropTable('studyprogrammes_locked'),
}
