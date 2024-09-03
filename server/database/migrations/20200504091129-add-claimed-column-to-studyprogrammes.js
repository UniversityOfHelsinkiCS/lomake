import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('studyprogrammes', 'claimed', DataTypes.BOOLEAN)
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('studyprogrammes', 'claimed')
}
