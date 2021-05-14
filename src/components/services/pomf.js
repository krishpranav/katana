const request = require('request')
const fs = require('fs')

const utils = require('../utils')

module.exports = class {
  static upload (file, callback) {
    console.log('Uploading image to pomf...')

    const options = {
      url: this.uploadPath
    }

    const post = request.post(options, (error, req, body) => {
      if (error) {
        return callback(null, error)
      }

      if (utils.isJSON(body)) {
        let result = JSON.parse(body)

        if (result.success || result.status === 200) {
          if (result.files) result = result.files[0]

          if (result.url && result.url.substr(0, 4) !== 'http') {
            result.url = `${this.resultPath}/${result.url}`
          }

          const link = { link: (result.url || result.link) }

          return callback(link)
        } else {
          return callback(null, error)
        }
      }
    })

    let form = post.form()

    form.append('type', 'file')
    form.append('files[]', fs.createReadStream(file))
  }

  static setPath (uploadPath, resultPath) {
    this.uploadPath = uploadPath
    this.resultPath = resultPath
  }

  static setToken (token) {
    this.token = token
  }
}
