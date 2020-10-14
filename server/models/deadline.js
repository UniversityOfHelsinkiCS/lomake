module.exports = (sequelize, DataTypes) => {
  const deadline = sequelize.define(
    'deadline',
    {
      date: DataTypes.DATE,
    },
    {
      underscored: true,
      tableName: 'deadlines',
    }
  )

  return deadline
}
