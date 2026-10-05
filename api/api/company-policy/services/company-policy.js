'use strict'
const fs = require('fs')
const { escapeRegExp } = require('lodash')
const path = require('path')
const dayjs = require('dayjs')
const wkhtmltopdf = require('wkhtmltopdf')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async create({ user, assignStaffIds = [], ...createData }) {
    const data = await strapi.connections.default.transaction(async (transacting) => {
      const createdCompanyPolicy = await strapi.query('company-policy').create(
        {
          ...createData,
        },
        { transacting }
      )

      await Promise.all(
        assignStaffIds.map((staffId) =>
          strapi.query('staff-assigned-policy').create(
            {
              user: staffId,
              companyPolicy: createdCompanyPolicy?.id,
              created_by: user.id,
            },
            { transacting }
          )
        )
      )
      return createdCompanyPolicy
    })
    return data
  },

  fillTemplateVariables(template, company, policy) {
    const variableDict = {
      '{Company_Name}': company?.name,
      '{Policy_Name}': policy?.name,
      '{Policy_Owner}': policy?.owner,
      '{Created_Date}': dayjs(policy?.publishedDate)?.format('DD MMMM YYYY'),
      '{Effective_Date}': dayjs(policy?.publishedDate)?.format('DD MMMM YYYY'),
      // '{Policy_Purpose}': 'TBD',
      // '{Your_Policy_Purpose}': 'TBD',
      // '{Your_Section_Statements}': 'TBD',
      // '{Your_Sub-section_Statements}': 'TBD'
    }

    let filledTemplate = template
    for (let key in variableDict) {
      if (variableDict[key] && filledTemplate.includes(key)) {
        const regex = RegExp(escapeRegExp(key), 'g')
        filledTemplate = filledTemplate.replace(regex, variableDict[key])
      }
    }
    return filledTemplate
  },
  async generateCyberPolicies({ company, policyTemplateIds, owner, author }) {
    const policyTemplates = await strapi.query('policy-template').find({ id: policyTemplateIds })
    const promises = policyTemplates.map((template) => {
      const policyData = {
        name: template.name,
        owner: owner,
        publishedDate: new Date(),
        isLive: false,
        company: company.id,
        type: 'CyberSecurity',
        policyTemplate: template.id,
        created_by: author.id,
      }
      policyData.policyContent = this.fillTemplateVariables(
        template.templateContent,
        company,
        policyData
      )
      return this.create(policyData)
    })
    const createdPolicies = await Promise.all(promises)
    return createdPolicies.map((x) => {
      x.policyTemplate = x.policyTemplate.id
      return x
    })
  },

  async download({ id }) {
    const policy = await this.findOne({ id }, [
      'company',
      'policyFile',
      'policyTemplate',
      'policyTemplate.policyTemplateLayout',
    ])
    if (!policy) {
      throw new Error('Company policy not found')
    }
    if (!policy.company?.id) {
      throw new Error('Policy dont have a company')
    }
    // company policy file
    if (policy.type === 'CompanyPolicy') {
      if (!policy.policyFile || !policy.policyFile.url || !policy.policyFile.name) {
        throw new Error('Policy file not found')
      }

      // TODO: need better way to get uploaded url
      const filePath = path.join(__dirname, '../../../public') + policy.policyFile.url
      return {
        name: policy.policyFile.name,
        stream: fs.createReadStream(filePath),
      }
    }

    // cyber policy generate
    if (!policy.policyContent || !policy.policyTemplate?.policyTemplateLayout?.content) {
      throw new Error('Not enough information to generate policy')
    }

    let filledPolicy = policy.policyTemplate.policyTemplateLayout.content.replace(
      '{Policy_Purpose}',
      policy.policyContent
    )
    filledPolicy = this.fillTemplateVariables(filledPolicy, policy.company, policy)

    return {
      name: `${policy.name}_${policy.company.name}.pdf`,
      stream: wkhtmltopdf(filledPolicy),
    }
  },

  async preview({ companyId, policyTemplateId, owner }) {
    const [company, policyTemplate] = await Promise.all([
      strapi.services.company.findOne({ id: companyId }),
      strapi.services['policy-template'].findOne({ id: policyTemplateId }),
    ])

    if (!company) {
      throw new Error('Company not found')
    }

    if (!policyTemplate) {
      throw new Error('Policy Template not found')
    }

    let filledPolicy = policyTemplate.policyTemplateLayout.content.replace(
      '{Policy_Purpose}',
      policyTemplate.templateContent
    )
    filledPolicy = this.fillTemplateVariables(filledPolicy, company, { ...policyTemplate, owner })

    return {
      name: `${policyTemplate.name}_${company.name}.pdf`,
      stream: wkhtmltopdf(filledPolicy),
    }
  },

  async update({ id, user, staffIds = [], ...companyPolicyData }) {
    const knex = strapi.connections.default
    const data = await knex.transaction(async (trx) => {
      await Promise.all(
        staffIds.map((staffId) =>
          knex('staff_assigned_policies')
            .insert({
              user: staffId,
              companyPolicy: id,
              created_by: user.id,
            })
            .transacting(trx)
        )
      )

      const record = await knex('company_policies')
        .where('id', '=', id)
        .update({
          ...companyPolicyData,
        })
        .transacting(trx)
        .returning('*')
      return record
    })
    return data
  },

  async find({ user, _limit, ...params }) {
    const knex = strapi.connections.default

    if (user.role.type === 'staff') {
      const staffPolicies = await knex('staff_assigned_policies').where({
        user: user.id,
      })

      const companyPolicyIds = staffPolicies.map((policy) => policy.companyPolicy)

      return knex('company_policies')
        .where({
          ...params,
        })
        .whereIn('id', companyPolicyIds)
    }

    return knex('company_policies').where({
      ...params,
    })
  },
}
