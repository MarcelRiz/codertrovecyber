'use strict'
const { get } = require('lodash')
const EmailHelper = require('../../../helpers/EmailHelper')
const { getLockingByEmail, setLockingByEmail } = require('./locking-session')

module.exports = {
  async stripeTradingActionCreateClient(ctx) {
    // stripe hook
    // checkout.session.completed
    // invoice.payment_succeeded
    // charge.succeeded

    const userEmail =
      get(ctx.request.body, 'data.object.billing_details.email') ||
      get(ctx.request.body, 'data.object.customer_email') ||
      get(ctx.request.body, 'data.object.customer_details.email')

    const userName =
      get(ctx.request.body, 'data.object.customer_name') ||
      get(ctx.request.body, 'data.object.customer_details.name') ||
      get(ctx.request.body, 'data.object.billing_details.name')

    // Check session is not locking
    if (!getLockingByEmail(userEmail)) {
      // set to locking session
      setLockingByEmail(userEmail)

      let userPlatform = await strapi.query('payment-platform').findOne({
        email: userEmail,
      })

      if (!userPlatform) {
        userPlatform = await strapi.query('payment-platform').create({
          email: userEmail,
          name: userName,
        })
      }

      if (ctx.request.body.type === 'charge.succeeded') {
        // console.log(`\n charge.succeeded============= ${JSON.stringify(ctx.request.body)} \n`)
      }

      if (ctx.request.body.type === 'checkout.session.completed') {
        const amountTotal = get(ctx.request.body, 'data.object.amount_total')
        const subscriptionId = get(ctx.request.body, 'data.object.subscription')
        const currency = get(ctx.request.body, 'data.object.currency')
        const stripeCustomerId = get(ctx.request.body, 'data.object.customer')

        const { id: sessionId } = get(ctx.request.body, 'data.object')

        stripeSession = await strapi.query('payment-stripe-session').create({
          customerStripeId: stripeCustomerId,
          amountTotal,
          currency,
          hasCreatedAccount: false,
          paymentPlatform: userPlatform.id,
          sessionId,
          subscriptionId,
        })

        EmailHelper.sendRegisterClient({
          email: userEmail,
          name: userName,
          sessionId: sessionId,
          // invoiceUrl: get(ctx.request.body, 'data.object.hosted_invoice_url'),
        })
      }

      if (
        ctx.request.body.type === 'invoice.payment_succeeded' &&
        ctx.request.body.data.object.billing_reason === 'subscription_create'
      ) {
        setTimeout(async () => {
          const paymentData = get(ctx.request.body, 'data.object.lines.data')[0]
          await strapi.query('payment-stripe-session').update(
            { customerStripeId: get(ctx.request.body, 'data.object.customer') },
            {
              amountSubtotal: get(ctx.request.body, 'data.object.subtotal'),
              invoiceUrl: get(ctx.request.body, 'data.object.hosted_invoice_url'),
              description: get(paymentData, 'description'),
              interval: get(paymentData, 'plan.interval'),
              intervalCount: get(paymentData, 'plan.interval_count'),
              pricingPlan: get(paymentData, 'plan.nickname'),
              productStripeId: get(paymentData, 'plan.product'),
            }
          )
        }, 2000)
      }

      // set to un-locking session
      setLockingByEmail(userEmail)
    }

    return ctx.send({
      status: `Receive ${ctx.request.body.type}`,
    })
  },

  async getStripeSession(ctx) {
    const { id } = ctx.params

    const sessionData = await strapi.query('payment-stripe-session').findOne({
      sessionId: id,
    })

    return sessionData
  },

  async UpdateStripeSession(ctx) {
    const { id } = ctx.params
    const { hasCreatedAccount } = ctx.request.body

    const sessionData = await strapi.query('payment-stripe-session').findOne({
      sessionId: id,
    })

    return await strapi.query('payment-stripe-session').update(
      { id: sessionData.id },
      {
        hasCreatedAccount,
      }
    )
  },
}
