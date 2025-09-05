// Global variables
let globalData = null
let countriesData = []
let selectedCountry = null
let selectedState = null

// DOM Elements
const globalStatsElement = document.getElementById("global-stats")
const countriesListElement = document.getElementById("countries-list")
const countryDetailsElement = document.getElementById("country-details")
const statesContainerElement = document.getElementById("states-container")
const statesListElement = document.getElementById("states-list")
const searchInputElement = document.getElementById("search-input")
const lastUpdatedElement = document.getElementById("last-updated")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("COVID Tracker starting...")

  // Set last updated time
  updateLastUpdated()

  // Load data
  fetchGlobalData()
  fetchCountriesData()

  // Add search functionality
  searchInputElement.addEventListener("input", filterCountries)
})

// Update last updated time
function updateLastUpdated() {
  const now = new Date()
  lastUpdatedElement.textContent = now.toLocaleString()
}

// Format numbers with commas
function formatNumber(num) {
  if (num === undefined || num === null) return "N/A"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Fetch global COVID data
function fetchGlobalData() {
  globalStatsElement.innerHTML = '<div class="loading">Loading global data...</div>'

  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      globalData = data
      displayGlobalStats()
    })
    .catch((error) => {
      console.error("Error fetching global data:", error)
      globalStatsElement.innerHTML = '<div class="error">Failed to load global data. Please refresh the page.</div>'

      // Use backup data if API fails
      useBackupGlobalData()
    })
}

// Use backup global data if API fails
function useBackupGlobalData() {
  globalData = {
    cases: 650000000,
    deaths: 6800000,
    recovered: 630000000,
    active: 13200000,
    critical: 40000,
    tests: 6500000000,
    todayCases: 50000,
    todayDeaths: 1000,
    todayRecovered: 60000,
  }
  displayGlobalStats()
}

// Display global statistics
function displayGlobalStats() {
  if (!globalData) return

  const stats = [
    {
      title: "Total Cases",
      value: globalData.cases,
      today: globalData.todayCases,
      class: "cases",
    },
    {
      title: "Active Cases",
      value: globalData.active,
      class: "active",
    },
    {
      title: "Recovered",
      value: globalData.recovered,
      today: globalData.todayRecovered,
      class: "recovered",
    },
    {
      title: "Deaths",
      value: globalData.deaths,
      today: globalData.todayDeaths,
      class: "deaths",
    },
    {
      title: "Critical",
      value: globalData.critical,
      class: "critical",
    },
    {
      title: "Tests",
      value: globalData.tests,
      class: "tests",
    },
  ]

  globalStatsElement.innerHTML = stats
    .map(
      (stat) => `
        <div class="stat-card">
            <div class="stat-title">${stat.title}</div>
            <div class="stat-value ${stat.class}">${formatNumber(stat.value)}</div>
            ${stat.today ? `<div class="stat-info">Today: +${formatNumber(stat.today)}</div>` : ""}
        </div>
    `,
    )
    .join("")
}

// Fetch countries COVID data
function fetchCountriesData() {
  countriesListElement.innerHTML = '<div class="loading">Loading countries...</div>'

  fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      countriesData = data
      displayCountriesList()
    })
    .catch((error) => {
      console.error("Error fetching countries data:", error)
      countriesListElement.innerHTML =
        '<div class="error">Failed to load countries data. Please refresh the page.</div>'

      // Use backup data if API fails
      useBackupCountriesData()
    })
}

// Use backup countries data if API fails
function useBackupCountriesData() {
  // Create some basic country data
  countriesData = [
    {
      country: "USA",
      countryInfo: { flag: "https://disease.sh/assets/img/flags/us.png", iso2: "US" },
      cases: 100000000,
      deaths: 1100000,
      recovered: 97000000,
      active: 1900000,
      todayCases: 10000,
      todayDeaths: 100,
      todayRecovered: 15000,
      casesPerOneMillion: 300000,
      deathsPerOneMillion: 3300,
      testsPerOneMillion: 3000000,
    },
    {
      country: "India",
      countryInfo: { flag: "https://disease.sh/assets/img/flags/in.png", iso2: "IN" },
      cases: 44000000,
      deaths: 530000,
      recovered: 43400000,
      active: 70000,
      todayCases: 2000,
      todayDeaths: 10,
      todayRecovered: 3000,
      casesPerOneMillion: 31000,
      deathsPerOneMillion: 380,
      testsPerOneMillion: 670000,
    },
    {
      country: "Brazil",
      countryInfo: { flag: "https://disease.sh/assets/img/flags/br.png", iso2: "BR" },
      cases: 36000000,
      deaths: 700000,
      recovered: 35000000,
      active: 300000,
      todayCases: 5000,
      todayDeaths: 30,
      todayRecovered: 6000,
      casesPerOneMillion: 170000,
      deathsPerOneMillion: 3300,
      testsPerOneMillion: 700000,
    },
    {
      country: "France",
      countryInfo: { flag: "https://disease.sh/assets/img/flags/fr.png", iso2: "FR" },
      cases: 38000000,
      deaths: 160000,
      recovered: 37500000,
      active: 340000,
      todayCases: 3000,
      todayDeaths: 20,
      todayRecovered: 4000,
      casesPerOneMillion: 580000,
      deathsPerOneMillion: 2400,
      testsPerOneMillion: 3700000,
    },
    {
      country: "Germany",
      countryInfo: { flag: "https://disease.sh/assets/img/flags/de.png", iso2: "DE" },
      cases: 37000000,
      deaths: 170000,
      recovered: 36700000,
      active: 130000,
      todayCases: 2000,
      todayDeaths: 15,
      todayRecovered: 3000,
      casesPerOneMillion: 440000,
      deathsPerOneMillion: 2000,
      testsPerOneMillion: 1200000,
    },
  ]

  displayCountriesList()
}

// Display countries list
function displayCountriesList() {
  if (!countriesData || countriesData.length === 0) return

  // Sort countries by cases (descending)
  const sortedCountries = [...countriesData].sort((a, b) => b.cases - a.cases)

  countriesListElement.innerHTML = sortedCountries
    .map(
      (country) => `
        <div class="country-item" data-country="${country.country}" onclick="selectCountry('${country.country}')">
            <div class="country-name">${country.country}</div>
            <div class="country-cases">Cases: ${formatNumber(country.cases)}</div>
        </div>
    `,
    )
    .join("")
}

// Filter countries based on search input
function filterCountries() {
  const searchTerm = searchInputElement.value.toLowerCase()
  const countryItems = document.querySelectorAll(".country-item")

  countryItems.forEach((item) => {
    const countryName = item.getAttribute("data-country").toLowerCase()
    if (countryName.includes(searchTerm)) {
      item.style.display = "block"
    } else {
      item.style.display = "none"
    }
  })
}

// Select a country
function selectCountry(countryName) {
  const country = countriesData.find((c) => c.country === countryName)
  if (!country) return

  selectedCountry = country
  console.log("Selected country:", country.country)

  // Update UI
  const countryItems = document.querySelectorAll(".country-item")
  countryItems.forEach((item) => {
    if (item.getAttribute("data-country") === countryName) {
      item.classList.add("selected")
    } else {
      item.classList.remove("selected")
    }
  })

  displayCountryDetails()
  fetchStatesData()
}

// Display country details
function displayCountryDetails() {
  if (!selectedCountry) return

  const stats = [
    {
      title: "Total Cases",
      value: selectedCountry.cases,
      today: selectedCountry.todayCases,
      class: "cases",
    },
    {
      title: "Active Cases",
      value: selectedCountry.active,
      class: "active",
    },
    {
      title: "Recovered",
      value: selectedCountry.recovered,
      today: selectedCountry.todayRecovered,
      class: "recovered",
    },
    {
      title: "Deaths",
      value: selectedCountry.deaths,
      today: selectedCountry.todayDeaths,
      class: "deaths",
    },
  ]

  const countryDetailsHTML = `
        <div class="country-details">
            <div class="country-header">
                <img class="country-flag" src="${selectedCountry.countryInfo.flag}" alt="${selectedCountry.country}" onerror="this.src='https://via.placeholder.com/60x40?text=Flag'">
                <div class="country-title">${selectedCountry.country}</div>
            </div>
            
            <div class="country-stats">
                ${stats
                  .map(
                    (stat) => `
                    <div class="country-stat">
                        <div class="country-stat-title">${stat.title}</div>
                        <div class="country-stat-value ${stat.class}">${formatNumber(stat.value)}</div>
                        ${stat.today ? `<div class="country-stat-info">Today: +${formatNumber(stat.today)}</div>` : ""}
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div class="country-stats">
                <div class="country-stat">
                    <div class="country-stat-title">Cases per Million</div>
                    <div class="country-stat-value cases">${formatNumber(selectedCountry.casesPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Deaths per Million</div>
                    <div class="country-stat-value deaths">${formatNumber(selectedCountry.deathsPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Tests per Million</div>
                    <div class="country-stat-value tests">${formatNumber(selectedCountry.testsPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Recovery Rate</div>
                    <div class="country-stat-value recovered">${((selectedCountry.recovered / selectedCountry.cases) * 100).toFixed(2)}%</div>
                </div>
            </div>
        </div>
    `

  countryDetailsElement.innerHTML = countryDetailsHTML
}

// Fetch states data for selected country
function fetchStatesData() {
  statesContainerElement.classList.add("hidden")
  statesListElement.innerHTML = ""

  // Generate states data based on country
  const statesData = []

  if (selectedCountry.countryInfo.iso2 === "US") {
    // Try to fetch real US states data
    fetch("https://disease.sh/v3/covid-19/states")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch states data")
        return response.json()
      })
      .then((data) => {
        displayStatesData(data)
      })
      .catch((error) => {
        console.error("Error fetching states data:", error)
        // Use generated data as fallback
        const generatedStates = generateStatesData(selectedCountry)
        displayStatesData(generatedStates)
      })
  } else {
    // Generate mock states data for other countries
    const generatedStates = generateStatesData(selectedCountry)
    displayStatesData(generatedStates)
  }
}

// Generate states/provinces data for a country
function generateStatesData(country) {
  let stateNames = []

  // Define state names for specific countries
  if (country.countryInfo.iso2 === "US") {
    stateNames = [
      "New York",
      "California",
      "Texas",
      "Florida",
      "Illinois",
      "Pennsylvania",
      "Ohio",
      "Georgia",
      "Michigan",
      "North Carolina",
    ]
  } else if (country.countryInfo.iso2 === "IN") {
    stateNames = [
      "Maharashtra",
      "Kerala",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
      "Uttar Pradesh",
      "West Bengal",
      "Andhra Pradesh",
      "Rajasthan",
      "Gujarat",
    ]
  } else if (country.countryInfo.iso2 === "BR") {
    stateNames = [
      "São Paulo",
      "Rio de Janeiro",
      "Minas Gerais",
      "Bahia",
      "Paraná",
      "Rio Grande do Sul",
      "Pernambuco",
      "Ceará",
      "Pará",
      "Santa Catarina",
    ]
  } else if (country.countryInfo.iso2 === "DE") {
    stateNames = [
      "Bavaria",
      "North Rhine-Westphalia",
      "Baden-Württemberg",
      "Lower Saxony",
      "Hesse",
      "Saxony",
      "Berlin",
      "Rhineland-Palatinate",
      "Schleswig-Holstein",
      "Brandenburg",
    ]
  } else if (country.countryInfo.iso2 === "GB") {
    stateNames = [
      "England",
      "Scotland",
      "Wales",
      "Northern Ireland",
      "London",
      "South East",
      "North West",
      "East of England",
      "West Midlands",
      "South West",
    ]
  } else if (country.countryInfo.iso2 === "FR") {
    stateNames = [
      "Île-de-France",
      "Auvergne-Rhône-Alpes",
      "Hauts-de-France",
      "Provence-Alpes-Côte d'Azur",
      "Grand Est",
      "Occitanie",
      "Nouvelle-Aquitaine",
      "Normandy",
      "Brittany",
      "Pays de la Loire",
    ]
  } else if (country.countryInfo.iso2 === "IT") {
    stateNames = [
      "Lombardy",
      "Lazio",
      "Campania",
      "Veneto",
      "Sicily",
      "Emilia-Romagna",
      "Piedmont",
      "Apulia",
      "Tuscany",
      "Calabria",
    ]
  } else if (country.countryInfo.iso2 === "ES") {
    stateNames = [
      "Madrid",
      "Catalonia",
      "Andalusia",
      "Valencia",
      "Galicia",
      "Castile and León",
      "Basque Country",
      "Canary Islands",
      "Castilla-La Mancha",
      "Murcia",
    ]
  } else if (country.countryInfo.iso2 === "CA") {
    stateNames = [
      "Ontario",
      "Quebec",
      "British Columbia",
      "Alberta",
      "Manitoba",
      "Saskatchewan",
      "Nova Scotia",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Prince Edward Island",
    ]
  } else if (country.countryInfo.iso2 === "AU") {
    stateNames = [
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "South Australia",
      "Tasmania",
      "Australian Capital Territory",
      "Northern Territory",
    ]
  } else if (country.countryInfo.iso2 === "JP") {
    stateNames = ["Tokyo", "Osaka", "Kanagawa", "Aichi", "Saitama", "Chiba", "Hyogo", "Hokkaido", "Fukuoka", "Kyoto"]
  } else if (country.countryInfo.iso2 === "CN") {
    stateNames = [
      "Hubei",
      "Guangdong",
      "Zhejiang",
      "Henan",
      "Hunan",
      "Anhui",
      "Jiangxi",
      "Shandong",
      "Jiangsu",
      "Chongqing",
    ]
  } else {
    // Generic regions for other countries
    stateNames = [
      "Region 1",
      "Region 2",
      "Region 3",
      "Region 4",
      "Region 5",
      "Capital Region",
      "Northern Region",
      "Southern Region",
      "Eastern Region",
      "Western Region",
    ]
  }

  // Generate data for each state
  return stateNames.map((name, index) => {
    const totalCases = Math.floor((country.cases / stateNames.length) * (0.5 + Math.random()))
    const deaths = Math.floor(totalCases * (country.deaths / country.cases))
    const recovered = Math.floor(totalCases * (country.recovered / country.cases))
    const active = totalCases - deaths - recovered

    return {
      state: name,
      cases: totalCases,
      deaths: deaths,
      recovered: recovered,
      active: active,
      todayCases: Math.floor((country.todayCases / stateNames.length) * (0.5 + Math.random())),
      todayDeaths: Math.floor((country.todayDeaths / stateNames.length) * (0.5 + Math.random())),
      tests: Math.floor(totalCases * 10),
      casesPerOneMillion: Math.floor((totalCases * 1000000) / (country.population / stateNames.length)),
      deathsPerOneMillion: Math.floor((deaths * 1000000) / (country.population / stateNames.length)),
      testsPerOneMillion: Math.floor((totalCases * 10 * 1000000) / (country.population / stateNames.length)),
    }
  })
}

// Display states data
function displayStatesData(states) {
  if (!states || states.length === 0) return

  statesListElement.innerHTML = states
    .map(
      (state) => `
        <div class="state-item" data-state="${state.state}" onclick="selectState('${state.state}', ${JSON.stringify(state).replace(/"/g, "&quot;")})">
            <div class="state-name">${state.state}</div>
            <div class="state-cases">Cases: ${formatNumber(state.cases)}</div>
            <div class="state-cases">Deaths: ${formatNumber(state.deaths)}</div>
        </div>
    `,
    )
    .join("")

  statesContainerElement.classList.remove("hidden")
}

// Select a state
function selectState(stateName, stateData) {
  selectedState = stateData
  console.log("Selected state:", stateName)

  // Update UI
  const stateItems = document.querySelectorAll(".state-item")
  stateItems.forEach((item) => {
    if (item.getAttribute("data-state") === stateName) {
      item.classList.add("selected")
    } else {
      item.classList.remove("selected")
    }
  })

  displayStateDetails(stateData)
}

// Display state details
function displayStateDetails(state) {
  if (!state) return

  const stateDetailsHTML = `
        <div class="state-details">
            <h3>${state.state} Statistics</h3>
            
            <div class="country-stats">
                <div class="country-stat">
                    <div class="country-stat-title">Total Cases</div>
                    <div class="country-stat-value cases">${formatNumber(state.cases)}</div>
                    ${state.todayCases ? `<div class="country-stat-info">Today: +${formatNumber(state.todayCases)}</div>` : ""}
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Active Cases</div>
                    <div class="country-stat-value active">${formatNumber(state.active)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Recovered</div>
                    <div class="country-stat-value recovered">${formatNumber(state.recovered)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Deaths</div>
                    <div class="country-stat-value deaths">${formatNumber(state.deaths)}</div>
                    ${state.todayDeaths ? `<div class="country-stat-info">Today: +${formatNumber(state.todayDeaths)}</div>` : ""}
                </div>
            </div>
            
            <div class="country-stats">
                <div class="country-stat">
                    <div class="country-stat-title">Cases per Million</div>
                    <div class="country-stat-value cases">${formatNumber(state.casesPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Deaths per Million</div>
                    <div class="country-stat-value deaths">${formatNumber(state.deathsPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Tests</div>
                    <div class="country-stat-value tests">${formatNumber(state.tests)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Recovery Rate</div>
                    <div class="country-stat-value recovered">${((state.recovered / state.cases) * 100).toFixed(2)}%</div>
                </div>
            </div>
        </div>
    `

  // Add state details after states list
  const existingStateDetails = document.querySelector(".state-details")
  if (existingStateDetails) {
    existingStateDetails.remove()
  }

  statesContainerElement.insertAdjacentHTML("beforeend", stateDetailsHTML)
}

// Auto-refresh data every 5 minutes
setInterval(
  () => {
    console.log("Auto-refreshing data...")
    fetchGlobalData()
    fetchCountriesData()
    updateLastUpdated()
  },
  5 * 60 * 1000,
)

// Load states data for selected country - यह function को update करें
async function loadStatesData() {
  document.getElementById("states-section").style.display = "none"

  if (!selectedCountry) return

  try {
    console.log("Loading states data for:", selectedCountry.country)

    let statesEndpoint = ""
    let statesData = []

    // Different countries have different endpoints for states/provinces
    if (selectedCountry.countryInfo.iso2 === "US") {
      statesEndpoint = "https://disease.sh/v3/covid-19/states"
    } else if (selectedCountry.countryInfo.iso2 === "CA") {
      statesEndpoint = "https://disease.sh/v3/covid-19/gov/canada"
    } else if (selectedCountry.countryInfo.iso2 === "AU") {
      statesEndpoint = "https://disease.sh/v3/covid-19/gov/australia"
    } else if (selectedCountry.countryInfo.iso2 === "DE") {
      statesEndpoint = "https://disease.sh/v3/covid-19/gov/germany"
    } else if (selectedCountry.countryInfo.iso2 === "IN") {
      // For India, we'll create mock state data since API doesn't have it
      statesData = createMockIndianStates()
    } else if (selectedCountry.countryInfo.iso2 === "BR") {
      // For Brazil, create mock state data
      statesData = createMockBrazilStates()
    } else if (selectedCountry.countryInfo.iso2 === "CN") {
      // For China, create mock province data
      statesData = createMockChinaProvinces()
    } else if (selectedCountry.countryInfo.iso2 === "GB") {
      // For UK, create mock regions data
      statesData = createMockUKRegions()
    } else {
      // For other countries, create mock regions based on population
      statesData = createMockRegions(selectedCountry)
    }

    if (statesEndpoint) {
      const response = await fetch(statesEndpoint)
      if (response.ok) {
        statesData = await response.json()
      }
    }

    if (statesData && statesData.length > 0) {
      console.log("States data loaded:", statesData.length, "states/provinces")
      displayStatesGrid(statesData)
    }
  } catch (error) {
    console.error("Error loading states data:", error)
    // Create mock data as fallback
    const mockStates = createMockRegions(selectedCountry)
    if (mockStates.length > 0) {
      displayStatesGrid(mockStates)
    }
  }
}

// Create mock Indian states data
function createMockIndianStates() {
  const indianStates = [
    "Maharashtra",
    "Kerala",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Delhi",
    "West Bengal",
    "Odisha",
    "Telangana",
    "Rajasthan",
    "Haryana",
    "Madhya Pradesh",
    "Gujarat",
    "Punjab",
    "Jammu and Kashmir",
    "Jharkhand",
    "Assam",
    "Bihar",
    "Himachal Pradesh",
    "Uttarakhand",
  ]

  return indianStates.map((state, index) => {
    const baseCases = Math.floor(selectedCountry.cases / indianStates.length)
    const variation = Math.floor(Math.random() * baseCases * 0.5)
    const cases = baseCases + (index % 2 === 0 ? variation : -variation)

    return {
      state: state,
      cases: Math.max(cases, 1000),
      deaths: Math.floor(cases * 0.02),
      recovered: Math.floor(cases * 0.85),
      active: Math.floor(cases * 0.13),
      todayCases: Math.floor(Math.random() * 1000),
      todayDeaths: Math.floor(Math.random() * 50),
      tests: Math.floor(cases * 15),
      casesPerOneMillion: Math.floor(cases / 10),
      deathsPerOneMillion: Math.floor((cases * 0.02) / 10),
      testsPerOneMillion: Math.floor((cases * 15) / 10),
    }
  })
}

// Create mock Brazil states data
function createMockBrazilStates() {
  const brazilStates = [
    "São Paulo",
    "Rio de Janeiro",
    "Minas Gerais",
    "Bahia",
    "Paraná",
    "Rio Grande do Sul",
    "Pernambuco",
    "Ceará",
    "Pará",
    "Santa Catarina",
    "Maranhão",
    "Goiás",
    "Amazonas",
    "Espírito Santo",
    "Paraíba",
  ]

  return brazilStates.map((state, index) => {
    const baseCases = Math.floor(selectedCountry.cases / brazilStates.length)
    const variation = Math.floor(Math.random() * baseCases * 0.4)
    const cases = baseCases + (index % 2 === 0 ? variation : -variation)

    return {
      state: state,
      cases: Math.max(cases, 5000),
      deaths: Math.floor(cases * 0.025),
      recovered: Math.floor(cases * 0.82),
      active: Math.floor(cases * 0.155),
      todayCases: Math.floor(Math.random() * 2000),
      todayDeaths: Math.floor(Math.random() * 100),
      tests: Math.floor(cases * 12),
      casesPerOneMillion: Math.floor(cases / 8),
      deathsPerOneMillion: Math.floor((cases * 0.025) / 8),
      testsPerOneMillion: Math.floor((cases * 12) / 8),
    }
  })
}

// Create mock China provinces data
function createMockChinaProvinces() {
  const chinaProvinces = [
    "Hubei",
    "Guangdong",
    "Henan",
    "Zhejiang",
    "Hunan",
    "Anhui",
    "Jiangxi",
    "Shandong",
    "Jiangsu",
    "Chongqing",
    "Sichuan",
    "Heilongjiang",
    "Beijing",
    "Shanghai",
    "Hebei",
  ]

  return chinaProvinces.map((province, index) => {
    const baseCases = Math.floor(selectedCountry.cases / chinaProvinces.length)
    const variation = Math.floor(Math.random() * baseCases * 0.3)
    const cases = baseCases + (index % 2 === 0 ? variation : -variation)

    return {
      state: province,
      cases: Math.max(cases, 2000),
      deaths: Math.floor(cases * 0.015),
      recovered: Math.floor(cases * 0.9),
      active: Math.floor(cases * 0.085),
      todayCases: Math.floor(Math.random() * 500),
      todayDeaths: Math.floor(Math.random() * 20),
      tests: Math.floor(cases * 20),
      casesPerOneMillion: Math.floor(cases / 12),
      deathsPerOneMillion: Math.floor((cases * 0.015) / 12),
      testsPerOneMillion: Math.floor((cases * 20) / 12),
    }
  })
}

// Create mock UK regions data
function createMockUKRegions() {
  const ukRegions = [
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "London",
    "South East",
    "North West",
    "East of England",
    "West Midlands",
    "South West",
    "Yorkshire",
    "North East",
  ]

  return ukRegions.map((region, index) => {
    const baseCases = Math.floor(selectedCountry.cases / ukRegions.length)
    const variation = Math.floor(Math.random() * baseCases * 0.4)
    const cases = baseCases + (index % 2 === 0 ? variation : -variation)

    return {
      state: region,
      cases: Math.max(cases, 3000),
      deaths: Math.floor(cases * 0.03),
      recovered: Math.floor(cases * 0.8),
      active: Math.floor(cases * 0.17),
      todayCases: Math.floor(Math.random() * 1500),
      todayDeaths: Math.floor(Math.random() * 80),
      tests: Math.floor(cases * 18),
      casesPerOneMillion: Math.floor(cases / 6),
      deathsPerOneMillion: Math.floor((cases * 0.03) / 6),
      testsPerOneMillion: Math.floor((cases * 18) / 6),
    }
  })
}

// Create mock regions for any country
function createMockRegions(country) {
  const regionNames = [
    "Northern Region",
    "Southern Region",
    "Eastern Region",
    "Western Region",
    "Central Region",
    "Capital Region",
    "Coastal Region",
    "Mountain Region",
    "Metropolitan Area",
    "Rural Areas",
    "Border Region",
    "Industrial Zone",
  ]

  // Only create regions for countries with significant cases
  if (country.cases < 10000) return []

  const numRegions = Math.min(regionNames.length, Math.max(4, Math.floor(country.cases / 50000)))
  const selectedRegions = regionNames.slice(0, numRegions)

  return selectedRegions.map((region, index) => {
    const baseCases = Math.floor(country.cases / selectedRegions.length)
    const variation = Math.floor(Math.random() * baseCases * 0.5)
    const cases = baseCases + (index % 2 === 0 ? variation : -variation)

    return {
      state: region,
      cases: Math.max(cases, 500),
      deaths: Math.floor(cases * (country.deaths / country.cases)),
      recovered: Math.floor(cases * (country.recovered / country.cases)),
      active: Math.floor(cases * (country.active / country.cases)),
      todayCases: Math.floor(Math.random() * Math.max(100, cases * 0.01)),
      todayDeaths: Math.floor(Math.random() * Math.max(5, cases * 0.0005)),
      tests: Math.floor(cases * 10),
      casesPerOneMillion: Math.floor(cases / 5),
      deathsPerOneMillion: Math.floor((cases * (country.deaths / country.cases)) / 5),
      testsPerOneMillion: Math.floor((cases * 10) / 5),
    }
  })
}

// Display states grid - यह function को भी update करें
function displayStatesGrid(states) {
  if (!states || !states.length) return

  const statesHTML = `
        <div class="states-section">
            <h2>🏛️ ${selectedCountry.country} - States/Provinces (${states.length})</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">Click on any state/province to view detailed statistics</p>
            <div class="states-grid">
                ${states
                  .map(
                    (state) => `
                    <div class="state-item" onclick="selectState('${state.state}')">
                        <div class="state-name">${state.state}</div>
                        <div class="state-cases">Cases: ${formatNumber(state.cases)}</div>
                        <div class="state-cases" style="color: var(--accent-red);">Deaths: ${formatNumber(state.deaths)}</div>
                        <div class="state-cases" style="color: var(--accent-green);">Recovered: ${formatNumber(state.recovered)}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `

  document.getElementById("states-section").innerHTML = statesHTML
  document.getElementById("states-section").style.display = "block"

  // Store states data globally
  window.currentStatesData = states
}

// Select a state - यह function को भी update करें
function selectState(stateName) {
  const state = window.currentStatesData ? window.currentStatesData.find((s) => s.state === stateName) : null
  if (!state) return

  selectedState = state
  console.log("Selected state:", state.state)

  // Update UI
  document.querySelectorAll(".state-item").forEach((item) => {
    item.classList.remove("selected")
  })

  event.target.classList.add("selected")

  displayStateDetail()
}

function displayStateDetail() {
  if (!selectedState) return

  const stateDetailsHTML = `
        <div class="state-details">
            <h3>${selectedState.state} Statistics</h3>

            <div class="country-stats">
                <div class="country-stat">
                    <div class="country-stat-title">Total Cases</div>
                    <div class="country-stat-value cases">${formatNumber(selectedState.cases)}</div>
                    ${selectedState.todayCases ? `<div class="country-stat-info">Today: +${formatNumber(selectedState.todayCases)}</div>` : ""}
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Active Cases</div>
                    <div class="country-stat-value active">${formatNumber(selectedState.active)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Recovered</div>
                    <div class="country-stat-value recovered">${formatNumber(selectedState.recovered)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Deaths</div>
                    <div class="country-stat-value deaths">${formatNumber(selectedState.deaths)}</div>
                    ${selectedState.todayDeaths ? `<div class="country-stat-info">Today: +${formatNumber(selectedState.todayDeaths)}</div>` : ""}
                </div>
            </div>

            <div class="country-stats">
                <div class="country-stat">
                    <div class="country-stat-title">Cases per Million</div>
                    <div class="country-stat-value cases">${formatNumber(selectedState.casesPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Deaths per Million</div>
                    <div class="country-stat-value deaths">${formatNumber(selectedState.deathsPerOneMillion)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Tests</div>
                    <div class="country-stat-value tests">${formatNumber(selectedState.tests)}</div>
                </div>
                <div class="country-stat">
                    <div class="country-stat-title">Recovery Rate</div>
                    <div class="country-stat-value recovered">${((selectedState.recovered / selectedState.cases) * 100).toFixed(2)}%</div>
                </div>
            </div>
        </div>
    `

  // Add state details after states list
  const existingStateDetails = document.querySelector(".state-details")
  if (existingStateDetails) {
    existingStateDetails.remove()
  }

  statesContainerElement.insertAdjacentHTML("beforeend", stateDetailsHTML)
}
