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

class Report extends Model<InferAttributes<Report>, InferCreationAttributes<Report>> {
    declare id: CreationOptional<number>;
    declare studyprogrammeId: ForeignKey<number>;
    declare year: number;
    declare comments: any
    declare studyprogrammeMeasures: any
    declare facultyMeasures: any
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
        studyprogrammeMeasures: {
            type: JSONB,
            defaultValue: null
        },
        facultyMeasures: {
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