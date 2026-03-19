import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  INTEGER,
  JSONB,
  DATE,
  STRING,
} from 'sequelize'
import { sequelize } from '../database/connection.js'

class QualityDocument extends Model<InferAttributes<QualityDocument>, InferCreationAttributes<QualityDocument>> {
  declare id: CreationOptional<number>
  declare data: Record<string, any>
  declare studyprogrammeKey: string
  declare year: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

QualityDocument.init(
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
    studyprogrammeKey: {
      type: STRING,
      allowNull: false,
    },
    year: {
      type: INTEGER,
      allowNull: false,
    },
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    sequelize,
    tableName: 'qualitydocuments',
    underscored: true,
  }
)

export default QualityDocument
