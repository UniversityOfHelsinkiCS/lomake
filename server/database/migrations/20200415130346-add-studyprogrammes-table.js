import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) =>
  queryInterface.createTable('studyprogrammes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    key: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.JSONB,
    },
    locked: {
      type: DataTypes.BOOLEAN,
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

export const down = ({ context: queryInterface }) => queryInterface.dropTable('studyprogrammes')
