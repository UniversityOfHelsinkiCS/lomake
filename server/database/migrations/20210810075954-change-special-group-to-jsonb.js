import { DataTypes } from 'sequelize'

export const up = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('users', 'special_group'),
    await queryInterface.addColumn('users', 'special_group', {
      type: DataTypes.JSONB,
      defaultValue: {},
    }),
  ]
}

export const down = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('users', 'special_group'),
    await queryInterface.addColumn('users', 'special_group', {
      type: DataTypes.JSONB,
    }),
  ]
}
