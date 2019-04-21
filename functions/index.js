const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors');
const nodemailer = require('nodemailer')
const admin = require('firebase-admin')
const middleware = require('./middleware')
const emailVerification = require('./emails/emailVerification')
const contactForm = require('./emails/contactForm')
const passwordReset = require('./emails/passwordReset')
const passwordResetRequest = require('./emails/passwordResetRequest')


// development variables
// require('./env.js')
// const gmailEmail = process.env.email
// const gmailPassword = process.env.password
// const private_key = process.env.privateKey.replace(/\\n/g, '\n')
// const client_email = process.env.clientEmail

// production variables
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const private_key = functions.config().admin.privatekey.replace(/\\n/g, '\n')
const client_email = functions.config().admin.clientemail

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
  url: 'https://nemacolin-website.firebaseapp.com/login'
  // url: 'http://localhost:8080/login',
};

const sendVerificationEmail = (emailData) => {
  return new Promise((resolve, reject) => {
    admin.auth().generateEmailVerificationLink(emailData.email, actionCodeSettings)
      .then((link) => {
        emailData.emailLink = link
        let templateData = {}
        if  (emailData.type === 'new user') {
          templateData = {
            type: 'new',
            greeting: [emailData.displayName],
            primaryMessage: ['Your Nemacolin Inc login has been created', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'Below are your login credentials:'],
            userInfo: ['Email:', emailData.email, 'Password:', emailData.password],
            buttonAction: ['I just need you to do one thing first: Verify your email address.', 'Please click the button below', emailData.emailLink, 'Verify Your Email'],
            closing: ['Thanks', 'Angie Visnesky', 'President - Nemacolin Inc']
          }
        } else if (emailData.type === 'email change') {
          templateData = {
            type: 'change',
            greeting: [emailData.displayName],
            primaryMessage: ['I see that your email has changed', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'Your new email is:'],
            link: [emailData.email],
            buttonAction: ['To complete the change I just need you to verify your email address.', 'Please click the button below', emailData.emailLink, 'Verify Your Email'],
            closing: ['Thanks', 'Angie Visnesky', 'President - Nemacolin Inc']
          }
        } else {
            templateData = {
              type: 'resend',
              greeting: [emailData.displayName],
              primaryMessage: ['Here is the email verification that you requested', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'Your email is:'],
              link: [emailData.email],
              buttonAction: ['To verify your email address please click the button below.', '', emailData.emailLink, 'Verify Your Email'],
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
          primaryMessage: ['You are receiving this email because your Nemacolin Inc password has been changed', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'Your new password is:'],
          link: [emailData.password],
          secondaryMessage: ['Please store your password in a secure place.  Never share your password with anyone.  If you have any questions please let me know.'],
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

const sendPasswordResetRequest = (emailData) => {
  return new Promise((resolve, reject) => {
    if (emailData.disabled) {
      let error = new Error()
      error.code = 'auth/user-disabled'
      return reject(error)
    } else {
      let templateData = {
        greeting: ['Angie'],
        primaryMessage: ['You have a new password reset request', 'https://res.cloudinary.com/dwfj8jbmf/image/upload/v1547314864/primary.jpg', 'computerdog', 'From:'],
        userInfo: ['Name:', emailData.displayName, 'Email:', emailData.email],
        closing: ['', '', '']
      }
  
      const mailOptions = {
        from: emailData.email,
        to: 'info@nemacolininc.com',
        subject: 'Password Reset Request',
        html: passwordResetRequest.build(templateData)
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
    }
  })
}

const disableUser = (userRecord) => {
  return new Promise((resolve, reject) => {
    admin.auth().updateUser(userRecord.uid, { disabled: true })
      .then((userRecord) => {
        return resolve(userRecord)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const reEnableUser = (userRecord) => {
  return new Promise((resolve, reject) => {
    admin.auth().updateUser(userRecord.uid, { disabled: false })
    .then((userRecord) => {
      return resolve(userRecord)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

const deleteUser = (userRecord) => {
  let userToDelete = userRecord
  return new Promise((resolve, reject) => {
    admin.auth().deleteUser(userRecord.uid)
    .then(() => {
      return resolve(userToDelete)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

const changeUserPassword = (userRecord, password) => {
  return new Promise((resolve, reject) => {
    admin.auth().updateUser(userRecord.uid, { password })
      .then(() => {
        let emailData = {
          displayName: userRecord.displayName,
          email: userRecord.email,
          password: password,
          subject: `New Nemacolin Inc Password for ${userRecord.displayName}`,
        }
        return resolve(sendPasswordResetEmail(emailData))
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

// Routes:
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
        type: 'new'
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
  const password = req.body.password
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      return changeUserPassword(userRecord, password)
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

app.post('/forgotpassword', middleware, (req, res, next) => {
  const email = req.body.email
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      return sendPasswordResetRequest(userRecord)
    })
    .then(() => {
      console.log('success')
      return res.status(200).send('success')
    })
    .catch((error) => {
      console.log('forgot password error: ', error)
      return res.status(500).send(error)
    })
})

app.post('/verifyemail', middleware, (req, res) => {
  const email = req.body.email
  const type = req.body.type
  
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      let emailData = {
        displayName: userRecord.displayName,
        email: userRecord.email,
        subject: `Verify Email Address for ${userRecord.displayName}`,
        type
      }
      return sendVerificationEmail(emailData)
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
  
app.post('/disableorreenableuser', middleware, (req, res) => {
  const email = req.body.email
  const action = req.body.action
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      return action === 'Disable' ? disableUser(userRecord) : reEnableUser(userRecord)
    })
    .then((userRecord) => {
      return res.status(200).send(userRecord)
    })
    .catch((error) => {
      console.log('delete user error: ', error)
      return res.status(500).send(error)
    })
})
  
app.post('/deleteuser', middleware, (req, res) => {
  const email = req.body.email
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      return deleteUser(userRecord)
    })
    .then((userRecord) => {
      return res.status(200).send(userRecord)
    })
    .catch((error) => {
      console.log('delete user error: ', error)
      return res.status(500).send(error)
    })
})

app.post('/updateauthdata', middleware, (req, res) => {
  let data = {}
  if (req.body.displayName) { data.displayName = req.body.displayName }
  if (req.body.email) { data.email = req.body.email }
  admin.auth().updateUser(req.body.uid, data)
    .then(() => {
      if (req.body.email) {
        let emailData = {
          displayName: req.body.displayName,
          email: req.body.email,
          subject: `Verify Email Address for ${req.body.displayName}`,
          type: 'email change'
        }
        return sendVerificationEmail(emailData)
      } else {
        console.log('success')
        return res.status(200).send('success')
      }
    })
    .then(() => {
      console.log('success')
      return res.status(200).send('success')
    })
    .catch((error) => {
      console.log('Error updating user:', error)
      return res.status(500).send(error)
    });
})

// app.use((error, req, res, next) => {
//   console.log('error handler')
//   return res.status(500).send(error)
// })

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app)
