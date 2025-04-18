import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('backup_answers', 'form', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('backup_answers', 'form')
}
