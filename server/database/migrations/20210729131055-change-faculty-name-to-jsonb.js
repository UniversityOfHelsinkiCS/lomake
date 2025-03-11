import { DataTypes } from 'sequelize'

export const up = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('faculties', 'name'),
    await queryInterface.addColumn('faculties', 'name', {
      type: DataTypes.JSONB,
      defaultValue: { fi: '', en: '', se: '' },
    }),
  ]
}

export const down = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('faculties', 'name'),
    await queryInterface.addColumn('faculties', 'name', {
      type: DataTypes.STRING,
    }),
  ]
}
