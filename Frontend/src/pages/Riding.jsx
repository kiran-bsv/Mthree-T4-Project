/**
 * File: Riding.jsx
 * Purpose: This file handles the active ride interface and real-time ride tracking.
 * 
 * Features:
 * - Shows active ride details
 * - Displays real-time ride tracking
 * - Provides ride status updates
 * - Shows driver information
 * - Implements ride progress tracking
 * - Handles ride completion
 * 
 * Usage:
 * - Displays current ride information
 * - Shows real-time ride progress
 * - Provides driver details
 * - Updates ride status
 * - Handles ride completion flow
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    // Get ride data from location state
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    // Handle ride completion and navigation
    useEffect(() => {
        if (!socket) return;
        // Listen for ride-ended event
        socket.on("ride-ended", (data) => {
            navigate('/payments', { state: { ride } })
        });
    
        // Cleanup socket listener
        return () => socket.off("ride-ended"); 
    }, []);

    return (
        <div className='h-screen'>
            {/* Home navigation button */}
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>

            {/* Ride tracking section */}
            <div className='h-1/2 '>
                {/* Live tracking component placeholder */}
                <img className='h-full ml-[450px]' src="https://media1.tenor.com/m/whxn4EAvy8kAAAAC/aisyamoda.gif" alt="" />
            </div>

            {/* Ride details section */}
            <div className='h-1/2 p-4'>
                {/* Driver information */}
                <div className='flex items-center justify-between'>
                    <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle_plate}</h4>
                        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                    </div>
                </div>

                {/* Ride details */}
                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        {/* Pickup location */}
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>

                        {/* Fare information */}
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Payment button */}
                <button 
                    className='w-full mt-5 bg-green-600 hover:bg-green-800 text-white font-semibold p-2 rounded-lg'
                    onClick={() => navigate('/payments', { state: { ride } })}
                >
                    Make a Payment
                </button>
            </div>
        </div>
    )
}

export default Riding
