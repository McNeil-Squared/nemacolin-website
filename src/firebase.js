import firebase from 'firebase'

const config = {
  apiKey: process.env.VUE_APP_FIREBASEAPIKEY,
  authDomain: process.env.VUE_APP_FIREBASEAUTHDOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASEDATABASEURL,
  projectId: process.env.VUE_APP_FIREBASEPROJECTID,
  storageBucket: process.env.VUE_APP_FIREBASESTORAGEBUCKET
}

export default firebase.initializeApp(config)
