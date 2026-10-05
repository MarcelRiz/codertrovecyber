
const fs = require('fs')
const path = require('path')

const templateDir = path.join(__dirname, '../assets/policies/')

const policyTemplates = [
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "3ecab3-adc6-e7d3-e26a-7eeab26ddb41index.html",
    "name": "IT Security Policy",
    "desc": "This policy is to establish the technical guidelines for IT security, and to communicate the controls necessary for a secure network infrastructure. The network security policy will provide the practical mechanisms to support your company's comprehensive set of security policies."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "c343016-7038-5de8-c6a6-f64baf0417index.html",
    "name": "Company Policy",
    "desc": "Use this template to generate your own company policy "
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "fe4436-46ec-c003-48d8-fbd61ee74eeindex.html",
    "name": "Physical Security Policy",
    "desc": "This policy is to protect your company's physical information systems by setting standards for secure operations."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "cf66c0-c4a1-47a3-700-83a37126eindex.html",
    "name": "Backup Policy",
    "desc": "This policy is to provide a consistent framework to apply to the backup process. The policy will provide specific information to ensure backups are available and useful when needed - whether to simply recover a specific file or when a larger-scale recovery effort is needed."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "5e327-34ce-c604-357b-852f506114eindex.html",
    "name": "IT Security Statement ",
    "desc": "The security statement, and all the policies that support it, covers your company's information systems and resources. "
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "a611707-a7a0-de84-330a-63d8ee53aaindex.html",
    "name": "Acceptable Use Policy",
    "desc": "This policy defines acceptable usage, practices and behaviour for staff and relevant third parties when using company-issued IT assets. It intends to let the staff know of any restrictions that are placed by the management."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "b63b43-b7c-2e4-e3b2-0de14d0e04aindex.html",
    "name": "Change Management Policy",
    "desc": "This document is to define how changes to information systems are controlled within the company. This policy covers the requirements needed to document, communicate, and control changes to your company's applications, systems, and devices. This will help ensure that changes occur reliably, with proper authorisation and with notification."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "dee2162-447a-61-a3d1-2884a7d22748index.html",
    "name": "Email Security Policy",
    "desc": "This policy is to detail your company's usage guidelines for the email system. This policy will help your company reduce risk of an email-related security incident, foster good business communications both internal and external to your company, and provide for consistent and professional application of your company's email principles."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "bfd16a-f8ea-db71-2ba-c7a13e4d30e5index.html",
    "name": "Vendor Management Policy ",
    "desc": "Your company uses third parties for the delivery of IT and other business services to the organisation. The risks associated with the use of those third parties need to be managed, so that your company can gain assurance that its information, services, and stakeholders are protected within its risk appetite. This policy also specifies the actions to take when selecting a provider of outsourced IT services, standards for secure communications with the provider, and what contractual terms must be in place to protect your company."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "a08656-17-8da7-40fa-b7b33bde2e6bindex.html",
    "name": "Data Security Policy",
    "desc": "This policy is to detail how to identify and handle confidential data. This policy lays out standards for the classification and use of confidential data and outlines specific security controls to protect this data."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "501f4e-6eee-08d3-c6bc-b3c511a575dindex.html",
    "name": "Data Retention Policy",
    "desc": "This policy is to specify your company's guidelines for retaining different types of data."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "1785b37-bd0-32a6-25d-8f6c407640index.html",
    "name": "Incident Response Policy",
    "desc": "This policy is to provide organization-wide guidance to employees on proper response to, and efficient and timely reporting of, computer security related incidents, such as computer viruses, unauthorised user activity, and suspected compromise of data. It also addresses non-IT incidents such as power failure. This policy provides guidance regarding the need for developing and maintaining an incident management process within your company"
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "fed2e81-d35d-6db5-f2ca-862305bffa6index.html",
    "name": "Security Awareness and Training Policy",
    "desc": "This policy is to implement a security awareness and training program for all your company staffs, contractors and relevant third parties"
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "f14e1d-4ac-64a-fecd-c33133cd14d3index.html",
    "name": "Remote Access Policy",
    "desc": "This policy defines standards for staff to connect to your company network from a remote location. These standards are designed to minimise potential exposures including loss of sensitive information, and limit exposure to security concerns through a consistent and standardised access method "
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "f16da1a-f66-0c8-b78a-1fdf7b371index.html",
    "name": "Access Management Policy",
    "desc": "The purpose of this policy is to describe what steps must be taken to ensure that users connecting to the corporate network are authenticated in an appropriate manner, in compliance with company standards, and are given the least amount of access required to perform their job function. This policy specifies what constitutes appropriate use of network accounts and authentication standards. This policy also outlines company's procedures for securing guest access."
  },
  {
    "baseTemplateLink": "BaseLayout",
    "richTextLink": "728528-ed1-6f8f-ff15-a57fbd6bc557index.html",
    "name": "Password Management Policy",
    "desc": "This policy is to ensure that every employee, contractor, temporary worker, and volunteer understands and agrees to abide by specific guidelines for creating, managing, and maintaining passwords. "
  }
]

module.exports = async () => {
  const baseLayout = await strapi.query('policy-template-layout').create({
    name: 'BaseLayout',
    content: fs.readFileSync(templateDir + 'BaseTemplate.html', 'utf-8')
  })

  return policyTemplates.map(policyTemplate => {
    return strapi.query('policy-template').create({
      name: policyTemplate.name,
      description: policyTemplate.desc,
      templateContent: fs.readFileSync(templateDir + policyTemplate.richTextLink),
      policyTemplateLayout: baseLayout.id
    })
  })
}