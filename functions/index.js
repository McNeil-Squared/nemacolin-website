const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer')
const admin = require('firebase-admin')
const middleware = require('./middleware')
const emailVerification = require('./emails/emailVerification')
const contactForm = require('./emails/contactForm')
const passwordReset = require('./emails/passwordReset')


// development variables
require('./env.js')
const gmailEmail = process.env.email
const gmailPassword = process.env.password
const private_key = process.env.privateKey.replace(/\\n/g, '\n')
const client_email = process.env.clientEmail

// production variables
// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password
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

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.
  url: 'http://localhost:8080/login',
};


const sendVerificationEmail = (emailData) => {
  return new Promise((resolve, reject) => {
    admin.auth().generateEmailVerificationLink(emailData.email, actionCodeSettings)
      .then((link) => {
        emailData.emailLink = link
        let templateData = {}
        if  (emailData.type === 'new user') {
          templateData = {
            greeting: [emailData.displayName],
            primaryMessage: ['Your Nemacolin Inc login has been created', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'Below are your login credentials:'],
            userInfo: ['Email:', emailData.email, 'Password:', emailData.password],
            buttonAction: ['I just need you to do one thing first: Verify your email address.', 'Please click the button below', emailData.emailLink, 'Verify Your Email'],
            closing: ['Thanks', 'Angie Visnesky', 'President - Nemacolin Inc']
          }
        } else {
          templateData = {
            greeting: [emailData.displayName],
            primaryMessage: ['I see that your email has changed', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'Your new email is:'],
            userInfo: ['Email:', emailData.email, '', ''],
            buttonAction: ['To complete the change I just need you to verify your email address.', 'Please click the button below', emailData.emailLink, 'Verify Your Email'],
            closing: ['Thanks', 'Angie Visnesky', 'President - Nemacolin Inc']
          }
        }

        const mailOptions = {
          from: 'info@nemacolininc.com',
          to: emailData.email,
          subject: emailData.subject,
          html: emailVerification.build(templateData)
        }
      
        return mailTransport.sendMail(mailOptions, (error, info) => {
          if (info) {
            resolve()
          }
          else {
            console.log(error)
            reject(error)
          }
        })
        
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const sendPasswordResetEmail = (emailData) => {
  return new Promise((resolve, reject) => {
    admin.auth().generatePasswordResetLink(emailData.email, actionCodeSettings)
      .then((link) => {
        emailData.resetLink = link
        let templateData = {
          greeting: [emailData.displayName],
          primaryMessage: ['You are receiving this email because you have requested to reset your password', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', ''],
          buttonAction: ['Click the button below to complete the reset and choose a new password.', 'If you did not request a password reset you may delete this email.', emailData.resetLink, 'Reset Your Password'],
          closing: ['Thanks', 'Angie Visnesky', 'President - Nemacolin Inc']
        }

        const mailOptions = {
          from: 'info@nemacolininc.com',
          to: emailData.email,
          subject: emailData.subject,
          html: passwordReset.build(templateData)
        }
      
        return mailTransport.sendMail(mailOptions, (error, info) => {
          if (info) {
            resolve()
          }
          else {
            console.log(error)
            reject(error)
          }
        })
        
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
app.use(middleware);

// build multiple CRUD interfaces:

app.post('/contact', (req, res) => {
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

  const templateData = {
    greeting: ['Angie'],
    primaryMessage: ['You have a new Nemacolin Inc contact form entry', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'From:'],
    userInfo: ['Name:', name, 'Email:', email],
    contactFormMessage: [name, message],
    ipAddress: [name, ipAddress, ipHostname, ipOrganization, ipCity, ipRegion, ipZipcode, ipCountry, ipCoords]
  }

  const mailOptions = {
    from: `"${name}" ${email}`,
    to: 'info@nemacolininc.com',
    subject: 'New Nemacolin Contact Form Entry',
    html: contactForm.build(templateData)
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
});

app.post('/adduser', middleware, (req, res) => {

  let userData = {
    email: req.body.email,
    emailVerified: req.body.emailVerified,
    password: req.body.password,
    displayName: req.body.displayName,
    apiKey: process.env.VUE_APP_cloudFunctionsAPIKEY
  }

  let uid

  admin.auth().createUser(userData)
    .then((userRecord) => {
      let emailData = {
        displayName: userRecord.displayName,
        email: userRecord.email,
        password: userData.password,
        subject: `Nemacolin Inc Login for ${userRecord.displayName}`,
        type: 'new user'
      }
      uid = userRecord.uid
      return sendVerificationEmail(emailData)
    })
    .then(() => {
      console.log('success')
      return res.status(200).send({ uid })
    })
    .catch((error) => {
      console.log('add user error: ', error)
      return res.status(500).send(error)
    })
})

app.post('/resetpassword', middleware, (req, res) => {
  const email = req.body.email

  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      let emailData = {
        displayName: userRecord.displayName,
        email: userRecord.email,
        subject: `Nemacolin Inc Password Reset for ${userRecord.displayName}`,
      }
      return sendPasswordResetEmail(emailData)
    })
    .then(() => {
      console.log('success')
      return res.status(200).send('success')
    })
    .catch((error) => {
      console.log('password error: ', error)
      return res.status(500).send(error)
    })
})

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app)
