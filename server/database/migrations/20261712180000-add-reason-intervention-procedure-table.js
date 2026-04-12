import { JSONB } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('interventionprocedures', 'reason', {
    type: JSONB,
    allowNull: true,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('interventionprocedures', 'reason')
}
