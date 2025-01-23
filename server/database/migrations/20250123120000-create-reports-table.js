import { INTEGER, JSONB, DATE } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    studyprogramme_id: {
      type: INTEGER,
      allowNull: false,
    },
    year: {
      type: INTEGER,
      allowNull: false,
    },
    comments: {
      type: JSONB,
      defaultValue: null
    },
    actions: {
      type: JSONB,
      defaultValue: null
    },
    faculty_actions: {
      type: JSONB,
      defaultValue: null
    },
    created_at: DATE,
    updated_at: DATE
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('reports')
}
