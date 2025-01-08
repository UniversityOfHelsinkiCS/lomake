module.exports = (sequelize, DataTypes) => {
    const report = sequelize.define(
        'report',
        {
            studyprogrammeId: DataTypes.INTEGER,
            year: DataTypes.INTEGER,
            comments: DataTypes.JSONB,
            measures: DataTypes.JSONB,
        },
        {
            underscored: true,
            tableName: 'reports',
        },
    )

    report.associate = models => {
        // sutdyprogramme has a set of report
        report.belongsTo(models.studyprogramme, {
            foreignKey: 'studyprogrammeId',
            as: 'associatedStudyprogramme',
        })
    }

    return report
}
