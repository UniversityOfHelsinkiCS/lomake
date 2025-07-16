import { InferAttributes, InferCreationAttributes, Model, CreationOptional, DATE, INTEGER, JSONB, STRING, BOOLEAN } from 'sequelize'
import { sequelize } from '../database/connection'

class Studyprogramme extends Model<InferAttributes<Studyprogramme>, InferCreationAttributes<Studyprogramme>> {
  declare id: CreationOptional<number>
  declare key: string
  declare name: Record<string, any>
  declare locked: boolean
  declare claimed: boolean
  declare level: string
  declare international: boolean
  declare primaryFacultyId: number
  declare lockedForms: Record<string, any>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Studyprogramme.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: STRING,
    name: JSONB,
    locked: BOOLEAN,
    claimed: BOOLEAN,
    level: STRING,
    international: BOOLEAN,
    primaryFacultyId: INTEGER,
    lockedForms: JSONB,
    createdAt: DATE,
    updatedAt: DATE
  },
  {
    sequelize,
    tableName: 'studyprogrammes',
    underscored: true,

  }
)

export default Studyprogramme
