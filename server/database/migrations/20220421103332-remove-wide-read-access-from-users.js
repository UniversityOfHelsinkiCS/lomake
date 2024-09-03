import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'wide_read_access')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'wide_read_access', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
}