const Ad = require('../models/Ad')
const User = require('../models/User')
const mail = require('.././services/Mail')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body
    console.log(ad)
    console.log(content)
    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    console.log(purchaseAd)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
