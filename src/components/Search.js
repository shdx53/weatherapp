import React, { useEffect, useRef, useState } from "react"
import { getLocationData } from "../WeatherAPI"

export default function Search({ setLocationData, toggleSearchDisplay }) {
  const [searchLocation, setSearchLocation] = useState("")
  const [existingSearchHistory, setExistingSearchHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory"))
  )
  const [searchHistoryEl, setSearchHistoryEl] = useState(null)
  const [updateSearchHistoryEl, setUpdateSearchHistoryEl] = useState(false)
  const [isFocus, setIsFocus] = useState({
    form: false,
    page: true
  })
  const formRef = useRef(null)
  const inputRef= useRef(null)
  const firstHistoryRef = useRef(null)
  const secondHistoryRef = useRef(null)
  const thirdHistoryRef = useRef(null)
  const historyRefArr = [firstHistoryRef, secondHistoryRef, thirdHistoryRef]
  let formFocus
  if (isFocus.form) {
    formFocus = {
      border: "1px solid rgba(231, 231, 235, 1)"
    }
    inputRef.current.focus()
  }

  function handleChange(event) {
    setSearchLocation(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const searchHistoryArr = existingSearchHistory ? existingSearchHistory : []
    if (searchLocation) {
      const searchLocationToSave = searchLocation.trim()
      searchHistoryArr.push(searchLocationToSave)
      localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr))
      getLocationData(searchLocationToSave, setLocationData)
      setExistingSearchHistory(searchHistoryArr)
      setUpdateSearchHistoryEl(prev => !prev)
    }
    toggleSearchDisplay()
  }

  function handleAutoFill(searchLocation) {
    setSearchLocation(searchLocation)
  }

  function handleFocus(event) {
    event.stopPropagation()
    const targetInHistoryRefs = historyRefArr.some(ref => {
      if (ref.current) {
        return ref.current.contains(event.target)
      }
    })
    const targetInForm = formRef.current.contains(event.target)
    if ((targetInForm || targetInHistoryRefs) && !isFocus.form) {
      setIsFocus({
        form: true,
        page: false
      })
    } else if (!targetInForm && !targetInHistoryRefs && !isFocus.page) {
      setIsFocus({
        form: false,
        page: true
      })
    }
  }

  useEffect(() => {
    if (existingSearchHistory) {
      let filteredExistingSearchHistory
      if (existingSearchHistory.length > 3) {
        filteredExistingSearchHistory = existingSearchHistory.slice(-3).reverse()
      } else {
        filteredExistingSearchHistory = existingSearchHistory.reverse()
      }
      setSearchHistoryEl(filteredExistingSearchHistory.map((location, index) => {
        return (
          <button
            className="search-history__item-container"
            onClick={() => handleAutoFill(location)}
            ref={historyRefArr[index]}
          >
            <span className="search-history__item">{location}</span>
            <span className="search-history__arrow">{`>`}</span>
          </button>
        )
      })) 
    } 
  }, [updateSearchHistoryEl])

  return (
    <div className="search" onClick={handleFocus}>
      <div className="container">
        <div className="search__close-btn-container">
          <button 
            className="material-icons search__close-btn"
            onClick={toggleSearchDisplay}
          >close</button>
        </div>
        <form className="search__form" onSubmit={handleSubmit}>
          <div
            className="search__location"
            style={formFocus}
            onClick={handleFocus}
            ref={formRef}
          >
            <span className="material-icons search__icon">search</span>
            <input
              type="text"
              name="search-location"
              className="search__location-input"
              placeholder="search location"
              value={searchLocation}
              onChange={handleChange}
              onFocus={handleFocus}
              ref={inputRef}
            ></input>
          </div>
          <button className="search__btn">Search</button>
        </form>

        <div className="search-history">
          {searchHistoryEl}
        </div>
      </div>
    </div >
  )
}

