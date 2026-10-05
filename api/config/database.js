module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: env('DATABASE_CLIENT', 'postgres'),
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        username: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
      },
      options: {
        autoMigration: env('DATABASE_AUTO_MIGRATION', true), // this option is required in dbs other than sqlite so that tables can be created autuomatically,
        // debug: process.env.ENVIRONMENT === 'DEVELOPMENT' || false,
      },
    },
  },
  // debug: false,
  acquireConnectionTimeout: 600000,
  pool: {
    min: 0,
    max: 100,
    acquireTimeoutMillis: 300000,
    createTimeoutMillis: 300000,
    destroyTimeoutMillis: 50000,
    idleTimeoutMillis: 300000,
    reapIntervalMillis: 10000,
    createRetryIntervalMillis: 2000,
    propagateCreateError: false,
  },
})
