module.exports = (sequelize, DataTypes) => {
    const report = sequelize.define(
        'report',
        {
            studyprogrammeId: DataTypes.INTEGER,
            year: DataTypes.DATE,
            comments: DataTypes.JSONB,
            measures: DataTypes.JSONB,
        },
        {
            underscored: true,
            tableName: 'reports',
        },
    )

    report.associate = models => {
        report.belongsTo(models.studyprogramme, {
            foreignKey: 'studyprogrammeId',
            as: 'associatedStudyprogramme',
        })
    }

    return report
}
