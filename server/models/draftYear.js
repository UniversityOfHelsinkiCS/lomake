module.exports = (sequelize, DataTypes) => {
  const deadline = sequelize.define(
    'draftYear',
    {
      year: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'draft_years',
    }
  )

  return deadline
}
