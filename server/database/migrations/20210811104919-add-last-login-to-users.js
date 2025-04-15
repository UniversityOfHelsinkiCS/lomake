import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'last_login', {
    type: DataTypes.DATE,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'last_login')
}
