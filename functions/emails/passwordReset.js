const body = require('./components/body')
const header = require('./components/header')
const greeting = require('./components/greeting')
const primaryMessage = require('./components/primaryMessage')
const buttonAction = require('./components/buttonAction')
const closing = require('./components/closing')
const mjml2html = require('mjml')

const build = (templateData) => {
  let contents = header.build() + greeting.build(templateData.greeting) + primaryMessage.build(templateData.primaryMessage) + buttonAction.build(templateData.buttonAction) + closing.build(templateData.closing)
  let mjml = body.build(contents)
  let htmlObject = mjml2html(mjml)
  return htmlObject.html
}

module.exports = { build }