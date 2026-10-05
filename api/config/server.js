module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', 'https://api-dev.continuumcyber.io'),
  proxy: env('PROXY', true),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    url: env('URL', 'https://api-dev.continuumcyber.io') + '/admin',
  },
  userPortal: env('USER_PORTAL', 'https://user-dev.continuumcyber.io'),
  adminPortal: env('ADMIN_PORTAL', 'https://admin-dev.continuumcyber.io'),
  cron: { enabled: true },
  otherServices: {
    goPhish: {
      host: env('GOPHISH_HOST', 'https://localhost:3333'),
      apiKey: env('GOPHISH_API_KEY', ''),
    },
    vulnerabilityWorker: env('VULNERABILITY_WORKER_HOST', 'http://localhost:1338'),
  },
})
