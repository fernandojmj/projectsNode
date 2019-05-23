const User = require('../models/User')

class SessionController {
  async store (req, res, next) {
    const { email, password } = req.body

    try {
      console.log('obtendo e-mail')
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ erro: 'usuario não existe' })
      }

      if (!(await user.compareHash(password))) {
        return res.status(400).json({ erro: 'Login invalido' })
      }

      return res.json({ user, token: User.generateToken(user) })
    } catch (error) {
      return res
        .status(400)
        .json({ erro: 'ocorreu um erro ao efetuar o login' })
    }
  }
}

module.exports = new SessionController()
