import { DataTypes } from 'sequelize'

export const up = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('users', 'access'),
    await queryInterface.addColumn('users', 'access', {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    }),
  ]
}

export const down = async ({ context: queryInterface }) => {
  return [
    await queryInterface.removeColumn('users', 'access'),
    await queryInterface.addColumn('users', 'access', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }),
  ]
}
