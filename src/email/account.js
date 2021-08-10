// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
sendgridAPIkey = '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'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendgridAPIkey)
const msg = {
  to: 'kingsleygyekye@gmail.com',
  from: 'kingsleygyekye@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error.response.body.errors)
  })