const industries = [
  {
    "name": "Aviation & Aerospace",
    "rating": 41
  },
  {
    "name": "Computer Networking",
    "rating": 39
  },
  {
    "name": "Consumer Goods",
    "rating": 47
  },
  {
    "name": "Sports",
    "rating": 47
  },
  {
    "name": "Banking",
    "rating": 43
  },
  {
    "name": "Research",
    "rating": 51
  },
  {
    "name": "Food Production",
    "rating": 60
  },
  {
    "name": "Medical Devices",
    "rating": 47
  },
  {
    "name": "Consumer Services",
    "rating": 51
  },
  {
    "name": "Mining & Metals",
    "rating": 57
  },
  {
    "name": "Recreational Facilities and Services",
    "rating": 57
  },
  {
    "name": "Primary/Secondary Education",
    "rating": 40
  },
  {
    "name": "Oil & Energy",
    "rating": 40
  },
  {
    "name": "Executive Office",
    "rating": 47
  },
  {
    "name": "Airlines/Aviation",
    "rating": 47
  },
  {
    "name": "Hospital & Health Care",
    "rating": 61
  },
  {
    "name": "International Affairs",
    "rating": 45
  },
  {
    "name": "Alternative Dispute Resolution",
    "rating": 58
  },
  {
    "name": "Investment Management",
    "rating": 40
  },
  {
    "name": "Law Practice",
    "rating": 64
  },
  {
    "name": "Wine and Spirits",
    "rating": 50
  },
  {
    "name": "Think Tanks",
    "rating": 45
  },
  {
    "name": "Defense & Space",
    "rating": 59
  },
  {
    "name": "Railroad Manufacture",
    "rating": 63
  },
  {
    "name": "Utilities",
    "rating": 67
  },
  {
    "name": "Graphic Design",
    "rating": 68
  },
  {
    "name": "Building Materials",
    "rating": 63
  },
  {
    "name": "Design",
    "rating": 66
  },
  {
    "name": "Real Estate",
    "rating": 38
  },
  {
    "name": "Security and Investigations",
    "rating": 50
  },
  {
    "name": "Biotechnology",
    "rating": 63
  },
  {
    "name": "Translation and Localization",
    "rating": 42
  },
  {
    "name": "Apparel & Fashion",
    "rating": 63
  },
  {
    "name": "Legal Services",
    "rating": 64
  },
  {
    "name": "Civil Engineering",
    "rating": 59
  },
  {
    "name": "Religious Institutions",
    "rating": 62
  },
  {
    "name": "Gambling & Casinos",
    "rating": 47
  },
  {
    "name": "Music",
    "rating": 39
  },
  {
    "name": "Education Management",
    "rating": 60
  },
  {
    "name": "Telecommunications",
    "rating": 41
  },
  {
    "name": "Government Relations",
    "rating": 54
  },
  {
    "name": "Publishing",
    "rating": 46
  },
  {
    "name": "Staffing and Recruiting",
    "rating": 41
  },
  {
    "name": "Market Research",
    "rating": 59
  },
  {
    "name": "Higher Education",
    "rating": 41
  },
  {
    "name": "Events Services",
    "rating": 59
  },
  {
    "name": "Electrical/Electronic Manufacturing",
    "rating": 51
  },
  {
    "name": "Arts and Crafts",
    "rating": 54
  },
  {
    "name": "Fishery",
    "rating": 54
  },
  {
    "name": "Health, Wellness and Fitness",
    "rating": 46
  },
  {
    "name": "Capital Markets",
    "rating": 55
  },
  {
    "name": "Philanthropy",
    "rating": 40
  },
  {
    "name": "Judiciary",
    "rating": 62
  },
  {
    "name": "Commercial Real Estate",
    "rating": 64
  },
  {
    "name": "Printing",
    "rating": 52
  },
  {
    "name": "Broadcast Media",
    "rating": 55
  },
  {
    "name": "Transportation/Trucking/Railroad",
    "rating": 60
  },
  {
    "name": "Marketing and Advertising",
    "rating": 42
  },
  {
    "name": "Animation",
    "rating": 45
  },
  {
    "name": "E-Learning",
    "rating": 47
  },
  {
    "name": "Logistics and Supply Chain",
    "rating": 42
  },
  {
    "name": "Sporting Goods",
    "rating": 56
  },
  {
    "name": "Military",
    "rating": 48
  },
  {
    "name": "Environmental Services",
    "rating": 51
  },
  {
    "name": "Government Administration",
    "rating": 59
  },
  {
    "name": "Information Services",
    "rating": 44
  },
  {
    "name": "Performing Arts",
    "rating": 47
  },
  {
    "name": "Newspapers",
    "rating": 45
  },
  {
    "name": "Individual & Family Services",
    "rating": 40
  },
  {
    "name": "Accounting",
    "rating": 38
  },
  {
    "name": "Construction",
    "rating": 52
  },
  {
    "name": "Leisure, Travel & Tourism",
    "rating": 49
  },
  {
    "name": "Architecture & Planning",
    "rating": 40
  },
  {
    "name": "Hospitality",
    "rating": 64
  },
  {
    "name": "Nanotechnology",
    "rating": 67
  },
  {
    "name": "Political Organization",
    "rating": 62
  },
  {
    "name": "Motion Pictures and Film",
    "rating": 58
  },
  {
    "name": "Maritime",
    "rating": 50
  },
  {
    "name": "Supermarkets",
    "rating": 69
  },
  {
    "name": "Program Development",
    "rating": 55
  },
  {
    "name": "Entertainment",
    "rating": 43
  },
  {
    "name": "Industrial Automation",
    "rating": 43
  },
  {
    "name": "Financial Services",
    "rating": 59
  },
  {
    "name": "Online Media",
    "rating": 51
  },
  {
    "name": "Import and Export",
    "rating": 67
  },
  {
    "name": "Retail",
    "rating": 55
  },
  {
    "name": "Law Enforcement",
    "rating": 46
  },
  {
    "name": "Restaurants",
    "rating": 61
  },
  {
    "name": "Dairy",
    "rating": 60
  },
  {
    "name": "Farming",
    "rating": 50
  },
  {
    "name": "Cosmetics",
    "rating": 42
  },
  {
    "name": "Facilities Services",
    "rating": 62
  },
  {
    "name": "Automotive",
    "rating": 55
  },
  {
    "name": "Legislative Office",
    "rating": 45
  },
  {
    "name": "Machinery",
    "rating": 48
  },
  {
    "name": "Shipbuilding",
    "rating": 55
  },
  {
    "name": "Public Relations and Communications",
    "rating": 39
  },
  {
    "name": "Computer & Network Security",
    "rating": 40
  },
  {
    "name": "Venture Capital & Private Equity",
    "rating": 55
  },
  {
    "name": "Consumer Electronics",
    "rating": 62
  }
]


module.exports = () => {
  return industries.map(industry => {
    return strapi.query('industry').create(industry)
  })
}