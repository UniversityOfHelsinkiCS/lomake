import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  INTEGER,
  JSONB,
  DATE,
  BOOLEAN,
} from 'sequelize'
import { KeyData as KeyDataType } from '@/shared/lib/types.js'
import { sequelize } from '../database/connection.js'

class KeyData extends Model<InferAttributes<KeyData>, InferCreationAttributes<KeyData>> {
  declare id: CreationOptional<number>
  declare data: KeyDataType
  declare year: number | null
  declare active: boolean
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
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
    year: {
      type: INTEGER,
      allowNull: true,
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
