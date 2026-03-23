import { DataTypes } from 'sequelize'

export const up = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('qualitydocuments', 'year'),
    await queryInterface.addColumn('qualitydocuments', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
    }),
  ]
}

export const down = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('qualitydocuments', 'year'),
    await queryInterface.addColumn('qualitydocuments', 'year', {
      type: DataTypes.JSONB,
    }),
  ]
}
