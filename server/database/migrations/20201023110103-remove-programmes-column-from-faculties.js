import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('faculties', 'programmes')
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.addColumn('faculties', 'programmes', DataTypes.JSONB)
}
