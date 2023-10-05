module.exports = (sequelize, DataTypes) => {
  const tempAnswer = sequelize.define(
    'tempAnswer',
    {
      programme: DataTypes.STRING,
      data: DataTypes.JSONB,
      year: DataTypes.INTEGER,
      form: DataTypes.INTEGER,
      ready: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
      tableName: 'temp_answers',
    },
  )

  return tempAnswer
}
