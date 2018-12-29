const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer')
const admin = require('firebase-admin')


// development variables
require('./env.js')
const gmailEmail = process.env.email
const gmailPassword = process.env.password
const apiKey = process.env.apikey
const private_key = process.env.privateKey.replace(/\\n/g, '\n')
const client_email = process.env.clientEmail

// production variables
// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password
// const apiKey = functions.config().contact.apikey
// const private_key = functions.config().firebaseauth.privateKey
// const client_email = functions.config().firebaseauth.clientEmail

// initialize firebase admin

const config = {
  credential: admin.credential.cert({ private_key, client_email }),
  databaseURL: 'https://nemacolin-website.firebaseio.com'
}

admin.initializeApp({ config })

// send emails with Nodemailer

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:

app.post('/', (req, res) => {
  if (req.body.apiKey === apiKey) {
    const name = req.body.name
    const email = req.body.email
    const message = req.body.message
    const ipAddress = req.body.ipData.ip
    const ipHostname = req.body.ipData.hostname
    const ipOrganization = req.body.ipData.org
    const ipCity = req.body.ipData.city
    const ipRegion = req.body.ipData.region
    const ipZipcode = req.body.ipData.postal
    const ipCountry = req.body.ipData.country
    const ipCoords = req.body.ipData.loc
  
    const htmlBlock = `
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <div class="wrapper" style="margin: 0;padding: 1.0rem 0;background-color: #ccc;">
      <table class="message" style="font-family: 'Roboto', sans-serif;border-collapse: collapse;margin: auto;width: 90%;background-color: #fff;">
        <tr><td colspan="2" class="logo" style="border-bottom: 0;padding-bottom: 0;padding: 0.5rem;background-color: #fff;">
          <img src="http://localhost:5000/favicons/favicon-96x96.png" alt="nemacolin logo" style="display: block;margin: auto;">
        </td></tr>
        <tr><td colspan="2" class="logo-caption" style="text-align: center;color: #ba1b1d;border-top: none;padding-top: 0;font-weight: 600;padding: 0.5rem;background-color: #fff;">Nemacolin Inc</td></tr>
        <tr><td colspan="2" class="title" style="font-weight: 600;font-size: 1.25rem;text-align: center;padding: 0.5rem;background-color: #fff;padding-bottom: 1.0rem !important;">New Contact Form Entry</td></tr>
        <tr><td colspan="2" class="hr" style="border: 1px solid #ba1b1d;border-radius: 2px;height: 4px;padding: 0 !important;background-color: #ba1b1d !important;"></td></tr>
        <tr><td class="name from" style="font-weight: 600;width: 10%;padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">From:</td><td class="content from" style="padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">${name}</td></tr>
        <tr><td class="name" style="font-weight: 600;width: 10%;padding: 0.5rem;background-color: #fff;">Email:</td><td style="padding: 0.5rem;background-color: #fff;">${email}</td></tr>
        <tr><td colspan="2" class="name message-name" style="font-weight: 600;width: 10%;text-align: center;padding: 0.5rem;background-color: #fff;">Message</td></tr>
        <tr><td colspan="2" style="padding: 0.5rem;background-color: #fff;">${message}</td></tr>
      </table>
      <table class="info" style="font-family: 'Roboto', sans-serif;border-collapse: collapse;margin: auto;width: 90%;background-color: #fff;">
        <p class="ip-title" style="font-weight: 600;text-align: center;">Submitter Information</p>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">ip</td><td id="ip" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipAddress}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Host</td><td id="ip-coords" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipHostname}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Organization</td><td id="ip-org" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipOrganization}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">City</td><td id="ip-city" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipCity}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Region</td><td id="ip-region" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipRegion}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Zip Code</td><td id="ip-coords" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipZipcode}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Country</td><td id="ip-country" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipCountry}</td></tr>
        <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Coords</td><td id="ip-coords" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${ipCoords}</td></tr>
      </table>
    </div>
    `
  
    const mailOptions = {
      from: `"${name}" ${email}`,
      to: 'info@nemacolininc.com',
      subject: 'New Nemacolin Contact Form Entry',
      html: htmlBlock
    }
  
    return mailTransport.sendMail(mailOptions, (error, info) => {
      res.set({'Access-Control-Allow-Origin': '*'})
      if (info) {
        res.status(200).send('success')
      }
      else {
        console.log(error)
        res.status(500).send('error')
      }
    })
  } else {
    return res.status(400).send('incorrect or missing api key')
  }
});

app.post('/adduser', (req, res) => {

  let userData = {
    email: req.body.email,
    emailVerified: req.body.emailVerified,
    password: req.body.password,
    displayName: `${req.body.firstName} ${req.body.lastName}`
  }

  admin.auth().createUser(userData)
    .then((userRecord) => {
      return res.status(200).send(userRecord)
    })
    .catch((error) => {
      console.log('add user error: ', error)
      return res.status(500).send(error)
    })
})

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);

