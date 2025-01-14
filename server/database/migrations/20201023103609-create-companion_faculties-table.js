import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('companion_faculties', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'faculties',
        key: 'id',
      },
    },
    studyprogramme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'studyprogrammes',
        key: 'id',
      },
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  })
}

export const down = ({ context: queryInterface }) => {
  return queryInterface.dropTable('companion_faculties')
}