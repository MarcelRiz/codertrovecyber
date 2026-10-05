'use strict'

const _ = require('lodash')

const importCrons = (cronServices) => {
  Object.keys(cronServices).map(async (name) => {
    const cron = cronServices[name]
    const cronRepeat = strapi.plugins['cnc-cron'].config.cronRepeat[cron.defaultRepeat]

    await strapi.query('cron-task', 'cnc-cron').create({
      name,
      repeat: cron.defaultRepeat,
      lastRunAt: new Date(),
      nextRunAt: new Date(cronRepeat + Date.now()),
    })
  })
}

const findNewCron = async (cronServices, cronList) => {
  const newCrons = {}
  await Promise.all(
    Object.keys(cronServices).map(async (name) => {
      const existedCron = cronList.find((cron) => cron.name == name)
      if (existedCron) return
      if (!cronServices[name].defaultRepeat) return
      if (!cronServices[name].handler) return

      newCrons[name] = cronServices[name]
    })
  )
  return newCrons
}

module.exports = async () => {
  console.log('Start cron service ...')
  const cronList = await strapi.query('cron-task', 'cnc-cron').find()
  const cronServices = strapi.plugins['cnc-cron'].services
  if (cronList.length < 1) {
    console.log('Import all cron...')
    return importCrons(cronServices)
  }

  const newCrons = await findNewCron(cronServices, cronList)
  if (Object.keys(newCrons) < 1) return
  console.log('New cron detected. Importing ...')
  return importCrons(newCrons)
}
