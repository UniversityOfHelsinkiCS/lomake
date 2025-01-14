import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) =>
  queryInterface.createTable('temp_answers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    programme: {
      type: DataTypes.STRING,
    },
    data: {
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

export const down = ({ context: queryInterface }) => queryInterface.dropTable('temp_answers')