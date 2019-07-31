var ip = require('ip')
const OS = require('os')
import printer from 'printer'

var mdns = require('mdns')

var ads = []

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

    var printAd = mdns.createAdvertisement(mdns.tcp('tfprinter'), 1008, {
      name: `${p.name} - ${OS.hostname()}`,
      txtRecord: txtRecords
    })

    printAd.start()
    ads.push(printAd)
  })
})

process.on('exit' as any, code => {
  if (ads && ads.length > 0) {
    ads.forEach(ad => {
      ad.stop()
    })
  }
})
