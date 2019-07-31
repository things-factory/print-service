var ip = require('ip')
var bonjour = require('bonjour')()
const OS = require('os')
import printer from 'printer'

process.on('bootstrap-module-middleware' as any, app => {
  /* app에 middleware를 추가할 수 있다. */
  var servicePort = process.env.PORT
  var ipAddress = ip.address()

  var printers = printer.getPrinters()
  printers.forEach(p => {
    let txtRecords = {
      'service-url': `http://${ipAddress}:${servicePort}`,
      name: p.name
    }
    bonjour.publish({
      name: `${p.name} - ${OS.hostname()}`,
      type: 'tfprinter',
      port: 1008,
      protocol: 'tcp',
      txt: txtRecords
    })
  })
})

process.on('exit' as any, code => {
  bonjour.unpublishAll(() => {
    bonjour.destroy()
  })
})
