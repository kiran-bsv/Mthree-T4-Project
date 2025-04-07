/**
 * CaptainProtectWrapper.jsx
 *
 * Description:
 * A higher-order wrapper component that protects captain-specific routes by:
 *  - Checking for a valid JWT token in localStorage
 *  - Fetching captain profile from backend to verify authentication
 *  - Redirecting to the captain login page if authentication fails
 *  - Setting global captain data in context if verified
 *
 * Displays a loading screen while verifying authentication status.
 * Children components are only rendered if the captain is authenticated.
 */

import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('captainToken')
    const navigate = useNavigate()
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)




    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
        }

        // Verify token by fetching profile
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data)
                console.log(response.data);
                
                setIsLoading(false)
            }
        })
            .catch(err => {

                // On error, clear token and redirect to login
                localStorage.removeItem('captainToken')
                navigate('/captain-login')
            })
    }, [ token ])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper