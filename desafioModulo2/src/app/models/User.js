const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      passoword: DataTypes.VIRTUAL,
      passoword_hash: DataTypes.STRING,
      provider: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeSave: async user => {
          if (user.passoword) {
            user.passoword_hash = await bcrypt.hash(user.passoword, 8)
          }
        }
      }
    }
  )

  User.prototype.checkPassoword = function (passoword) {
    return bcrypt.compare(passoword, this.passoword_hash)
  }

  return User
}
