import { JSONB } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('documents', 'reason', {
    type: JSONB,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('documents', 'reason')
}
