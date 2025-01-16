type ReportAttributes = {
    studyprogrammeId: number
    year: number
    comments: any
    actions: any
}

export default (sequelize: any, DataTypes: any) => {
    const report = sequelize.define(
        'report',
        {
            studyprogrammeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comments: {
                type: DataTypes.JSONB,
                defaultValue: null
            },
            actions: {

                type: DataTypes.JSONB,
                defaultValue: null
            },
        },
        {
            underscored: true,
            tableName: 'reports',
        },
    )

    report.associate = (models: any) => {
        report.belongsTo(models.studyprogramme, {
            foreignKey: 'studyprogrammeId',
            as: 'associatedStudyprogramme',
        })
    }

    return report
}
