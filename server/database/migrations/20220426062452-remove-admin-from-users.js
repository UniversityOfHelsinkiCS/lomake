import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'admin')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'admin', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
}
