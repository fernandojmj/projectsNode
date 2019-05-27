const Ad = require('../models/Ad')

class AdController {
  async findall (req, res) {
    const filters = {}

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i')
    }

    // if (req.query.author) {
    //   filters.author.name = new RegExp(req.query.author, 'i')
    // }

    console.log(filters)
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      sort: '-createdAt',
      populate: ['author']
    })
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
    console.log(req.body)
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
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
