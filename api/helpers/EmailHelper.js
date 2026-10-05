module.exports = {
  sendOtpEmail({ user, otp }) {
    const name = `${user.firstName} ${user.lastName}`
    return strapi.plugins.email.services.email.sendTemplate({
      templateId: strapi.plugins.email.config.templateId.otp,
      data: { otp, user: name },
      to: user.email,
    })
  },

  async sendCompletedAssessmentEmail({ email, firstName, lastName, companies }) {
    const appConfig = await strapi.query('app-setting', 'cnc-core').findOne({}, [])
    if (!appConfig) return
    strapi.plugins.email.services.email.send({
      to: appConfig.systemEmail,
      subject: 'Assessment completion alert',
      text: `${firstName} ${lastName} - ${email} from ${companies[0].name} has completed assessment.`,
    })
  },

  sendActionReportEmail({ email, firstName, lastName }, { name, pdf: { url } }) {
    const reportUrl = strapi.config.server.userPortal + '/threat-centre'

    return strapi.plugins.email.services.email.sendTemplate({
      templateId: strapi.plugins.email.config.templateId.actionReport,
      data: { reportName: name, url: reportUrl, user: `${firstName} ${lastName}` },
      to: email,
    })
  },

  sendPendingItemEmail({
    email,
    lastName,
    firstName,
    role: { type },
    pendingCourses,
    pendingPolicies,
    pendingActionItems,
  }) {
    let userPortal = strapi.config.server.userPortal

    let templateId = strapi.plugins.email.config.templateId.staffPendingItem

    if (type == 'client') {
      templateId = strapi.plugins.email.config.templateId.clientPendingItem
      userPortal = `${userPortal}/threat-centre`
    }

    return strapi.plugins.email.services.email.sendTemplate({
      templateId,
      data: {
        user: `${firstName} ${lastName}`,
        courses: pendingCourses,
        policies: pendingPolicies,
        threats: pendingActionItems,
        url: userPortal,
      },
      to: email,
    })
  },

  sendPendingActionEmail({ email }) {
    strapi.plugins.email.services.email.send({
      to: email,
      subject: 'Pending action item',
      text: `Your have a lot of pending action items. Please come back and resolve`,
    })
  },

  sendWelcomeEmail({ email, firstName, lastName, password, role: { type } }) {
    const userPortal = strapi.config.server.userPortal
    let templateId = strapi.plugins.email.config.templateId.welcomeStaff

    if (type == 'client') {
      templateId = strapi.plugins.email.config.templateId.welcomeClient
    }

    return strapi.plugins.email.services.email.sendTemplate({
      templateId,
      data: { password, user: `${firstName} ${lastName}`, url: userPortal },
      to: email,
    })
  },

  sendResetPasswordEmail({ url, token, email }) {
    let templateId = strapi.plugins.email.config.templateId.resetPassword

    return strapi.plugins.email.services.email.sendTemplate({
      templateId,
      data: { url, token },
      to: email,
    })
  },

  sendRegisterClient({ email, name, sessionId }) {
    const userPortal = strapi.config.server.userPortal
    const templateId = strapi.plugins.email.config.templateId.registerClient

    return strapi.plugins.email.services.email.sendTemplate({
      templateId,
      data: {
        name,
        redirectUrl: `${userPortal}/sign-up?session_id=${sessionId}`,
        // invoiceUrl,
      },
      to: email,
    })
  },

  sendGenerateNewPasswordEmail({ email, url, tenantName, firstName, password, redirectUrl }) {
    let templateId = strapi.plugins.email.config.templateId.generateNewPassword

    return strapi.plugins.email.services.email.sendTemplate({
      templateId,
      data: {
        url,
        tenantName,
        firstName,
        password,
        redirectUrl,
      },
      to: email,
    })
  },
}
