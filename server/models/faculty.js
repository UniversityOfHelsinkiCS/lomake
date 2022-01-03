module.exports = (sequelize, DataTypes) => {
  const faculty = sequelize.define(
    'faculty',
    {
      code: DataTypes.STRING,
      name: DataTypes.JSONB,
    },
    {
      underscored: true,
      tableName: 'faculties',
    }
  )

  faculty.associate = function (models) {
    // companionStudyprogrammes indicate that this faculty is working in colloboration with the programme,
    // but is not its owner. aka. "kumppanuusohjelma"
    faculty.belongsToMany(models.studyprogramme, {
      through: 'companionFaculty',
      foreignKey: 'facultyId',
      as: 'companionStudyprogrammes',
    }),
      // ownedProgrammes are owned by the faculty. "vastuutiedekunta"
      faculty.hasMany(models.studyprogramme, {
        as: 'ownedProgrammes',
        foreignKey: 'primaryFacultyId',
      })
  }

  return faculty
}
