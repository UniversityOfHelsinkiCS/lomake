module.exports = (sequelize, DataTypes) => {
    const comments = sequelize.define(
        'comments',
        {
            studyprogrammeId: DataTypes.INTEGER,
            content: DataTypes.JSONB,
            lastEditedBy: DataTypes.INTEGER, // User id 
        },
        {
            underscored: true,
            tableName: 'comments',
        },
    )

    comments.associate = models => {
        // sutdyprogramme has a set of comments
        comments.belongsTo(models.studyprogramme, {
            foreignKey: 'studyprogrammeId',
            as: 'associatedStudyprogramme',
        })
    }

    return comments
}
