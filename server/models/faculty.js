module.exports = (sequelize, DataTypes) => {
  const faculty = sequelize.define(
    'faculty',
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      programmes: DataTypes.JSONB,
    },
    {
      underscored: true,
      tableName: 'faculties',
    }
  )

  return faculty
}
