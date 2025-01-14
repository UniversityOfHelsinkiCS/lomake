import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('deadlines', 'passed')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.addColumn('deadlines', 'passed', DataTypes.BOOLEAN)
}