import { INTEGER, JSONB, DATE } from 'sequelize'

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
    created_at: {
      type: DATE,
    },
    updated_at: {
      type: DATE,
    },
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('key_data')
}
