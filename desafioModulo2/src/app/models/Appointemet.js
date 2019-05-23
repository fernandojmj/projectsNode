module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    date: DataTypes.DATE
    //  createdAt: DataTypes.DATE,
    // updatedAt: DataTypes.DATE
  })

  Appointment.associate = models => {
    Appointment.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' })
    Appointment.belongsTo(models.User, {
      as: 'provider',
      foreignKey: 'provider_id'
    })
  }

  return Appointment
}
