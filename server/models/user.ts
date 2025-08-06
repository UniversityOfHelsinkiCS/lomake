import { InferAttributes, InferCreationAttributes, Model, CreationOptional, DATE, INTEGER, JSONB, STRING, ARRAY } from 'sequelize'
import { sequelize } from '../database/connection'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare uid: string
  declare firstname: string
  declare lastname: string
  declare email: string
  declare access: Record<string, any>
  declare specialGroup: Record<string, any>
  declare lastLogin: Date
  declare iamGroups: string[]
  declare tempAccess: Record<string, any>[]
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

User.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uid: STRING,
    firstname: STRING,
    lastname: STRING,
    email: STRING,
    access: JSONB,
    specialGroup: JSONB,
    lastLogin: DATE,
    iamGroups: ARRAY(STRING),
    tempAccess: ARRAY(JSONB),
    createdAt: DATE,
    updatedAt: DATE,
  },
  {
    sequelize,
    underscored: true,
    tableName: 'users',
  },
)

export default User
