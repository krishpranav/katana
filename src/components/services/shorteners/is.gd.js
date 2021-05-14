const request = require('request')

module.exports = class {
  static shorten (url, callback) {
    console.log(`Shortening URL: ${url} with is.gd`)

    const options = {
      url: 'https://is.gd/create.php',
      form: {
        format: 'json',
        url: url
      }
    }

    request.post(options, (error, response, body) => {
      if (!error) {
        try {
          const data = JSON.parse(body)
          const link = {link: data.shorturl}

          return callback(link)
        } catch (error) {
          return callback(null, error)
        }
      } else {
        return callback(null, error)
      }
    })
  }
}
