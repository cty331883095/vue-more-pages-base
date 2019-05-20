const express = require('express')
const app = express()
const path = require('path')
const opn = require('opn')
const os = require('os')
const config = require('./config/myconf')

const Port = 3366

function getIPAddress(res) {
  const interfaces = os.networkInterfaces()
  Object.keys(interfaces).forEach(key => {
    const filter = interfaces[key].filter(alias => alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
    if (filter && filter.length)(res = filter[0])
  })
  return res.address || 'localhost'
}
const addressRoot = config.build.addressRoot
const htmlPath = config.build.htmlPath
app.use(express.static(path.join(__dirname, '/' + addressRoot)))
app.listen(Port, () => {
  const page = `http://${getIPAddress()}:${Port}${htmlPath}`
  console.log(`server work at ${page}`)
  opn(page)
})
