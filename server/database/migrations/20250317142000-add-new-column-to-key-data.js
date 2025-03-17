import { BOOLEAN } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.addColumn('key_data', 'active', {
    type: BOOLEAN,
    defaultValue: false,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.removeColumn('key_data', 'active')
}