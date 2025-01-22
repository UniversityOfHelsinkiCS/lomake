import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, JSONB } from 'sequelize'
import { sequelize } from '../database/connection.js'

class KeyData extends Model<InferAttributes<KeyData>, InferCreationAttributes<KeyData>> {
  declare id: CreationOptional<number>
  declare data: {}
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
  },
  {
    sequelize,
    tableName: 'key_data',
    underscored: true,
  }
)

export default KeyData