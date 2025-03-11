import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('studyprogrammes', 'locked_forms', {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      yearly: false,
      'degree-reform': false,
      evaluation: false,
      'evaluation-faculty': false,
    },
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('studyprogrammes', 'locked_forms')
}
