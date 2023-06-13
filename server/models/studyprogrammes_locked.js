module.exports = (sequelize, DataTypes) => {
  const studyprogrammesLocked = sequelize.define(
    'studyprogrammesLocked',
    {
      key: DataTypes.STRING,
      studyprogrammeId: DataTypes.INTEGER,
      locked: DataTypes.JSONB,
    },
    {
      underscored: true,
      tableName: 'studyprogrammes_locked',
    }
  )

  studyprogrammesLocked.associate = models => {
    studyprogrammesLocked.belongsTo(models.studyprogramme, {
      foreignKey: 'studyprogrammeId',
      as: 'studyprogramme',
    })
  }
  return studyprogrammesLocked
}
