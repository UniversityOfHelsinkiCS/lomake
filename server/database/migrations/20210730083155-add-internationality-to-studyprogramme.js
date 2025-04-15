import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('studyprogrammes', 'international', {
    type: DataTypes.BOOLEAN,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('studyprogrammes', 'international')
}
