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

ipc.on('getOptions', (event, options) => {
    optionsObj = options
  
    for (const key in options.hosts) {
      let service = options.hosts[key]
  
      let select = '#services select[name="uploadService"] > optgroup'
      let option = `<option value="pomf:${service}">${service}</option>'`
  
      $(select).append(option)
    }
  
    for (const key in options.history.reverse()) {
      let screenshot = options.history[key]
  
      let element = `<li class="screenshot">
      <div class="thumbnail"><span class="helper"></span><img src="${screenshot.url.link}" /></div>
      <p><i class="icon ion-link"></i> <a href="${screenshot.url.link}" target="_blank">${screenshot.url.link}</a></p>
      <p><i class="icon ion-clock"></i> <span style="opacity:0.75">${parseTime(screenshot.timestamp)}</span></p></li>`
  
      $('#history .history-container > ul').append(element)
    }
  
    if (options.showIcon === true) { $('#showIcon').prop('checked', true) }
  
    if (options.deleteOnUpload === true) { $('#deleteOnUpload').prop('checked', true) }
  
    if (options.startAtLogin === true) { $('#startAtLogin').prop('checked', true) }
  
    if (options.shortcuts) {
      for (const shortcut of Object.keys(options.shortcuts)) {
        let combo = options.shortcuts[shortcut]
  
        $('#' + shortcut).val(combo)
      }
    }
  
    if (options.services && options.services.uploadService) {
      $('select[name="uploadService"]').val(options.services.uploadService)
    }
  
    if (options.services && options.services.shortenerService) {
      $('select[name="shortenerService"]').val(options.services.shortenerService)
    }
  
    if (options.customService) {
      $('#servicePrompt input[name="uploadPath"]').val(options.customService.uploadPath)
      $('#servicePrompt input[name="resultPath"]').val(options.customService.resultPath)
      $('select[name="uploadService"]').val('custom')
    }
  })
  
  ipc.on('showService', (event, current) => {
    showPrompt('#servicePrompt')
  })
  
  ipc.on('showLoader', (event, current) => {
    showPrompt('#loader')
})
  

