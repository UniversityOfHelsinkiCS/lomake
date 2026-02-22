import { INTEGER, JSONB, DATE, STRING } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('qualitydocuments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    studyprogramme_key: {
      type: STRING,
      allowNull: false,
    },
    data: {
      type: JSONB,
      allowNull: false,
    },
    created_at: DATE,
    updated_at: DATE,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('qualitydocuments')
}
