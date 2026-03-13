import { InferAttributes, InferCreationAttributes, Model, CreationOptional, INTEGER, DATE, STRING, BOOLEAN } from 'sequelize'
import { sequelize } from '../database/connection.js'

class InterventionProcedure extends Model<InferAttributes<InterventionProcedure>, InferCreationAttributes<InterventionProcedure>> {
  declare id: CreationOptional<number>
  declare studyprogrammeKey: string
  declare active: boolean
  declare startYear: number
  declare endYear: number | null
  declare createdAt: Date
  declare updatedAt: Date
}

InterventionProcedure.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studyprogrammeKey: {
      type: STRING,
      allowNull: false,
    },
    active: {
      type: BOOLEAN,
      allowNull: false,
    },
    startYear: {
      type: INTEGER,
      allowNull: false,
    },
    endYear: {
      type: INTEGER,
      allowNull: true,
    },
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    sequelize,
    tableName: 'interventionprocedures',
    underscored: true,
  }
)

export default InterventionProcedure