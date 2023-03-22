module.exports = (sequelize, DataTypes) => {
  const deadline = sequelize.define(
    'deadline',
    {
      date: DataTypes.DATE,
      form: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'deadlines',
    }
  )

  return deadline
}
