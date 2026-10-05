const generatePassword = require('password-generator')
const otpGenerator = require('otp-generator')

module.exports = {
  password: async () => {
    const AUTO_PASSWORD_CONFIG = strapi.plugins['users-permissions'].config.autoPassword.settings
    const original = generatePassword(
      AUTO_PASSWORD_CONFIG.length,
      AUTO_PASSWORD_CONFIG.memorable,
      AUTO_PASSWORD_CONFIG.pattern
    )
    const hash = await strapi.plugins['users-permissions'].services.user.hashPassword({
      password: original,
    })
    return {
      original,
      hash,
    }
  },

  otp: () => {
    const OTP_SETTTING = strapi.plugins['users-permissions'].config.otp.settings
    return otpGenerator.generate(OTP_SETTTING.length, OTP_SETTTING.options)
  },
}
