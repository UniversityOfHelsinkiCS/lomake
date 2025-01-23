import { DATE } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return Promise.all([
    queryInterface.addColumn('key_data', 'created_at', {
      type: DATE,
    }),
    queryInterface.addColumn('key_data', 'updated_at', {
      type: DATE,
    })
  ])
}

export const down = ({ context: queryInterface }) => {
  return Promise.all([
    queryInterface.removeColumn('key_data', 'created_at'),
    queryInterface.removeColumn('key_data', 'updated_at')
  ])
}