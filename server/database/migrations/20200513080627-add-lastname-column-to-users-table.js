import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'lastname', DataTypes.STRING)
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'lastname')
}
