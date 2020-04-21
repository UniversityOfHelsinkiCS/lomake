module.exports = (sequelize, DataTypes) => {
  const backupAnswer = sequelize.define(
    'backupAnswer',
    {
      programme: DataTypes.STRING,
      data: DataTypes.JSONB,
    },
    {
      underscored: true,
      tableName: 'backup_answers',
    }
  )

  return backupAnswer
}
