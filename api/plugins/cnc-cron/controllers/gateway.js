'use strict'

/**
 * cnc-cron.js controller
 *
 * @description: A set of functions called "actions" of the `cnc-cron` plugin.
 */

module.exports = {
  async run() {
    const cronList = await strapi.query('cron-task', 'cnc-cron').find()
    cronList.map((cron) => {
      const cronTask = strapi.plugins['cnc-cron'].services[cron.name]
      if (!cronTask?.handler || !cronTask?.defaultRepeat) return this.deleteCron(cron.id)

      if (!cron.isActive) return

      const nextRunAt = new Date(cron.nextRunAt).getTime()
      if (Date.now() < nextRunAt) return

      console.log(`Run cron ${cron.name}`)
      cronTask.handler(this.log(cron.id))
      this.update(cron.id, cron.repeat)
    })
  },

  log(id) {
    return (data) =>
      strapi.query('cron-task', 'cnc-cron').update(
        {
          id,
        },
        {
          log: data,
        }
      )
  },

  deleteCron(id) {
    console.log('Unused cron detected. Deleting...')
    strapi.query('cron-task', 'cnc-cron').delete({
      id,
    })
  },

  update(id, repeat) {
    const cronRepeat = strapi.plugins['cnc-cron'].config.cronRepeat[repeat]
    strapi.query('cron-task', 'cnc-cron').update(
      {
        id,
      },
      {
        lastRunAt: new Date(),
        nextRunAt: new Date(cronRepeat + Date.now()),
      }
    )
  },
}
