const path = require('path')

class FileController {
  show (req, res) {
    const { file } = req.params
    const filePath = path.resolve('tmp', 'uploads', file)
    console.log(filePath)
    return res.sendFile(filePath)
  }
}

module.exports = new FileController()
