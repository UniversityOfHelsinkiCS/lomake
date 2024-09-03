import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('studyprogrammes', 'primary_faculty_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'faculties',
      key: 'id',
    },
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('studyprogrammes', 'primary_faculty_id')
}