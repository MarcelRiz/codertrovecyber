'use strict'
const StripeHelper = require('../../../helpers/StripeHelper')

module.exports = {
  async updatePeriodEndTime(subscription) {
    const foundSubscription = await StripeHelper.retrieveSubscription(subscription)
    setTimeout(async () => {
      const periodEnd = foundSubscription.cancel_at_period_end
        ? foundSubscription.current_period_end * 1000
        : foundSubscription.canceled_at * 1000 || foundSubscription.current_period_end * 1000

      try {
        await strapi.query('user', 'users-permissions').update(
          { subscription },
          {
            periodEnd: new Date(periodEnd),
          }
        )
      } catch (error) {
        throw Error(error.message)
      }
    }, 2000)
  },
  async subscriptionEventHandler(ctx) {
    if (
      ctx.request.body.type === 'invoice.payment_succeeded' &&
      ctx.request.body?.data?.object?.billing_reason === 'subscription_cycle' // Renew subscription
    ) {
      const subscription = ctx.request.body.data.object.subscription
      await this.updatePeriodEndTime(subscription)
    }
    if (
      ctx.request.body.type === 'customer.subscription.updated' ||
      ctx.request.body.type === 'customer.subscription.deleted'
    ) {
      const subscription = ctx.request.body.data.object.id
      await this.updatePeriodEndTime(subscription)
    }
    return ctx.send({
      status: `Receive ${ctx.request.body.type}`,
    })
  },
}
