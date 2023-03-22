module.exports = (sequelize, DataTypes) => {
  const answer = sequelize.define(
    'answer',
    {
      programme: DataTypes.STRING,
      data: DataTypes.JSONB,
      year: DataTypes.INTEGER,
      form: DataTypes.INTEGER,
      submittedBy: {
        type: DataTypes.STRING,
        field: 'submitted_by',
      },
    },
    {
      underscored: true,
      tableName: 'answers',
    }
  )

  return answer
}
