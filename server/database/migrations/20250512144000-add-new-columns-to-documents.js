import { BOOLEAN, INTEGER } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return [
    queryInterface.addColumn('documents', 'active', {
      type: BOOLEAN,
    }),
    queryInterface.addColumn('documents', 'active_year', {
      type: INTEGER,
    })
  ]
}

export const down = ({ context: queryInterface }) => {
  return [queryInterface.removeColumn('documents', 'active'), queryInterface.removeColumn('documents', 'active_year')]
}
