'use strict'

var MailGun = require('mailgun-es6')
var mailGun = new MailGun({
  privateApi: process.env.MAILGUN_PRIVATE_API,
  publicApi: process.env.MAILGUN_PRIVATE_API,
  domainName: 'mg.libtuts.com'
})

module.exports = mailGun
