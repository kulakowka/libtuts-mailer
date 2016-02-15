'use strict'

var MailGun = require('mailgun-es6')
var mailGun = new MailGun({
  privateApi: 'key-2fea16609fb8a7434a05e84a4c480ac1',
  publicApi: 'pubkey-f9bac273cf8d0d292908442e4edec19b',
  domainName: 'mg.libtuts.com'
})

module.exports = mailGun
