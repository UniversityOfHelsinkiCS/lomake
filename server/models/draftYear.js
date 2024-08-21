export default (sequelize, DataTypes) => {
  const draftYears = sequelize.define(
    'draftYear',
    {
      year: DataTypes.INTEGER,
    },
    {
      underscored: true,
      tableName: 'draft_years',
    },
  )

  return draftYears
}
