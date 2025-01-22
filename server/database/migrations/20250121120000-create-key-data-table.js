import { INTEGER, JSONB } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('key_data', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    data: {
      type: JSONB,
    },
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('key_data')
}
