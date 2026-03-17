import { INTEGER } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('key_data', 'year', {
    type: INTEGER,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('key_data', 'year')
}
