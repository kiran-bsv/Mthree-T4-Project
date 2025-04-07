/**
 * FinishRide Component
 * 
 * This component renders a confirmation panel to end an ongoing ride. 
 * It shows ride details such as passenger name, pickup and drop locations, fare, and payment status.
 * 
 * Core Functionality:
 * - Allows the captain to finish a ride by sending a POST request to the backend API.
 * - On successful ride completion, it navigates the captain back to the home screen.
 * - Provides UI feedback and lets the captain manually close the panel without ending the ride.
 **/
import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const FinishRide = (props) => {

    const navigate = useNavigate()
    // Function to end the ride and update captain status
    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride.ride_id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('captainToken')}`
            }
        })
        localStorage.setItem('captainStatus', 'open')
        if (response.status === 200) {
            navigate('/captain-home')
        }

    }

    return (
         // Root container for the Finish Ride popup
        <div>
             {/* Header with close icon */}
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-400  hover:text-gray-600 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>

             {/* Ride summary card with user info and payment status */}
            <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>Payment Received</h5>
            </div>
              {/* Container for ride details and finish button */}
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.pickup} Depot</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{props.ride?.pickup} depot</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                
                  {/* Finish Ride button */}
                <div className='mt-10 w-full'>
                    <button
                        onClick={endRide}
                        className='w-full mt-5 flex  text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-800'>Finish Ride</button>
                        
                </div>
            </div>
        </div>
    )
}

export default FinishRide