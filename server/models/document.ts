import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, JSONB, DATE, STRING } from 'sequelize'
import { sequelize } from '../database/connection.js'

class Document extends Model<InferAttributes<Document>, InferCreationAttributes<Document>> {
  declare id: CreationOptional<number>
  declare data: Record<string, any>
  declare studyprogrammeKey: string
  declare createdAt: Date
  declare updatedAt: Date
}

Document.init(
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
    tableName: 'documents',
    underscored: true,
  }
)

export default Document
