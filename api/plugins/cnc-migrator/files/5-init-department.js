const departments = [
  {
    name: 'HR',
    key: 1,
  },
  {
    name: 'Sale',
    key: 2,
  },
  {
    name: 'Information Technology',
    key: 3,
  },
  {
    name: 'Temp',
    key: 4,
  },
  {
    name: 'Exec',
    key: 5,
  },
  {
    name: 'C-level',
    key: 6,
  },
  {
    name: 'Marketing',
    key: 7,
  },
  {
    name: 'Finance',
    key: 8,
  },
  {
    name: 'Operation',
    key: 9,
  },
  {
    name: 'Other',
    key: 10,
  },
]

module.exports = async () => {
  const knex = strapi.connections.default
  return await knex.transaction(async (trx) => {
    return await knex.batchInsert('departments', departments).transacting(trx).returning('id')
  })
}
