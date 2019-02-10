const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.VUE_APP_cloudinaryCloudName,
  api_key: process.env.VUE_APP_cloudinaryAPIKey,
  api_secret: process.env.cloudinaryAPISecret
})

export default cloudinary
