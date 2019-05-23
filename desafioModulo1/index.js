const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

const middleware = (req, res, next) => {
  if (req.query.age === '') {
    console.log('age em branco')
    var mensagem = 'campo obrigatorio'
    return res.render('home.njk', { mensagem })
  } else {
    mensagem = ''
  }

  return next()
}

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.set('view engine', 'njk')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('home.njk')
})

app.post('/check', (req, res) => {
  if (req.body.age >= 18) {
    return res.redirect(`/major?age= ${req.body.age}`)
  } else {
    return res.redirect('/minor?age=' + req.body.age)
  }
})

app.get('/major', middleware, (req, res) => {
  console.log(req.query.age)
  var idade = req.query.age
  res.render('major.njk', { idade })
})

app.get('/minor', middleware, (req, res) => {
  var idade = req.query.age
  res.render('minor.njk', { idade })
})

app.listen(3000)
