module.exports = (sequelize, DataTypes) => {
  const backupAnswer = sequelize.define(
    'backupAnswer',
    {
      programme: DataTypes.STRING,
      data: DataTypes.JSONB,
      form: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'backup_answers',
    }
  )

  return backupAnswer
}
