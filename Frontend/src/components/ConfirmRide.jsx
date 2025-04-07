/*
  ConfirmRide Component

  - Displays a ride summary for the user to confirm before proceeding.
  - Shows:
    • Pickup and destination locations
    • Estimated distance and duration based on selected vehicle type
    • Fare calculation for the selected vehicle
    • A visual representation (vehicle image)
  - Allows the user to confirm the ride by clicking a button.
    • On confirmation: 
      ▸ Sets vehicle as found
      ▸ Hides the confirmation panel
      ▸ Triggers the ride creation function
  - Includes a close icon to dismiss the panel without confirming.
  - Utilizes props to dynamically render location, pricing, and time details.
*/

import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div>
            {/* Close button to hide the Confirm Ride panel */}
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-400 hover:text-black ri-arrow-down-wide-line"></i></h5>
             {/* Title */}
            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                 {/* Vehicle image */}
                <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        {/* Pickup Location */}
                        <div>
                            <h3 className='text-base font-medium'>{props.pickup}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                          {/* Destination Location */}
                        <div>
                            <h3 className='text-base font-medium'>{props.destination}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                      {/* Distance and Duration Info */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-time-line"></i>
                        <div>
                           
                            <h3 className='text-base font-medium'>
                                {props.distance}kms&nbsp;&nbsp;
                                {(() => {
                                    const totalMinutes = Math.round((props.duration?.[props.vehicleType] || 0) * 60);
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    if (hours === 0) return `${minutes}min`;
                                    return `${hours}hr ${minutes}min`;
                                })()}
                                </h3>
                            <p className='text-base -mt-1 text-base-600'>Distance,&nbsp; Duration  </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                           
                            <h3 className='text-base font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()

                }} className='w-full pt-[-150px] h-10 bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded-lg'>Confirm</button>
            </div>
        </div>
    )
}

export default ConfirmRide