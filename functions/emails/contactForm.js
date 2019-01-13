const body = require('./components/body')
const header = require('./components/header')
const greeting = require('./components/greeting')
const primaryMessage = require('./components/primaryMessage')
const userInfo = require('./components/userInfo')
const contactFormMessage = require('./components/contactFormMessage')
const ipAddress = require('./components/ipAddress')
const mjml2html = require('mjml')

const build = (templateData) => {
  let contents = header.build() + greeting.build(templateData.greeting) + primaryMessage.build(templateData.primaryMessage) + userInfo.build(templateData.userInfo) + contactFormMessage.build(templateData.contactFormMessage) + ipAddress.build(templateData.ipAddress)
  let mjml = body.build(contents)
  let html = mjml2html(mjml)
  return html.html
}


module.exports = { build }