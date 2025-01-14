import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('temp_answers', 'year', {
    type: DataTypes.INTEGER,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('temp_answers', 'year')
}