//development variables
require('./env.js')
const apiKey = process.env.apikey

// production variables
// const apiKey = functions.config().contact.apikey

module.exports = (req, res, next) => {
  if (req.body.apiKey === apiKey) {
    return next()
  } else {
    let error = {}
    error.status = 401
    error.message = 'No API Key provided or wrong API key.'
    return res.status(401).send(error)
  }
}