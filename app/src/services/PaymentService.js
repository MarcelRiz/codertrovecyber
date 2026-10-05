export default class PaymentService {
  static async getCheckoutSession(sessionId) {
    return fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`,
      },
    })
  }
}
