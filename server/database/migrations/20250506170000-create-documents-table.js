import { STRING, INTEGER, JSONB, DATE } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('documents', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    data: {
      type: JSONB,
    },
    studyprogramme_key: {
      allowNull: false,
      type: STRING,
    },
    created_at: DATE,
    updated_at: DATE,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('documents')
}
