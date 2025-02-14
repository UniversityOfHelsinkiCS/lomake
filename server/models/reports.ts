import { sequelize } from '../database/connection'
import {
  Model,
  INTEGER,
  JSONB,
  DATE,
  STRING,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  CreationOptional,
} from 'sequelize'

class Report extends Model<InferAttributes<Report>, InferCreationAttributes<Report>> {
  declare id: CreationOptional<number>
  declare studyprogrammeId: ForeignKey<number>
  declare studyprogrammeKey: string
  declare year: number
  declare data: Record<string, string>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}


Report.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    studyprogrammeId: {
      type: INTEGER,
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
    data: {
      type: JSONB,
      defaultValue: null
    },
    createdAt: DATE,
    updatedAt: DATE
  },
  {
    sequelize,
    underscored: true,
    tableName: 'reports',
  }
)

export default Report
