import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, DATE } from 'sequelize'
import { sequelize } from '../database/connection'

class CompanionFaculty extends Model<InferAttributes<CompanionFaculty>, InferCreationAttributes<CompanionFaculty>> {
  declare id: CreationOptional<number>
  declare facultyId: number
  declare studyprogrammeId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

CompanionFaculty.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facultyId: INTEGER,
    studyprogrammeId: INTEGER,
    createdAt: DATE,
    updatedAt: DATE
  },
  {
    sequelize,
    tableName: 'companion_faculties',
    underscored: true
  }
)

export default CompanionFaculty
