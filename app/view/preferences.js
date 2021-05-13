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

$('.sidebar li').click((event) => {
  const url = event.target.id.split('#')[1]

  if (!url) return

  if (url === 'save') {
    return $('#savePrompt').fadeIn(500)
  }

  switchView(url, event.target)
})

$('#servicePrompt button[name="save"]').click(() => {
  let uploadPath = $('#servicePrompt input[name="uploadPath"]').val()
  let resultPath = $('#servicePrompt input[name="resultPath"]').val()

  if (!uploadPath || !resultPath) return

  ipc.send('updateService', { 'uploadPath': uploadPath, 'resultPath': resultPath })

  $('.backdrop').fadeOut(200)
})

$('a[href="#check"]').click(() => {
  ipc.send('checkForUpdate')
})

$('a[href="#cancel"]').click(() => {
  $('.backdrop').hide()
})

$('input[type="checkbox"]').change(function () {
  let option = $(this).attr('id')

  optionsObj[option] = this.checked
})

$('select[name="uploadService"]').change(function () {
  let service = $(this).find('option:selected').val()
  if (service === 'custom') {
    return (
      showPrompt('#servicePrompt')
    )
  } else {
    delete optionsObj.customService
  }

  if (!optionsObj.services) optionsObj.services = {}

  optionsObj.services.uploadService = service
})

$('select[name="shortenerService"]').change(function () {
  let service = $(this).find('option:selected').val()

  if (!optionsObj.services) optionsObj.services = {}

  optionsObj.services.shortenerService = service
})

$('.shortcutInput').focus((event) => {
  let shortcutInput = $('#' + event.target.id)

  shortcutInput.val('Recording shortcut')
  shortcutInput.addClass('active')

  $(shortcutInput).parent().find('.icon').show().addClass('spin')

  Mousetrap.record(function (sequence) {
    const combo = parseCombo(sequence[0])
    optionsObj.shortcuts[event.target.id] = combo
    shortcutInput.val(combo)
    shortcutInput.blur()
  })
})

$('.shortcutInput').blur((event) => {
  let shortcutInput = $('#' + event.target.id)
  let combo = optionsObj.shortcuts[event.target.id]

  $(shortcutInput).val(combo)
  $(shortcutInput).removeClass('active')

  $(shortcutInput).parent().find('.icon').hide().removeClass('spin')
})