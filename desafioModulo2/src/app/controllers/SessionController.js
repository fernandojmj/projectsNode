const { User } = require('../models')

class SessionController {
  async create (res, resp) {
    return resp.render('auth/signin')
  }

  async store (req, resp) {
    console.log(req.body)
    const { email, passoword } = req.body

    const user = await User.findOne({ where: { email } })
    console.log(user)

    if (!user) {
      req.flash('error', 'Usuario nao existe')
      return resp.redirect('/')
    }

    if (!(await user.checkPassoword(passoword))) {
      req.flash('error', 'Login ou senha incorreto')
      return resp.redirect('/')
    }

    req.session.user = user

    return resp.redirect('/app/dashboard')
  }

  destroy (req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')
      return res.redirect('/')
    })
  }
}

module.exports = new SessionController()
