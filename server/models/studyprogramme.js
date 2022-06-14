module.exports = (sequelize, DataTypes) => {
  const studyprogramme = sequelize.define(
    'studyprogramme',
    {
      key: DataTypes.STRING,
      name: DataTypes.JSONB,
      locked: DataTypes.BOOLEAN,
      claimed: DataTypes.BOOLEAN,
      level: DataTypes.STRING,
      international: DataTypes.BOOLEAN,
      primaryFacultyId: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'studyprogrammes',
    }
  )

  studyprogramme.associate = models => {
    // primaryFaculty is the owner of this studyprogram
    studyprogramme.belongsTo(models.faculty, {
      foreignKey: 'primaryFacultyId',
      as: 'primaryFaculty',
    })

    // companionFaculties are faculties which support this studyprogramme. "kumppanuustietekunta"
    studyprogramme.belongsToMany(models.faculty, {
      through: 'companionFaculty',
      foreignKey: 'studyprogrammeId',
      as: 'companionFaculties',
    })
  }

  return studyprogramme
}
