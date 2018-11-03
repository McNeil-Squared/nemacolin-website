const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer')
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
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
app.use(myMiddleware);

// build multiple CRUD interfaces:

app.post('/', (req, res) => {
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
  <style>
    .wrapper {
      margin: 0;
      padding: 1.0rem 0;
      background-color: #ccc
    }
    
    .message, .info {
      font-family: 'Roboto', sans-serif;
      border-collapse: collapse;
      margin: auto;
      width: 90%;
      background-color: #fff;
      margin: auto;
    }
    
    .message td, .info td {
      padding: 0.5rem;
      background-color: #fff;
    }
    
    .info td {
      border: 1px solid #000;
    }
    
    img {
      display: block;
      margin: auto;
    }
    
    .logo {
      border-bottom: 0;
      padding-bottom: 0;
    }
    
    .logo-caption {
      text-align: center;
      color: #ba1b1d;
      
      border-top: none;
      padding-top: 0
    }
    
    .logo-caption, .title, .name, .ip-title {
      font-weight: 600;
    }
    
    .title {
      font-size: 1.25rem;
      text-align: center;
      padding-bottom: 1.0rem !important;
    }
    .hr {
      background-color: #ba1b1d !important;
      padding: 0 !important;
      border: 1px solid #ba1b1d;
      border-radius: 2px;
      height: 4px;
    }
    
    .from {
      padding-top: 1.0rem !important;
    }
    
    .name {
      width: 10%;
    }
    
    .message-name {
      text-align: center;
    }
    
    .ip-title {
      text-align: center;
    }
  </style>
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  <div class="wrapper">
    <table class="message">
      <tr><td colspan="2" class="logo">
        <img src="https://nemacolininc.com/favicons/favicon-96x96.png" alt="nemacolin logo">
      </td></tr>
      <tr><td colspan="2" class="logo-caption">Nemacolin Inc</td></tr>
      <tr><td colspan="2" class="title">New Contact Form Entry</td></tr>
      <tr><td colspan="2" class="hr"></td></tr>
      <tr><td class="name from">From:</td><td class="content from">${name}</td></tr>
      <tr><td class="name">Email:</td><td>${email}</td></tr>
      <tr><td colspan="2" class="name message-name">Message</td></tr>
      <tr><td colspan="2">${message}</td></tr>
    </table>
    <table class="info">
      <p class="ip-title">Submitter Information</p>
      <tr><td>ip</td><td id="ip">${ipAddress}</td></tr>
      <tr><td>Host</td><td id="ip-coords">${ipHostname}</td></tr>
      <tr><td>Organization</td><td id="ip-org">${ipOrganization}</td></tr>
      <tr><td>City</td><td id="ip-city">${ipCity}</td></tr>
      <tr><td>Region</td><td id="ip-region">${ipRegion}</td></tr>
      <tr><td>Zip Code</td><td id="ip-coords">${ipZipcode}</td></tr>
      <tr><td>Country</td><td id="ip-country">${ipCountry}</td></tr>
      <tr><td>Coords</td><td id="ip-coords">${ipCoords}</td></tr>
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
    if (error) { return console.log(error) }
    else { return console.log('Message sent: %s', info.messageId) }
})
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);

