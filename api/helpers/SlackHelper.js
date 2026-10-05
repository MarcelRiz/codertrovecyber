const SlackNotify = require('slack-notify')
const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const slack = SlackNotify(WEBHOOK_URL)

module.exports = {
  async sendSlackNotification({ chanel = 'gophish-nofity', text }) {
    slack.send({
      chanel,
      text,
    })
  },
}
