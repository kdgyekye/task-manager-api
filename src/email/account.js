// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
sendgridAPIkey = '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'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendgridAPIkey)

const welcomeEmail = (email, name) => {
    const welcomeMsg = {
        to: email,
        from: 'kingsleygyekye@gmail.com',
        subject: 'Welcome To Our Service',
        text: `Welcome ${name}! We're glad to have you on board. Enjoy the service and stay tuned for updates and more products`,
      }
      sgMail
        .send(welcomeMsg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error.response.body.errors)
        })
}

module.exports = {
    welcomeEmail
}