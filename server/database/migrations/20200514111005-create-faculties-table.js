import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) => {
  return queryInterface.createTable('faculties', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    programmes: {
      type: DataTypes.JSONB,
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
  return queryInterface.dropTable('faculties')
}
