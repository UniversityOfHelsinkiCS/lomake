import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, JSONB, DATE } from 'sequelize'
import { sequelize } from '../database/connection.js'

class KeyData extends Model<InferAttributes<KeyData>, InferCreationAttributes<KeyData>> {
  declare id: CreationOptional<number>
  declare data: {}
  declare createdAt: Date
  declare updatedAt: Date
}

KeyData.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data: {
      type: JSONB,
      allowNull: false,
    },
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    sequelize,
    tableName: 'key_data',
    underscored: true,
  }
)

export default KeyData