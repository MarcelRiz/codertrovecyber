// require('dotenv').config()
const { resolve } = require('path')

module.exports = ({ env }) => ({
  nodeEnv: env('NODE_ENV') || 'development',
  storageAccessKey: env('STORAGE_ACCESS_KEY')
    ? JSON.parse(env('STORAGE_ACCESS_KEY'))
    : resolve(__dirname, './keys/continuum-dev-google-storage-key.json'),
  storageBucket: env('STORAGE_BUCKET') || 'tf-bucket-continuum-local-dev-b0om',
})

// module.exports = {
//   storageAccessKey: process.env.STORAGE_ACCESS_KEY
//     ? process.env.STORAGE_ACCESS_KEY
//     : resolve(__dirname, './keys/a-continuum-dev-google-storage-key.json'),
//   storageBucket: process.env.STORAGE_BUCKET || 'continuumcyber_storage_bucket',
//   nodeEnv: process.env.NODE_ENV || 'development',
// }
