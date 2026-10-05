'use strict'
const util = require('util')
const fs = require('fs')
const { Storage } = require('@google-cloud/storage')
const moment = require('moment')
const ResponseHelper = require('../../../helpers/ResponseHelper')
// const googleCloudStorage = require('../../../config/googleCloudStorage')

// const cloudStorage = new Storage({ keyFilename: googleCloudStorage.storageAccessKey })
// const cloudStorage = new Storage({ credentials: JSON.parse(googleCloudStorage.storageAccessKey) })
// const bucket = cloudStorage.bucket(googleCloudStorage.storageBucket)
let cloudStorage
if (strapi.config.googleCloudStorage.nodeEnv !== 'development') {
  cloudStorage = new Storage({
    credentials: strapi.config.googleCloudStorage.storageAccessKey,
  })
} else {
  cloudStorage = new Storage({ keyFilename: strapi.config.googleCloudStorage.storageAccessKey })
}
const bucket = cloudStorage.bucket(strapi.config.googleCloudStorage.storageBucket)

module.exports = {
  async getFile(pathName) {
    if (Array.isArray(pathName) && pathName.length === 1) {
      const pathStorage = pathName[0]
      const blob = bucket.file(pathStorage)
      const expiredTime = moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss') // 1 hour

      const options = {
        version: 'v4',
        action: 'read',
        expires: expiredTime,
      }

      const [signedUrl] = await blob.getSignedUrl(options)

      // if (fileInfo && pathName.length === 1) {
      //   fileData = await strapi.query('file-google-storage').create(fileInfo)
      // }

      return {
        preSignedUrl: signedUrl,
        expiredTime: expiredTime,
        pathName: pathStorage,
      }
    }

    return ResponseHelper.successAction(ctx)
  },

  async getSignatureCreateFile(fileName) {
    if (Array.isArray(fileName) && fileName.length === 1) {
      const nameResource = fileName[0]
      const markDownDate = `images/${moment().format('YYYYMMDDHHMMSS')}_`
      const storageFileName = `${markDownDate}${nameResource.replace(/ /g, '_')}`
      const blob = bucket.file(storageFileName)

      const expiredTime = Date.now() + 30 * 60 * 1000

      const options = {
        version: 'v4',
        action: 'write',
        expires: expiredTime,
      }

      const [signedUrl] = await blob.getSignedUrl(options)
      return {
        preSignedUrl: signedUrl,
        expiredTime: expiredTime,
        fileName: nameResource,
        pathName: storageFileName,
      }
    }

    return ResponseHelper.successAction(ctx)
  },

  async removeFile(pathName) {
    try {
      if (Array.isArray(pathName) && pathName.length === 1) {
        const nameResource = pathName[0]
        const blob = bucket.file(nameResource)

        const removeData = await blob.delete()
        const objData = {
          removeData: removeData,
          pathName: nameResource,
        }

        return objData
      }

      return ResponseHelper.successAction(objData)
    } catch (err) {
      console.log(`GCS removeFile error ${err}`)
      return err
    }
  },

  async transformFormatFile(files, author) {
    const { name, type, path } = files
    const readBuffer = await util.promisify(fs.readFile)(path)
    const { optimize } = strapi.plugins.upload.services['image-manipulation']
    const { buffer, info } = await optimize(readBuffer)

    const fileFormat = {
      originalname: name,
      buffer,
      mimetype: type,
      info,
    }
    return fileFormat
  },

  async uploadFileLite(files, author) {
    const fileFormat = await this.transformFormatFile(files)
    const { originalname, buffer, mimetype } = fileFormat

    const markDownDate = `images/${moment().format('YYYYMMDDHHMMSS')}_`
    const storageFileName = `${markDownDate}${originalname.replace(/ /g, '_')}`
    const blob = bucket.file(storageFileName)

    const data = await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        metadata: { contentType: mimetype },
      })

      blobStream
        .on('finish', () => {
          const publicUrl = util.format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          )
          resolve(publicUrl)
        })
        .on('error', (err) => {
          console.log(`\n uploadFileLite error ${err} \n`)
          reject(`Unable to upload image, something went wrong:\n ${err}`)
        })
        .end(buffer)
      // .on('error', (err) => reject(err))
    })

    if (data) {
      await strapi.query('file-google-storage').create({
        name: originalname,
        type: mimetype,
        publicUrl: data,
        pathName: storageFileName,
        created_by: author.id || null,
      })
    }
    const getFile = await this.getFile([storageFileName])

    return {
      ...getFile,
      publicUrl: data,
    }
  },

  async uploadFileBase64({ originalname, bufferString, mimetype, author }) {
    try {
      const markDownDate = `images/${moment().format('YYYYMMDDHHMMSS')}_`
      const storageFileName = `${markDownDate}${originalname.replace(/ /g, '_')}`
      const blob = bucket.file(storageFileName)

      const data = await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          metadata: { contentType: mimetype },
          // public: true
        })

        blobStream.on('error', (err) => {
          console.log(`\n uploadFileLite error ${err} \n`)
          reject(`Unable to upload image, something went wrong:\n ${err}`)
        })
        blobStream.end(Buffer.from(bufferString, 'base64'))

        blobStream.on('finish', () => {
          const publicUrl = util.format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          )
          resolve(publicUrl)
        })
      })

      const fileUploadedInfo = await strapi.query('file-google-storage').create({
        name: originalname,
        type: mimetype,
        publicUrl: data,
        pathName: storageFileName,
        created_by: author?.id || null,
      })
      const getFile = await this.getFile([storageFileName])

      return {
        ...getFile,
        publicUrl: data,
        fileUploadedInfo,
      }
    } catch (error) {
      console.log(`\n uploadFileBase64 error ${error} \n`)
      return error
    }
  },
}
