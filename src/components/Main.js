import React from "react"
import { getWeatherImg } from "./Header"
import { formatDate } from "./Header"

export default function Main({
  currentWeatherData,
  weatherForecastData,
  selectedUnit,
  handleUnitSettings
}) {
  let weatherForecastEl
  let windSpeed
  let windDirection
  let windDirectionIconStyle
  let humidity
  let highlightedHumidityDisplayBar
  let visibility
  let airPressure
  const focusStyle = {
    backgroundColor: "rgba(231, 231, 235, 1)",
    color: "rgba(88, 86, 118, 1)"
  }
  const unfocusStyle = {
    backgroundColor: "rgba(88, 86, 118, 1)",
    color: "rgba(231, 231, 235, 1)"
  }
  let degCelsiusBtnFocus
  let fahrenheitBtnFocus

  function determineImgStyle(imgName) {
    const imgStyles = {
      thunderstorm: { width: "55px", height: "60px" },
      lightRain: { width: "55px", height: "60px" },
      heavyRain: { width: "55px", height: "60px" },
      sleet: { width: "55px", height: "60px" },
      snow: { width: "55px", height: "45px" },
      clear: { width: "60px", height: "60px" },
      lightCloud: { width: "67px", height: "60px" },
      heavyCloud: { width: "57px", height: "40px" }
    }
    const imgStyle = imgStyles[imgName]
    return imgStyle
  }

  function determineWindDirection(windDeg) {
    const windDirectionMappings = [
      { label: "N", range: [348.75, 11.25] },
      { label: "NNE", range: [11.25, 33.75] },
      { label: "NE", range: [33.75, 56.25] },
      { label: "ENE", range: [56.25, 78.75] },
      { label: "E", range: [78.75, 101.25] },
      { label: "ESE", range: [101.25, 123.75] },
      { label: "SE", range: [123.75, 146.25] },
      { label: "SSE", range: [146.25, 168.75] },
      { label: "S", range: [168.75, 191.25] },
      { label: "SSW", range: [191.25, 213.75] },
      { label: "SW", range: [213.75, 236.25] },
      { label: "WSW", range: [236.25, 258.75] },
      { label: "W", range: [258.75, 281.25] },
      { label: "WNW", range: [281.25, 303.75] },
      { label: "NW", range: [303.75, 326.25] },
      { label: "NNW", range: [326.25, 348.75] }
    ]
    const windDirectionMapping = windDirectionMappings.find(direction => 
      windDeg >= direction.range[0] &&
      windDeg <= direction.range[1]
    )
    windDirection = windDirectionMapping ? windDirectionMapping.label : null
    return windDirection
  }

  function determineWindDirectionIconStyle(windDirection) {
    const windDirectionIconStyleMappings = {
      N: { transform: "rotate(-45deg) "},
      NNE: { transform: "rotate(-22.5deg)" },
      NE: { transform: "rotate(0deg)" },
      ENE: { transform: "rotate(22.5deg)" },
      E: { transform: "rotate(45deg)" },
      ESE: { transform: "rotate(67.5deg)" },
      SE: { transform: "rotate(90deg)" },
      SSE: { transform: "rotate(112.5deg)" },
      S: { transform: "rotate(135deg)" },
      SSW: { transform: "rotate(157.5deg)" },
      SW: { transform: "rotate(180deg)" },
      WSW: { transform: "rotate(202.5deg)" },
      W: { transform: "rotate(225deg)" },
      WNW: { transform: "rotate(247.5deg)" },
      NW: { transform: "rotate(270deg)" },
      NNW: { transform: "rotate(292.5deg)" },
    }
    const windDirectionIconStyle = windDirectionIconStyleMappings[windDirection]
    return windDirectionIconStyle
  }

  if (weatherForecastData) {
    const weatherForecastDataArr = weatherForecastData.list.slice(1, 6)
    weatherForecastEl = weatherForecastDataArr.map((day, index) => {
      const formattedDate = index === 0 ? "Tomorrow" : formatDate(day.dt)
      const img = getWeatherImg(day)[0]
      const imgName = getWeatherImg(day)[1]
      const imgStyle = determineImgStyle(imgName)
      let maxTemp
      let minTemp
      let tempUnit
      if (selectedUnit === "C") {
        maxTemp = (day.temp.max).toFixed(0)
        minTemp = (day.temp.min).toFixed(0)
        tempUnit = "°C"
      } else {
        maxTemp = (day.temp.max * 1.8 + 32).toFixed(0)
        minTemp = (day.temp.min * 1.8 + 32).toFixed(0)
        tempUnit = "°F"
      }
      return (
        <article key={formattedDate} className="weather-forecast__item">
          <div className="weather-forecast__date">{formattedDate}</div>
          <img
            src={img}
            style={imgStyle}
            alt="Weather forecast image"
          />
          <div className="weather-forecast__temp">
            <span className="weather-forecast__max-temp">{`${maxTemp}${tempUnit}`}</span>
            <span className="weather-forecast__min-temp">{`${minTemp}${tempUnit}`}</span>
          </div>
        </article>
      )
    })
  }

  if (currentWeatherData) {
    windSpeed = (currentWeatherData.wind.speed * 2.237).toFixed(0)
    const windDeg = currentWeatherData.wind.deg
    windDirection = determineWindDirection(windDeg)
    windDirectionIconStyle = determineWindDirectionIconStyle(windDirection)
    humidity = currentWeatherData.main.humidity
    highlightedHumidityDisplayBar = {
      width: `${humidity}%`,
      height: "8px",
      backgroundColor: "rgba(255, 236, 101, 1)",
      borderRadius: "4px",
      position: "relative",
      inset: "-8px 0 0 0"
    }
    visibility = (currentWeatherData.visibility / 1609).toFixed(1).replace(".", ",")
    airPressure = (currentWeatherData.main.pressure).toFixed(0)
  }

  if (selectedUnit === "C") {
    degCelsiusBtnFocus = focusStyle
    fahrenheitBtnFocus = unfocusStyle
  } else {
    degCelsiusBtnFocus = unfocusStyle
    fahrenheitBtnFocus = focusStyle
  }

  return (
    <>
      <main className="main">
        <div className="main__unit-settings-container">
          <button
            className="main__deg-celsius-btn"
            onClick={() => handleUnitSettings("C")}
            style={degCelsiusBtnFocus}
          >°C</button>
          <button
            className="main__fahrenheit-btn"
            onClick={() => handleUnitSettings("F")}
            style={fahrenheitBtnFocus}
          >°F</button>
        </div>

        <div className="weather-forecast__container">
          {weatherForecastEl}
        </div>

        <section className="highlights__container">
          <h1 className="highlights__title">Today's Highlights</h1>
          <div className="highlights__item-container">
            <h2 className="highlights__item-title">Wind status</h2>
            <div className="highlights__stat">
              <span className="highlights__value">{windSpeed}</span>
              <span className="highlights__unit">mph</span>
            </div>
            <div className="highlights__wind-direction-container">
              <div className="highlights__icon-container">
                <span 
                  className="material-icons highlights__icon"
                  style={windDirectionIconStyle}
                >near_me</span>
              </div>
              <span className="highlights__wind-direction">{windDirection}</span>
            </div>
          </div>
          <div className="highlights__item-container">
            <h2 className="highlights__item-title">Humidity</h2>
            <div className="highlights__stat">
              <span className="highlights__value">{humidity}</span>
              <span className="highlights__unit highlights__unit--humidity">%</span>
            </div>
            <div className="highlights__humidity-display">
              <div className="highlights__humidity-marker">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
              <div className="highlights__humidity-display-bar"></div>
              <div style={highlightedHumidityDisplayBar}></div>
              <div className="highlights__humidity-unit">%</div>
            </div>
          </div>
          <div className="highlights__item-container highlights__item-container--visibility">
            <h2 className="highlights__item-title">Visibility</h2>
            <div className="highlights__stat">
              <span className="highlights__value">{`${visibility} `}</span>
              <span className="highlights__unit">miles</span>
            </div>
          </div>
          <div className="highlights__item-container highlights__item-container--air-pressure">
            <h2 className="highlights__item-title">Air Pressure</h2>
            <div className="highlights__stat">
              <span className="highlights__value">{`${airPressure} `}</span>
              <span className="highlights__unit">mb</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}