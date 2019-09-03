'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    console.log('entrou no login')
    try {
      const { email, password } = request.all()
      const token = await auth.attempt(email, password)
      console.log(token)
      return token
    } catch (err) {
      return response.status(err.status).send({
        error: {
          erro: 'Login inválido'
        }
      })
    }
  }
}

module.exports = SessionController
