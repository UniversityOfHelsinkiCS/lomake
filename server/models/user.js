module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      uid: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      access: DataTypes.JSONB,
      specialGroup: DataTypes.JSONB,
      lastLogin: DataTypes.DATE,
      iamGroups: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      underscored: true,
      tableName: 'users',
    }
  )

  return user
}
