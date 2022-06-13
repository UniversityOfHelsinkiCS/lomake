module.exports = (sequelize, DataTypes) => {
  const companionFaculty = sequelize.define(
    'companionFaculty',
    {
      facultyId: DataTypes.INTEGER,
      studyprogrammeId: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'companion_faculties',
    }
  )

  companionFaculty.associate = models => {
    companionFaculty.belongsTo(models.faculty, { foreignKey: 'facultyId' })
    companionFaculty.belongsTo(models.studyprogramme, { foreignKey: 'studyprogrammeId' })
  }

  return companionFaculty
}
