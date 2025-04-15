import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('answers', 'form', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('answers', 'form')
}
