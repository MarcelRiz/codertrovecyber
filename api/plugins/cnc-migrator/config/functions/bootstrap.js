'use strict'
/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */
const fs = require('fs')
const path = require('path')
const migrationDir = path.join(__dirname, '../../files')

module.exports = async () => {
  console.log('=========== START MIGRATIONS ===========')
  const migrationFiles = fs.readdirSync(migrationDir);
  migrationFiles.sort()
  for (let file of migrationFiles) {
    try {
      const migration = await strapi.query('migrations', 'cnc-migrator').findOne({ name: file });
      if (!migration) {
      console.log(`Running migration: ${file}`)
      await require(`${migrationDir}/${file}`)();
      await strapi.query('migrations', 'cnc-migrator').create({ name: file, date: new Date() });
      console.log(`Migration [${file}] successfuly.`)
      }
    } catch (e) {
      console.log(e)
      console.log(`Migration [${file}] failed.`)
    }
  }
  console.log('=========== END MIGRATIONS ===========')
}
