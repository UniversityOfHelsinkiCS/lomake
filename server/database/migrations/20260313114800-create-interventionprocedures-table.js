import { STRING, INTEGER, DATE, BOOLEAN } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('interventionprocedures', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    studyprogramme_key: {
      allowNull: false,
      type: STRING,
    },
    active: {
      allowNull: false,
      type: BOOLEAN,
    },
    start_year: {
      allowNull: false,
      type: INTEGER,
    },
    end_year: {
      type: INTEGER,
      allowNull: true,
    },
    created_at: DATE,
    updated_at: DATE,
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('interventionprocedures')
}
