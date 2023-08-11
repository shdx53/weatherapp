import React, { useState, useEffect } from "react"
import Header from "./components/Header"
import Main from "./components/Main"
import Search from "./components/Search"
import { getLocationData, getWeatherData } from "./WeatherAPI"
import ClipLoader from "react-spinners/ClipLoader"
import "./style.css"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSearchDisplay, setIsSearchDisplay] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState("C")
  const [locationData, setLocationData] = useState(null)
  const [currentWeatherData, setCurrentWeatherData] = useState(null)
  const [weatherForecastData, setWeatherForecastData] = useState(null)
  
  function toggleSearchDisplay() {
    setIsSearchDisplay(prev => !prev)
  }

  function handleUnitSettings(unit) {
    setSelectedUnit(unit)
  }

  useEffect(() => {
    setLoading(true)
    getLocationData(null, setLocationData)
  }, [])


  useEffect(() => {
    if (locationData) {
      setLoading(true)
      getWeatherData("current", locationData, setCurrentWeatherData, setError)
      getWeatherData("forecast", locationData, setWeatherForecastData, setError)
    }
  }, [locationData, selectedUnit])

  useEffect(() => {
    loading && setLoading(false)
  }, [weatherForecastData])

  let displayEl
  if (error) {
    displayEl = 
      <div className="error-container">
        <span className="error__message">{error}</span>
      </div>
  }
  else if (loading) {
    displayEl = 
      <div className="loading-container">
        <ClipLoader color="rgba(231, 231, 235, 1)"/>
      </div>
  } else if (isSearchDisplay) {
    displayEl = 
      <div className="layout-container">
        <Search 
          setLocationData={setLocationData}
          toggleSearchDisplay={toggleSearchDisplay}
        />
        <Main
          locationData={locationData}
          currentWeatherData={currentWeatherData}
          weatherForecastData={weatherForecastData}
          selectedUnit={selectedUnit}
          handleUnitSettings={handleUnitSettings}
        />
      </div>
  } else {
    displayEl = 
      <>
        <Header
          toggleSearchDisplay={toggleSearchDisplay}
          setLocationData={setLocationData}
          currentWeatherData={currentWeatherData}
          selectedUnit={selectedUnit}
        />
        <Main
          locationData={locationData}
          currentWeatherData={currentWeatherData}
          weatherForecastData={weatherForecastData}
          selectedUnit={selectedUnit}
          handleUnitSettings={handleUnitSettings}
        />
      </>
  }
  
  return (
    <>
      {displayEl}
    </>
  )
}