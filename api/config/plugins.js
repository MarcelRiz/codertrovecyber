module.exports = ({ env }) => ({
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: env('SENDGRID_DEFAULT_FROM'),
      defaultReplyTo: env('SENDGRID_DEFAULT_REPLY'),
      testAddress: env('SENDGRID_TEST_ADDRESS'),
    },
    templateId: {
      otp: env('SENDGRID_DEFAULT_OTP') || 'd-77324238972149ca90c98a8fedd8b815',
      welcomeClient: env('SENDGRID_DEFAULT_WELCOME_CLIENT') || 'd-8d8ed25b05ae45f398979e5b135bc0ab',
      welcomeStaff: env('SENDGRID_DEFAULT_WELCOME_STAFF') || 'd-34bf507872784685a1384efa9e084b08',
      clientPendingItem:
        env('SENDGRID_DEFAULT_CLIENT_PENDING') || 'd-8d440e71a417453285fcacddea6829f5',
      staffPendingItem:
        env('SENDGRID_DEFAULT_STAFF_PENDING') || 'd-315b98e9df1f4944b0fe2a5f689b84f9',
      actionReport: env('SENDGRID_DEFAULT_ACTION_REPORT') || 'd-f53e10e106dd4cb69d0e37d8fab351fe',
      resetPassword: env('SENDGRID_DEFAULT_RESET_PASS') || 'd-fda8abb5b3834f3b896d973506ba742f',
      registerClient:
        env('SENDGRID_DEFAULT_REGISTER_CLIENT') || 'd-cc2d60c3733c474cb2dcebc13fc0ed45',
      generateNewPassword: env('SENDGRID_DEFAULT_GENERATE_NEW_PASSWORD') || 'd-52f430560ede48a08f04a3e2c5760ab4',
    },
  },
  'cnc-core': {
    externals: [
      {
        provider: 'typeform',
        providerOptions: {
          token: env('TYPEFORM_TOKEN'),
        },
        settings: {
          assessmentFormId: env('TYPEFORM_ACCESSMENT_FORM_ID'),
        },
      },
    ],
    codeGeneratedDuration: {
      otp: 1000 * 60 * 60,
      jwt: 1000 * 60 * 60 * 168,
      resetPassword: 1000 * 60 * 60 * 12,
    },
  },
  'users-permissions': {
    autoPassword: {
      settings: {
        length: 12,
        memorable: false,
        pattern: /[a-zA-Z\d!@#$%^&]/,
      },
    },
    otp: {
      settings: {
        length: 6,
        options: { upperCase: false, specialChars: false, alphabets: false },
      },
      expiredDurationInMinutes: 5,
    },
    limitAttemptLogin: 10,
  },
})
