export default (sequelize, DataTypes) => {
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

    report.associate = models => {
        report.belongsTo(models.studyprogramme, {
            foreignKey: 'studyprogrammeId',
            as: 'associatedStudyprogramme',
        })
    }

    return report
}
