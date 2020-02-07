module.exports = (sequelize, DataTypes) => {
  const answer = sequelize.define(
    'answer',
    {
      programme: DataTypes.STRING,
      data: DataTypes.JSONB,
      year: DataTypes.INTEGER
    },
    {
      underscored: true,
      tableName: 'answers'
    }
  )

  return answer
}
