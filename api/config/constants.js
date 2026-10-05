module.exports = () => ({
  scanningHistoryStatus: {
    pending: 'PENDING',
    done: 'DONE',
    fail: 'FAIL',
    stop: 'STOP',
  },

  transactionSignalType: {
    addScanning: 'ADD_SCANNING',
    retryScanning: 'RETRY_SCANNING',
    stopScanning: 'STOP_SCANNING',
  },
})
