module.exports = (sequelize, DataTypes) => {
  const deadline = sequelize.define(
    'deadline',
    {
      date: DataTypes.DATE,
      passed: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
      tableName: 'deadlines',
    }
  )

  return deadline
}
