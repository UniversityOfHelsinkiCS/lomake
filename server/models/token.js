module.exports = (sequelize, DataTypes) => {
  const token = sequelize.define(
    'token',
    {
      url: DataTypes.STRING,
      programme: DataTypes.STRING,
      type: DataTypes.ENUM('ADMIN', 'WRITE', 'READ'),
      valid: DataTypes.BOOLEAN,
      usageCounter: {
        type: DataTypes.INTEGER,
        field: 'usage_counter',
      },
      faculty: DataTypes.STRING,
    },
    {
      underscored: true,
      tableName: 'tokens',
    }
  )

  return token
}
