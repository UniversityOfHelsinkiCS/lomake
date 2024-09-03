import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('temp_answers', 'locked', DataTypes.BOOLEAN)
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('temp_answers', 'locked')
}
