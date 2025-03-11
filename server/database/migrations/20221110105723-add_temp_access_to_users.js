import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('users', 'temp_access', {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true,
    defaultValue: [],
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('users', 'temp_access')
}
