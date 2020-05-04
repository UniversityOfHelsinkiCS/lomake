module.exports = (sequelize, DataTypes) => {
  const studyprogramme = sequelize.define(
    'studyprogramme',
    {
      key: DataTypes.STRING,
      name: DataTypes.JSONB,
      locked: DataTypes.BOOLEAN,
      claimed: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
      tableName: 'studyprogrammes',
    }
  )

  return studyprogramme
}
