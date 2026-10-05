const { createClient } = require('@typeform/api-client')

module.exports = {
  init(options, settings) {
    const typeformAPI = createClient({ token: options.token })

    return {
      getAssessmentForm: async ({ formId }) => {
        const { fields } = await typeformAPI.forms.get({ uid: formId })
        let questions = []
        await Promise.all(
          fields.map((item) => {
            const question = item.type == 'group' ? item.properties?.fields : [item]
            questions = [...questions, ...question]
          })
        )
        return questions
      },
      getAssessmentResponse: async ({ formId, responseId }) => {
        console.log(formId)
        console.log(responseId)
        const { items } = await typeformAPI.responses.list({
          uid: formId,
          ids: responseId,
        })
        return items.length > 0 ? items[0] : null
      },
      getAssessmentResponseList: async ({ formId }) => {
        const { items } = await typeformAPI.responses.list({
          uid: formId,
        })
        return items
      },
    }
  },
}
