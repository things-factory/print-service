var ip = require('ip')
var bonjour = require('bonjour')()
import printer from 'printer'

process.on('bootstrap-module-middleware' as any, app => {
  /* app에 middleware를 추가할 수 있다. */
  var servicePort = process.env.PORT
  var ipAddress = ip.address()

  var printers = printer.getPrinters()
  printers.forEach(p => {
    let txtRecords = {
      'service-url': `http://${ipAddress}:${servicePort}`
    }
    bonjour.publish({
      name: `${p.name}`,
      type: 'tfprinter',
      port: 1008,
      protocol: 'tcp',
      txt: txtRecords
    })
  })
})
