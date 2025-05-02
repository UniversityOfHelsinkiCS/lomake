import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, JSONB, DATE, BOOLEAN } from 'sequelize'
import { sequelize } from '../database/connection.js'

class Document extends Model<InferAttributes<KeyData>, InferCreationAttributes<KeyData>> {
  declare id: CreationOptional<number>
  declare data: Record<string, any>
  declare active: boolean
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
    active: BOOLEAN,
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
