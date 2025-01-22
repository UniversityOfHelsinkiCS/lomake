import { sequelize } from '../database/connection'
import {
  Model,
  INTEGER,
  JSONB,
  STRING,
  BOOLEAN,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Association,
  CreationOptional,
  DATE
} from 'sequelize'

// Associated Models
import Report from './reports'
import Faculty from './faculty'

class Studyprogramme extends Model<InferAttributes<Studyprogramme>, InferCreationAttributes<Studyprogramme>> {
  declare id: CreationOptional<number>;
  declare key: string
  declare name: any
  declare locked: boolean
  declare claimed: boolean
  declare level: string
  declare international: boolean
  declare primaryFacultyId: ForeignKey<number>
  declare lockedForms: any
  declare createdAt: Date
  declare updatedAt: Date

  declare static associations: {
    reports: Association<Studyprogramme, Report>;
  }
}

Studyprogramme.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: STRING,
      allowNull: false,
    },
    name: {
      type: JSONB,
      allowNull: false,
    },
    locked: {
      type: BOOLEAN,
      defaultValue: false,
    },
    claimed: {
      type: BOOLEAN,
      defaultValue: false,
    },
    level: {
      type: STRING,
      allowNull: false,
    },
    international: {
      type: BOOLEAN,
      defaultValue: false,
    },
    primaryFacultyId: {
      type: INTEGER,
      allowNull: false,
    },
    lockedForms: {
      type: JSONB,
      defaultValue: null,
    },
    createdAt: DATE,
    updatedAt: DATE
  },
  {
    sequelize,
    underscored: true,
    tableName: 'studyprogrammes',
  }
)

// Currently faculty is associated without typescript because faculty model is not yet in ts.
Studyprogramme.belongsTo(sequelize.models.faculty, {
  foreignKey: 'primaryFacultyId',
  as: 'primaryFaculty',
})

Studyprogramme.belongsToMany(sequelize.models.faculty, {
  through: 'companionFaculty',
  foreignKey: 'studyprogrammeId',
  as: 'companionFaculties',
})

// Report model is associated with Studyprogramme model in typescript way
Studyprogramme.hasMany(Report, {
  sourceKey: 'id',
  foreignKey: 'studyprogrammeId',
  as: 'reports',
})

export default Studyprogramme