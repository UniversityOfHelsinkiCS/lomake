import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('temp_answers', 'ready', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('temp_answers', 'ready')
}
