import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'irrelevant')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'irrelevant', {
    type: DataTypes.BOOLEAN,
  })
}
