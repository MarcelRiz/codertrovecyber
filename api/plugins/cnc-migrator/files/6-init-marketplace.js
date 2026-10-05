const fileGoogleStorageList = [
  {
    name: 'Penetration.png',
    pathName: 'images/20220128130182_Penetration.png',
    type: 'image/png',
    created_by: 1,
    published_at: new Date(),
    publicUrl:
      'https://storage.googleapis.com/continuumcyber_storage_bucket/images/20220128130182_Penetration.png',
  },
  {
    name: 'Application Security.png',
    pathName: 'images/20220128130138_Application_Security.png',
    type: 'image/png',
    created_by: 1,
    published_at: new Date(),
    publicUrl:
      'https://storage.googleapis.com/continuumcyber_storage_bucket/images/20220128130138_Application_Security.png',
  },
  {
    name: 'assessment.jpg',
    pathName: 'images/20220128130116_assessment.jpg',
    type: 'image/jpeg',
    created_by: 1,
    published_at: new Date(),
    publicUrl:
      'https://storage.googleapis.com/continuumcyber_storage_bucket/images/20220128130116_assessment.jpg',
  },
  {
    name: 'technical-assessment.jpg',
    pathName: 'images/20220128130105_technical-assessment.jpg',
    type: 'image/jpeg',
    created_by: 1,
    published_at: new Date(),
    publicUrl:
      'https://storage.googleapis.com/continuumcyber_storage_bucket/images/20220128130105_technical-assessment.jpg',
  },
  {
    name: 'purple-team.jpg',
    pathName: 'images/20220128130106_purple-team.jpg',
    type: 'image/jpeg',
    created_by: 1,
    published_at: new Date(),
    publicUrl:
      'https://storage.googleapis.com/continuumcyber_storage_bucket/images/20220128130106_purple-team.jpg',
  },
  {
    name: 'pexels-photo-1661004.jpeg',
    pathName: 'images/20220208100286_pexels-photo-1661004.jpeg',
    type: 'image/jpeg',
    created_by: 1,
    published_at: new Date(),
    publicUrl:
      'https://storage.googleapis.com/continuumcyber_storage_bucket/images/20220208100286_pexels-photo-1661004.jpeg',
  },
]

const marketplaceList = [
  {
    title: 'Penetration Testing',
    thumbnailImage: null,
    bookingLink: 'https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting',
    content: `Expert support to test and uncover issues and risks across applications, cloud, networks, systems, and devices, with comprehensive guidance on remediation options and advice.
    - Web Application Penetration Testing
    - Web Services Penetration Testing
    - External Network Penetration Testing
    - Internal Network Penetration Testing
    - Mobile Application Penetration Testing
    - Wireless Penetration Testing
    - Physical Penetration Testing
    - SCADA / OT and IoT Penetration Testing
    - Social Engineering Assessment
    - Thick Client Penetration Testing
    - OSINT Assessment
    - Managed Penetration Testing`,
    created_by: 1,
  },
  {
    title: 'Application Security',
    thumbnailImage: null,
    bookingLink: 'https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting',
    content: `Comprehensive application security services, reviews and assessments to ensure your application code is strong enough to withstand global cyber threats.

    - SDLC maturity review
    - DevSecOps consulting
    - Secure development standards definition
    - Source code review
    - Application log enrichment for ingestion into SIEM solutions
    - Threat modelling`,
    created_by: 1,
  },
  {
    title: 'Vulnerability Assessments',
    thumbnailImage: null,
    bookingLink: 'https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting',
    content: `Gain a high-level and cost effective technical and hands-on assessment of your security posture with a focus on vulnerabilities that can impact your organisation or solution.

    - Network and infrastructure vulnerability assessment
    - Web application vulnerability assessment`,
    created_by: 1,
  },
  {
    title: 'Technical Assessments',
    thumbnailImage: null,
    bookingLink: 'https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting',
    content: `Gain a holistic understanding of the potential impact an attacker can have on your cloud and IT infrastructure, operations technology, IoT solutions and more.

    - Cloud technology assessment 
    - Operational technology assessment 
    - Industrial Control Systems testing 
    - IoT assessment including hardware, software and end-to-end solutions`,
    created_by: 1,
  },
  {
    title: 'Red/Purple Team Testing',
    thumbnailImage: null,
    bookingLink: 'https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting',
    content: `Expert testing of your digital, physical and workforce environments with a simulated cyber-intrusion using real-world attack methods specific to your unique environment and guidance to assess vulnerabilities and how to safeguard against future attacks. We help you prepare for the worst to stop

    - Red team assessments
    - Blue team assessments
    - Purple team assessments`,
    created_by: 1,
  },
  {
    title: 'Tabletop Exercise',
    thumbnailImage: null,
    bookingLink: 'https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting',
    content: `Get prepared- are you ready for an attack?
    The Tabletop Exercise is discussion-based and provides an incident scenario that has been tailored to your unique environment and operational needs. Our experts facilitates a discussion with your response team that includes the actions that are required, who is responsible for them, who needs to be notified and how to coordinate these multiple moving parts.`,
    created_by: 1,
  },
]

module.exports = async () => {
  const knex = strapi.connections.default
  return await knex.transaction(async (trx) => {
    const gcsImageIds = await knex
      .batchInsert('file_google_storages', fileGoogleStorageList)
      .transacting(trx)
      .returning('id')

    const updateMarketplaceList = marketplaceList.map((item, index) => {
      item.thumbnailImage = parseInt(gcsImageIds[index])
      return item
    })

    return await knex
      .batchInsert('market_places', updateMarketplaceList)
      .transacting(trx)
      .returning('id')
  })
}
