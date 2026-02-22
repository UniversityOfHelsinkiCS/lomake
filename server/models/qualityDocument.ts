import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, JSONB, DATE, STRING } from 'sequelize'
import { sequelize } from '../database/connection.js'

class QualityDocument extends Model<InferAttributes<QualityDocument>, InferCreationAttributes<QualityDocument>> {
  declare id: CreationOptional<number>
  declare data: Record<string, any>
  declare studyprogrammeKey: string
  declare createdAt: Date
  declare updatedAt: Date
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
