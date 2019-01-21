const body = require('./components/body')
const header = require('./components/header')
const greeting = require('./components/greeting')
const primaryMessage = require('./components/primaryMessage')
const userInfo = require('./components/userInfo.js')
const link = require('./components/link.js')
const buttonAction = require('./components/buttonAction')
const closing = require('./components/closing')
const mjml2html = require('mjml')

const build = (templateData) => {
  let userDetails = templateData.type === 'new' ? userInfo.build(templateData.userInfo) : link.build(templateData.link)
  let contents = header.build() + greeting.build(templateData.greeting) + primaryMessage.build(templateData.primaryMessage) + userDetails + buttonAction.build(templateData.buttonAction) + closing.build(templateData.closing)
  let mjml = body.build(contents)
  let htmlObject = mjml2html(mjml)
  return htmlObject.html
}

module.exports = { build }