import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, DATE, JSONB, STRING } from 'sequelize'
import { sequelize } from '../database/connection'

class Faculty extends Model<InferAttributes<Faculty>, InferCreationAttributes<Faculty>> {
  declare id: CreationOptional<number>
  declare code: string
  declare name: Record<string, any>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Faculty.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: STRING,
    name: JSONB,
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    sequelize,
    tableName: 'faculties',
    underscored: true
  }
)

export default Faculty
