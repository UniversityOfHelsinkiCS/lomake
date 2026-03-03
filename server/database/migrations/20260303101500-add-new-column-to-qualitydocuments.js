import { JSONB } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('qualitydocuments', 'year', {
    type: JSONB,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('qualitydocuments', 'year')
}
