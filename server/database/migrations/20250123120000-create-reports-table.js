import { INTEGER, JSONB, DATE } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    studyprogrammeId: {
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
    facultyActions: {
      type: JSONB,
      defaultValue: null
    },
    createdAt: DATE,
    updatedAt: DATE
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('reports')
}
