module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('faculties', 'name'),
      await queryInterface.addColumn('faculties', 'name', {
        type: Sequelize.JSONB,
        defaultValue: { fi: '', en: '', se: '' },
      }),
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn('faculties', 'name'),
      await queryInterface.addColumn('faculties', 'name', {
        type: Sequelize.STRING,
      }),
    ]
  },
}
