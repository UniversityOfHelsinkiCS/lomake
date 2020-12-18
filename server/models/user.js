module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      uid: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      admin: DataTypes.BOOLEAN,
      access: DataTypes.JSONB,
      wideReadAccess: DataTypes.BOOLEAN,
      hasWideReadAccess: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.admin || this.wideReadAccess
        },
        set() {
          throw new Error('Do not try to set the `hasWideReadAccess` value!')
        },
      },
    },
    {
      underscored: true,
      tableName: 'users',
    }
  )

  return user
}
