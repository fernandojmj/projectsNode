const Ad = require('../models/Ad')

class AdController {
  async findall (req, res) {
    const ads = await Ad.find()
    return res.json(ads)
  }

  async show (req, res) {
    const ad = await Ad.findById(req.params.id)
    return res.json(ad)
  }

  async create (req, res) {
    console.log(req.userId)
    const ad = await Ad.create({ ...req.body, author: req.userId })

    return res.json(ad)
  }

  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.params.body, {
      new: true
    })

    return res.json(ad)
  }

  async delete (req, res) {
    await Ad.findByIdAndRemove(req.params.id)

    return res.send()
  }
}

module.exports = new AdController()
