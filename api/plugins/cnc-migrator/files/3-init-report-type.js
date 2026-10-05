const reportTypes = [
  {
    "name": "Vulnerability Scanning",
    "description": ""
  },
  {
    "name": "Phishing Simulation",
    "description": ""
  },
  {
    "name": "Dark Web Exposure",
    "description": ""
  }
]

module.exports = () => {
  return reportTypes.map(reportType => {
    return strapi.query('report-type').create(reportType)
  })
}