import { DataTypes } from 'sequelize'

export const up = ({ context: queryInterface }) =>
  queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    admin: {
      type: DataTypes.BOOLEAN,
    },
    access: {
      type: DataTypes.BOOLEAN,
    },
    irrelevant: {
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

export const down = ({ context: queryInterface }) => queryInterface.dropTable('users')
