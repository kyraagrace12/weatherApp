function formatDate(date) {
  let day = currentTime.getDay()
  let hours = currentTime.getHours()
  if (hours < 10) {
    hours = `0${hours}`
  }
  let minutes = currentTime.getMinutes()
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return `Last updated: ${days[day]} ${hours}:${minutes}`
}
function search(event) {
  event.preventDefault()
  let cityInput = document.querySelector('#city-input')

  fahrenheit.classList.remove('activeNow')
  celcius.classList.add('activeNow')
  axios
    .get(`${apiUrl}q=${cityInput.value}&units=${unit}&appid=${apiKey}`)
    .then(showCityWeather)
}

function getForecast(coordinates) {
  console.log(coordinates)
  let lat = coordinates.lat
  let lon = coordinates.lon
  let apiKey = '8d282729d9e6c12dadd28e197fda8a9a'
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  console.log(apiUrl)
  axios.get(apiUrl).then(displayForecast)
}

function showCityWeather(response) {
  console.log(response)
  let cityElement = document.querySelector('#city')
  cityElement.innerHTML = response.data.name

  celciusTemperature = response.data.main.temp

  let tempElement = document.querySelector('#main-temp')
  let mainTemp = tempElement.innerHTML
  mainTemp = Number(mainTemp)
  tempElement.innerHTML = Math.round(celciusTemperature)

  let feelsLikeElement = document.querySelector('#feels_like')
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like)

  let humidityElement = document.querySelector('#humidity')
  humidityElement.innerHTML = response.data.main.humidity

  let windElement = document.querySelector('#wind')
  windElement.innerHTML = Math.round(response.data.wind.speed)

  let desciptionElement = document.querySelector('#description')
  desciptionElement.innerHTML = response.data.weather[0].description

  let iconElement = document.querySelector('#icon')
  iconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
  )
  iconElement.setAttribute('alt', response.data.weather[0].description)

  getForecast(response.data.coord)
}

function convertToFahrenheit(event) {
  event.preventDefault()
  let tempElement = document.querySelector('#main-temp')
  let fahrenheitTemp = Math.round((celciusTemperature * 9) / 5 + 32)
  tempElement.innerHTML = fahrenheitTemp

  fahrenheit.classList.add('activeNow')
  celcius.classList.remove('activeNow')
}
function convertToCelcius(event) {
  event.preventDefault()
  let tempElement = document.querySelector('#main-temp')
  tempElement.innerHTML = Math.round(celciusTemperature)

  fahrenheit.classList.remove('activeNow')
  celcius.classList.add('activeNow')
}

function showWeather(response) {
  console.log(response)

  celciusTemperature = response.data.main.temp

  let tempElement = document.querySelector('#main-temp')
  let mainTemp = tempElement.innerHTML
  mainTemp = Number(mainTemp)
  tempElement.innerHTML = Math.round(response.data.main.temp)

  let cityElement = document.querySelector('#city')
  cityElement.innerHTML = response.data.name

  let feelsLikeElement = document.querySelector('#feels_like')
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like)

  let humidityElement = document.querySelector('#humidity')
  humidityElement.innerHTML = response.data.main.humidity

  let windElement = document.querySelector('#wind')
  windElement.innerHTML = Math.round(response.data.wind.speed)

  let desciptionElement = document.querySelector('#description')
  desciptionElement.innerHTML = response.data.weather[0].description

  let iconElement = document.querySelector('#icon')
  iconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
  )
  getForecast(response.data.coord)
}
function handlePosition(response) {
  let lat = response.coords.latitude
  let long = response.coords.longitude
  console.log(lat, long)
  axios
    .get(`${apiUrl}lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`)
    .then(showWeather)
}

function currentInformation(event) {
  event.preventDefault()

  fahrenheit.classList.remove('activeNow')
  celcius.classList.add('activeNow')
  navigator.geolocation.getCurrentPosition(handlePosition)
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000)
  let day = date.getDay()
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  return days[day]
}

function displayForecast(response) {
  let forecast = response.data.daily
  console.log(response.data.daily)

  let forecastElement = document.querySelector('#forecast')

  let forecastHTML = `<div class="row">`

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2 tempDays">
            <span class="forecast-days">${formatDay(forecastDay.dt)}</span>
            <br />
            <img class="forecast-img"
              src=
    http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png
              alt=""
            />
            <br /> <div class="forecast-temperatures">
            <span class="temperature-max">
              ${Math.round(forecastDay.temp.max)}˚ </span>
            <span class="temperature-min">
              ${Math.round(forecastDay.temp.min)}˚ </span>
              </div>
            </div>`
    }
  })
  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML
}
let apiKey = '8d282729d9e6c12dadd28e197fda8a9a'
let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?'
let unit = 'metric'
let dateElement = document.querySelector('#date')
let currentTime = new Date()
let searchForm = document.querySelector('#search-form')
let fahrenheit = document.querySelector('#fahrenheit')
let currentTemperature = document.querySelector('#current-location')
let celcius = document.querySelector('#celcius')
let celciusTemperature = null

dateElement.innerHTML = formatDate(currentTime)

fahrenheit.addEventListener('click', convertToFahrenheit)
celcius.addEventListener('click', convertToCelcius)
currentTemperature.addEventListener('click', currentInformation)
searchForm.addEventListener('click', search)
