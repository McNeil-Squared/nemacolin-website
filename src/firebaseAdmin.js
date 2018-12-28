import * as admin from 'firebase-admin'
const serviceAccount = {
  // type: process.env.VUE_APP_type,
  // project_id: process.env.project_id,
  // private_key_id: process.env.private_key_id,
  private_key: process.env.VUE_APP_privateKey.replace(/\\n/g, '\n'),
  client_email: process.env.VUE_APP_clientEmail
  // client_id: process.env.client_id,
  // auth_uri: process.env.auth_uri,
  // token_uri: process.env.token_uri,
  // auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  // client_x509_cert_url: process.env.client_x509_cert_url
}

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nemacolin-website.firebaseio.com'
}

export default admin.initializeApp({ config })
