'use strict'

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = () => {
  process.nextTick(() => {
    var io = require('socket.io')(strapi.server, {
      cors: {
        origin: '*',
      },
    })

    io.on('connection', function (socket) {
      console.log('[WS SERVER] a socket connected:', socket.id)

      // Producer (public)
      socket.on('scanVunerability', async (data) => {
        socket.broadcast.emit('worker', {
          ...data,
          transactionSignalType: strapi.config.constants.transactionSignalType.addScanning,
        })
      })
      socket.on('retryScanVulnerability', async ({ id, userId, manageScanningId }) => {
        socket.broadcast.emit('worker', {
          id,
          userId,
          manageScanningId,
          transactionSignalType: strapi.config.constants.transactionSignalType.retryScanning,
        })
      })
      socket.on('stopScanVulnerability', async ({ id, userId, scanningHistoryId }) => {
        socket.broadcast.emit('worker', {
          id,
          userId,
          scanningHistoryId,
          transactionSignalType: strapi.config.constants.transactionSignalType.stopScanning,
        })
      })

      // Consumer (subscribe)
      socket.on('scanResult', (data) => {
        socket.broadcast.emit('scanResultFromAPI', data)
      })
      socket.on('newScanningHistory', (newScanningHistory) => {
        socket.broadcast.emit('newScanningHistory', newScanningHistory)
      })
      socket.on('retryScanning', (retryScanningHistory) => {
        socket.broadcast.emit('retryScanning', retryScanningHistory)
      })
      socket.on('stopScanning', (stopScanningHistory) => {
        socket.broadcast.emit('stopScanning', stopScanningHistory)
      })
      socket.on('scanDone', (scanDone) => {
        socket.broadcast.emit('scanDone', scanDone)
      })
      socket.on('disconnect', () => {
        console.log('[WS SERVER] a socket disconnected:', socket.id)
      })
    })
  })
}
