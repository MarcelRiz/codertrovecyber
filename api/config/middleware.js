module.exports = ({ env }) => ({
  load: {
    before: ['boom', 'sentry'],
    after: ['parser', 'router', 'validations'],
  },
  settings: {
    sentry: {
      dsn: env('SENTRY_DSN', ''),
      enabled: env('SENTRY_DSN') ? true : false,
    },
    validations: {
      enabled: true,
    },

    parser: {
      // formLimit: '10mb', // modify here limit of the form body
      // jsonLimit: '10mb', // modify here limit of the JSON body
      // textLimit: '10mb', // modify here limit of the text body
      formidable: {
        maxFileSize: 20 * 1024 * 1024, // multipart data, modify here limit of uploaded file size - 20mb
      },
    },
  },
})
