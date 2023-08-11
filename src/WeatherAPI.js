export function getLocationData(searchLocation, setLocationData) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      if (searchLocation) {
        setLocationData({
          searchLocation: searchLocation
        })
      } else {
        const { latitude, longitude } = position.coords
        setLocationData({
          lat: latitude,
          lon: longitude
        })
      }
    })
  }
}

export function getWeatherData(
  type,
  locationData,
  setWeatherData,
  setError
) {
  const query = type === "current" ? "weather" : "forecast/daily"
  let url 
  if (locationData.searchLocation) {
    const location = locationData.searchLocation
    url = `https://pro.openweathermap.org/data/2.5/${query}?q=${location}&units=metric&APPID=0a58f7b3251c8cc1bc1fc2e344248585`
  } else {
    const { lat, lon } = locationData
    url = `https://pro.openweathermap.org/data/2.5/${query}?lat=${lat}&lon=${lon}&units=metric&APPID=0a58f7b3251c8cc1bc1fc2e344248585`
  }
  fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch weather data")
    }
    return res.json()
  })
  .then(data => setWeatherData(data))
  .catch(err => setError(err.message))
}


