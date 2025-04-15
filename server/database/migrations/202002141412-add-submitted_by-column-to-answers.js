import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('answers', 'submitted_by', DataTypes.STRING)
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('answers', 'submitted_by')
}
