const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body
    console.log(ad)
    console.log(content)
    const purchaseAd = await Ad.findById(ad).populate('author')

    if (purchaseAd.purchase === null) {
      const user = await User.findById(req.userId)

      console.log(purchaseAd)

      Queue.create(PurchaseMail.key, {
        ad: purchaseAd,
        user,
        content
      }).save()

      const pucharse = await Purchase.create({ ...req.body, Ad: req.body.ad })

      console.log('puchase salva')
      console.log(pucharse)

      return res.send()
    } else {
      return res.status(401).json({ error: 'Anuncio já foi vendido' })
    }
  }
}

module.exports = new PurchaseController()
