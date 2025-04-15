import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('studyprogrammes', 'level', {
    type: DataTypes.STRING,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('studyprogrammes', 'level')
}
