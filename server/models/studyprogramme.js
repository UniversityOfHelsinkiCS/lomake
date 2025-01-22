export default (sequelize, DataTypes) => {
  const studyprogramme = sequelize.define(
    'studyprogramme',
    {
      key: DataTypes.STRING,
      name: DataTypes.JSONB,
      locked: DataTypes.BOOLEAN,
      claimed: DataTypes.BOOLEAN, // what the hell is this? (Jukka) (I don't know, but it's not used anywhere) (Jussi) (I removed it (Jukka)) (Jussi) (I added it back (Jukka)) (who the hell is Jukka?) (Jussi)
      level: DataTypes.STRING,
      international: DataTypes.BOOLEAN,
      primaryFacultyId: DataTypes.INTEGER,
      lockedForms: DataTypes.JSONB,
    },
    {
      underscored: true,
      tableName: 'studyprogrammes',
    },
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