window.$ = window.jQuery = require('../static/js/jquery.min.js')

require('../static/js/mousetrap.min.js')
require('../static/js/date.format.min.js')


$('#general').show()

const ipc = require('electron').ipcRenderer
const remote = require('electron').remote

let optionsObj 

$('.close').click(() => {
    saveAndClose()
  })
  
  $('.close-prompt').click(() => {
    $('.backdrop').hide()
  })
  
  ipc.send('getOptions')
  ipc.send('getVersion')
  
  ipc.on('getVersion', (event, version) => {
    window.version = version
})
  

