const os = require('os')

let config = {}

config.defaults = {
  services: {
    uploadService: 'imgur',
    shortenerService: 'is.gd'
  },

  shortcuts: {
    screenshotSelection: 'command+alt+s',
    screenshotFull: '',
    screenshotWindow: '',
    shortenUrl: 'command+alt+0'
  }
}

config.icons = {
  app: `${__dirname}/../app/static/images/icon.png`,
  tray: {
    default: `${__dirname}/../app/static/images/menubar/IconTemplate@2x.png`,
    active: `${__dirname}/../app/static/images/menubar/active/IconTemplate@2x.png`
  }
}

config.paths = {
  application: `${os.homedir()}/.katana`,
  uploads: `${os.homedir()}/.katana/uploads`
}

config.services = {
  imgur: {
    token: ''
  },

  pomf: {
    /*
    'cocaine.ninja': {
      uploadPath: 'https://cocaine.ninja/upload.php',
      resultPath: 'https://a.cocaine.ninja'
    },
    */

    'mixtape.moe': {
      uploadPath: 'https://mixtape.moe/upload.php',
      resultPath: 'https://my.mixtape.moe'
    },

    'pomf.fun': {
      uploadPath: 'https://pomf.fun/upload.php',
      resultPath: 'https://i.pomf.fun'
    }
  },

  shorteners: ['is.gd', 'v.gd']
}

module.exports = config