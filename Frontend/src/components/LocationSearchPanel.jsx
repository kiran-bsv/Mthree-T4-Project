/*
  LocationSearchPanel Component

  - Displays a list of location suggestions to the user during ride booking.
  - When a suggestion is clicked:
    • If the active field is "pickup", it sets the selected pickup location.
    • If the active field is "destination", it sets the selected destination.
  - Props received:
    • suggestions: array of suggested locations (strings).
    • setPickup & setDestination: functions to set the chosen locations.
    • activeField: indicates whether user is setting pickup or destination.
    • setVehiclePanel & setPanelOpen: likely for navigation but not used here.
  - Renders each suggestion in a styled clickable div.
*/

import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    // Handle the selection of a suggestion
    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        
    }

    return (
        <div>
            {/* Display fetched suggestions */}
            {
                suggestions.map((elem, idx) => (
                    <div key={idx} onClick={() => handleSuggestionClick(elem)} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start relative top-20'>
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium'>{elem}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel