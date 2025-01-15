import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'special_group', {
    type: DataTypes.STRING,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'special_group')
}