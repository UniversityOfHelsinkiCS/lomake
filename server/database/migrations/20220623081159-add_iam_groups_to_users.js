import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'iam_groups', {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'iam_groups')
}