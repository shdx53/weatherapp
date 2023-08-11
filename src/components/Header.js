import React from "react"
import cloudBg from "../img/Cloud-background.png"
import clear from "../img/Clear.png"
import heavyCloud from "../img/HeavyCloud.png"
import heavyRain from "../img/HeavyRain.png"
import lightCloud from "../img/LightCloud.png"
import lightRain from "../img/LightRain.png"
import sleet from "../img/Sleet.png"
import snow from "../img/Snow.png"
import thunderstorm from "../img/Thunderstorm.png"
import { getLocationData } from "../WeatherAPI"

export function getWeatherImg(weatherData) {
  let weatherImg
  let weatherImgName
  const weatherMain = weatherData.weather[0].main
  const weatherDesc = weatherData.weather[0].description
  const weatherConditionMappings = {
    Thunderstorm: { img: thunderstorm, name: "thunderstorm" },
    Drizzle: { img: lightRain, name: "lightRain" },
    Rain: {
      freezing: { img: sleet, name: "sleet" },
      heavy: { img: heavyRain, name: "heavyRain" },
      extreme: { img: heavyRain, name: "heavyRain" },
      default: { img: lightRain, name: "lightRain" }
    },
    Snow: {
      sleet: { img: sleet, name: "sleet" },
      rain: { img: sleet, name: "sleet" },
      shower: { img: sleet, name: "sleet" },
      default: { img: snow, name: "snow" }
    },
    Clear: { img: clear, name: "clear" },
    Clouds: {
      few: { img: lightCloud, name: "lightCloud" },
      default: { img: heavyCloud, name: "heavyCloud" }
    }
  }
  if (weatherConditionMappings[weatherMain].img) {
    weatherImg = weatherConditionMappings[weatherMain].img
    weatherImgName = weatherConditionMappings[weatherMain].name
  } else {
    let descKey = Object.keys(weatherConditionMappings[weatherMain]).find(key =>
      weatherDesc.includes(key)
    )
    if (!descKey) {
      weatherImg = weatherConditionMappings[weatherMain].default.img
      weatherImgName = weatherConditionMappings[weatherMain].default.name
    } else {
      weatherImg = weatherConditionMappings[weatherMain][descKey].img
      weatherImgName = weatherConditionMappings[weatherMain][descKey].name
    }
  }
  return [weatherImg, weatherImgName]
}

export function formatDate(timestamp) {
  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thurs",
    "Fri",
    "Sat"
  ]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]
  const date = new Date(timestamp * 1000)
  const dateOfMonth = date.getDate()
  const dayOfWeek = days[date.getDay()]
  const month = months[date.getMonth()]
  const formattedDate = `${dayOfWeek}, ${dateOfMonth} ${month}`
  return formattedDate
}

export default function Header({
  toggleSearchDisplay,
  setLocationData,
  currentWeatherData,
  selectedUnit,
}) {
  let currentWeatherDesc
  let currentWeatherImg
  let temp
  let formattedDate
  let location
  let tempUnit

  if (currentWeatherData) {
    currentWeatherImg = getWeatherImg(currentWeatherData)[0]
    currentWeatherDesc = currentWeatherData.weather[0].description
    formattedDate = formatDate(currentWeatherData.dt)
    location = currentWeatherData.name
    if (selectedUnit === "C") {
      tempUnit = "°C"
      temp = (currentWeatherData.main.temp).toFixed(0)
    } else {
      tempUnit = "°F"
      temp = (currentWeatherData.main.temp * 1.8 + 32).toFixed(0)
    }
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__nav">
            <button
              className="header__search-btn"
              onClick={toggleSearchDisplay}
            >
              Search for places
            </button>
            <button
              className="header__location-btn"
              onClick={() => getLocationData(null, setLocationData)}
            >
              <span className="material-icons header__location-icon">
                my_location
              </span>
            </button>
          </div>
        </div>

        <div className="header__img-container">
          <img 
            src={cloudBg} 
            className="header__bg" 
            alt="Header background image"
          />
          <img 
            src={currentWeatherImg} 
            className="header__img" 
            alt="Current weather image"
          />
        </div>

        <div className="header__info container">
          <div className="header__temp">
            <span className="header__value">{temp}</span>
            <span className="header__unit">{tempUnit}</span>
          </div>
          <div className="header__desc">{currentWeatherDesc}</div>
          <div className="header__date">
            <span className="header__day">Today</span>
            <span className="header__separator">•</span>
            <span>{formattedDate}</span>
          </div>
          <div className="header__location">
            <span className="material-icons header__location-icon--dark">location_on</span>
            <span className="header__location-name">{location}</span>
          </div>
        </div>
      </header>
    </>
  )
}