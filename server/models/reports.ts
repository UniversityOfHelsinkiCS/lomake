import { sequelize } from '../database/connection'
import {
    Model,
    INTEGER,
    JSONB,
    DATE,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    CreationOptional,
} from 'sequelize'

// Associated Models
import Studyprogramme from './studyprogramme'

class Report extends Model<InferAttributes<Report>, InferCreationAttributes<Report>> {
    declare id: CreationOptional<number>;
    declare studyprogrammeId: ForeignKey<Studyprogramme['id']>;
    declare year: number;
    declare comments: any
    declare actions: any
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
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
        year: {
            type: INTEGER,
            allowNull: false,
        },
        comments: {
            type: JSONB,
            defaultValue: null
        },
        actions: {
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