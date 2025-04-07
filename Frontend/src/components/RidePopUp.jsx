/*
  RidePopUp Component

  - Displays a pop-up notification for drivers when a new ride is available.
  - Shows:
    • Rider's profile photo and name
    • Pickup and destination locations
    • Estimated distance and duration
    • Fare amount
  - Provides two action buttons:
    • "Accept" to confirm the ride:
      ▸ Triggers confirmation popup
      ▸ Calls confirmRide() (user-side ride confirmation)
    • "Ignore" to decline:
      ▸ Closes both ride and confirm panels
      ▸ Sets 'captainStatus' to 'open' in localStorage
  - Includes a close icon to dismiss the popup manually.
  - Props:
    • ride: Ride details (user, pickup, destination, fare, etc.)
    • setRidePopupPanel: Controls ride popup visibility
    • setConfirmRidePopupPanel: Controls confirmation popup visibility
    • confirmRide: Function to confirm the ride
*/
import React, { useState, useEffect } from 'react';

const RidePopUp = (props) => {
    console.log("RidePopUp props: ", props)
    const [isPopupVisible, setIsPopupVisible] = useState(true);

    

    return (
        <div className='h-[520px]'>
            {/* Close button for Ride PopUp */}
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-400 ri-arrow-down-wide-line hover:text-gray-600"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>

            {/* Rider details and distance */}
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{(Math.random() * 2 + 1).toFixed(2)} KM</h5>
            </div>

              {/* Ride info container */}
            <div className='flex gap-2 justify-between flex-col items-center'>
                  {/* All ride details (pickup, destination, time, fare) */}
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                        <h3 className='font-semibold font-medium'>{props.ride?.pickup}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                        <h3 className='font-semibold font-medium'>{props.ride?.destination}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                        <h3 className='font-semibold font-medium'>
                                {props.ride?.distance}kms&nbsp;&nbsp;
                                {(() => {
                                    const totalMinutes = Math.round((props.ride?.duration || 0) * 60);
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    if (hours === 0) return `${minutes}min`;
                                    return `${hours}hr ${minutes}min`;
                                })()}
                                </h3>
                <p className='text-sm -mt-1 text-gray-600'>Distance, &nbsp;Duration</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='font-semibold font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                {( 
                    
                    <div className='mt-5 w-full flex place-content-around gap-1 '>
                         {/* Accept and Ignore buttons */}
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide() // user end

                    }} className='mt-2 bg-green-600 hover:bg-green-700 w-[450px] text-white font-semibold p-2 px-10 rounded-lg pl-10 h-[50px]'>Accept</button>

                    <button onClick={() => {
                        props.setRidePopupPanel(false)
                        props.setConfirmRidePopupPanel(false)
                        localStorage.setItem('captainStatus', 'open')

                    }} className='mt-2 p-2 w-[450px] bg-red-500 hover:bg-red-700 text-white font-semibold p-2 px-10 rounded-lg h-[50px]'>Ignore</button>


                
                </div>  )}
            </div>
        </div>
    )
}

export default RidePopUp