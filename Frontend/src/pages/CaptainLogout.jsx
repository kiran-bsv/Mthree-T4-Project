/**
 * CaptainLogout.jsx
 *
 * Description:
 * This component handles the logout functionality for a captain user.
 * When rendered, it automatically:
 *  - Retrieves the captain's token from localStorage
 *  - Sends a logout request to the backend API
 *  - On successful response, clears the token from localStorage
 *  - Redirects the user to the captain login page
 *
 * This component does not require any UI interaction;
 * it performs the logout operation as soon as it is mounted.
 */

import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    const token = localStorage.getItem('captainToken')
    const navigate = useNavigate()

      // 🔐 Call logout API when component mounts
    axios.get(`${import.meta.env.VITE_API_URL}/captains/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('captainToken')
            navigate('/captain-login')
        }
    })

    return (
        <div>CaptainLogout</div>
    )
}

export default CaptainLogout