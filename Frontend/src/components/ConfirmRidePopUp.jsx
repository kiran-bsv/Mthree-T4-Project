/*
  ConfirmRidePopUp Component

  - Displays a ride confirmation popup for the captain to start the ride.
  - Shows ride and passenger information including pickup, destination, fare, and user name.
  - Allows OTP input for ride verification and submission.
  - Automatically closes the popup after 2 seconds of rendering.
  - On OTP submission:
    • Checks ride status (already accepted/ongoing) to avoid conflicts.
    • If available, sends a request to start the ride using the provided OTP.
    • Navigates the captain to the riding screen on success.
    • Redirects to the captain home screen and alerts if the ride is already taken.
  - Provides options to confirm or cancel the ride manually.
  - Uses React state, routing, and axios for API integration.
*/

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    // State to store the entered OTP
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()

     // Automatically close the ride popup after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            props.setRidePopupPanel(false);
        }, 2000);
        console.log('close popup');
        // Clear the timeout if the component unmounts or re-renders
        return () => clearTimeout(timer);   
    }, []);

     // Handler to confirm ride after OTP submission
    const submitHander = async (e) => {
        e.preventDefault()
         // If ride is already accepted or ongoing, show alert and redirect
        if (props.ride.status == "ongoing" || props.ride.status == "accepted") {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            alert("Ride has been accepted by someone else")
            setTimeout(() => {
                navigate('/captain-home');
            }, 7000); 
        }


        try {const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
          params: {
                rideId: props.ride.ride_id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('captainToken')}`
            }
        })
          // If response indicates ride was already taken
        if (response.data.status == "ongoing" || response.data.status == "accepted") {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            alert("Ride has been accepted by someone else")
            setTimeout(() => {
                navigate('/captain-home');
            }, 7000); 
        }
          // On success, close popups and navigate to riding screen
        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }} catch (error){
            if (error.response && error.response.status === 400) {
                alert("Invalid OTP. Please try again.");
            } else {
                alert("An error occurred. Please try again later.");
            }
        }


    }
    return (
        <div className='mt-11'>
             {/* Arrow icon to manually close ride popup */}
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>

             {/* Passenger info card */}
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>


             {/* Ride details */}
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-semi-bold font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-semi-bold font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-semi-bold font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                  {/* OTP form */}
                <div className='mt-6 w-full '>
                    <form onSubmit={submitHander}>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-0' placeholder='Enter OTP' />

                         {/* Confirm and Cancel buttons */}
                        <div className='flex place-content-between gap-5 '>
                        <button className='w-2/5 mt-5 text-lg flex justify-center bg-green-600 hover:bg-green-800 text-white font-semibold p-3 rounded-lg'>Confirm</button>
                        <button onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                            localStorage.setItem('captainStatus', 'open')

                        }} className='w-2/5 mt-5 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg hover:bg-red-800'>Cancel</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp