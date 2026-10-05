const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = {
  async retrieveSubscription(subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  },
}
