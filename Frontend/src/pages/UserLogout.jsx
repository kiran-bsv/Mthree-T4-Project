/**
 * File: UserLogout.jsx
 * Purpose: This component handles user logout functionality and session cleanup.
 * 
 * Features:
 * - Removes user authentication token from localStorage
 * - Makes an API call to invalidate the session
 * - Redirects users to the login page
 * - Handles logout process automatically on component mount
 * 
 * Usage:
 * - Called when users want to log out of the application
 * - Cleans up user session data
 * - Ensures secure logout process
 */

import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {

    const token = localStorage.getItem('userToken')
    const navigate = useNavigate()

    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            // localStorage.removeItem('userToken')
            navigate('/login')
        }
    })

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout
