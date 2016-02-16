'use strict'

var path = require('path')
var EmailTemplate = require('email-templates').EmailTemplate
let mailGun = require('./config/mailgun')
var kue = require('kue')
// var EventEmitter = require('events').EventEmitter
const config = {
  'verify-email': getTemplate('verify-email'),
  'reset-password': getTemplate('reset-password')
}

// var deliver = new EventEmitter()
var jobs = kue.createQueue()
kue.app.listen(3002)

// обработка транзакционных писем (type: postbox)
jobs.process('postbox', function (job, done) {
  // deliver.emit(job.data.template, job.data, done)
  let template = config[job.data.template]

  template.render(job.data.params, function (err, results) {
    if (err) return done(err)

    mailGun.sendEmail({
      to: [job.data.to],
      from: 'LibTuts <no-reply@libtuts.com>',
      subject: job.data.subject,
      html: results.html
      // text: results.text
    })
    .then(res => {
      console.log('success', res)
      done()
    })
    .catch(err => {
      console.log('error', err)
      done(err)
    })
  })
})

function getTemplate (name) {
  return new EmailTemplate(path.resolve(__dirname, 'templates', name))
}

// deliver.on('verify-email', function (data, done) {
//   let template = config[data.template]

//   template.render(data.params, function (err, results) {
//     if (err) return done(err)

//     mailGun.sendEmail({
//       to: [data.to],
//       from: 'LibTuts <no-reply@libtuts.com>',
//       subject: data.subject,
//       html: results.html
//       // text: results.text
//     })
//     .then(res => {
//       console.log('success', res)
//       done()
//     })
//     .catch(err => {
//       console.log('error', err)
//       done(err)
//     })
//   })
// })

// отправить письмо одному юзеру
// mailGun.sendEmail({
//   to: ['kulakowka@gmail.com'],
//   from: 'LibTuts.com <no-reply@libtuts.com>',
//   subject: 'Latest tutorials for you',
//   html: `<p>Hello %recipient_name%</p>
//   <p>gender: %recipient.gender%</p>
//   <p>age: %recipient.age%</p>
//   <p><a href="%unsubscribe_url%">Unsubscribe</a></p>`
// })
// .then(res => console.log(res))
// .catch(err => console.log(err))

// добавить пользователя в лист рассылки дайджеста
// let memberObject = {
//   address: 'kulakowk.a@gmail.com',
//   name: 'kulakowka1',
//   vars: {
//     'gender': 'female',
//     'age': 27
//   }
// }
// mailGun.addMailListsMembers('digest@mg.libtuts.com', [memberObject], 'yes')
// .then(res => console.log(res))
// .catch(err => console.log(err))

// отправить дайджест
// mailGun.sendEmail({
//   to: ['digest@mg.libtuts.com'],
//   from: 'no-reply@libtuts.com',
//   subject: 'Тестовое письмо',
//   html: `<p>Тестовое письмо для %recipient%</p>
//   <p>gender: %recipient.gender%</p>
//   <p>age: %recipient.age%</p>
//   <p><a href="%mailing_list_unsubscribe_url%">unsubscribe</a></p>`
// })
// .then(res => console.log(res))
// .catch(err => console.log(err))
