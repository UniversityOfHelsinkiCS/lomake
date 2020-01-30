module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      uid: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      admin: DataTypes.BOOLEAN,
      access: DataTypes.BOOLEAN,
      irrelevant: DataTypes.BOOLEAN
    },
    {
      underscored: true,
      tableName: 'users'
    }
  )

  return user
}
