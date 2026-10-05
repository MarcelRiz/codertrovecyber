const courses = [
  {
    name: 'Password',
    description:
      "Don't write or print passwords on paper or in unsecured digital files. A sticky note with the password on the backside of a laptop or a list of passwords in an unprotected excel sheet, are definitely ways NOT to save passwords!",
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Internet Downloads',
    description:
      'Only download reputable software from reputable sources. If you don’t know the source, or it looks suspicious, don’t risk it, head to the official source and go from there.',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Data Handling',
    description:
      'Information beyond name and email such as birth date and address should not be provided freely as a best practice – you should only provide this information to trusted companies with which you have an established relationship.',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Removable Media',
    description:
      'When it comes to cyber security best practices, removable media and devices must only be plugged or inserted into your computer if you trust/know the source.',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Wi-Fi Use',
    description: 'Public Wi-Fi is not secure and can put your device and data at risk.',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Computer Theft',
    description:
      'The most important best practice is to not leave devices unattended in public places. Even if you think your risk might be lower, don’t take a chance. Take your devices with you!',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Phishing and Ransomware',
    description:
      'Only download reputable software from reputable sources. If you don’t know the source, or it looks suspicious, don’t risk it, head to the official source and go from there.',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Vishing',
    description:
      'Vishing is the fraudulent practice of making phone calls or leaving voice messages purporting to be from reputable companies in order to trick individuals to reveal personal information, such as bank details and credit card numbers.',
    isFree: true,
    created_by: 1,
  },
  {
    name: 'Vishing',
    description:
      'Vishing is the fraudulent practice of making phone calls or leaving voice messages purporting to be from reputable companies in order to trick individuals to reveal personal information, such as bank details and credit card numbers.',
    isFree: true,
    created_by: 1,
  },
]

module.exports = async () => {
  const knex = strapi.connections.default
  return await knex.transaction(async (trx) => {
    return await knex.batchInsert('courses', courses).transacting(trx).returning('id')
  })
}
