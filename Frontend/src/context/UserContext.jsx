// Import necessary dependencies
import React, { createContext, useState } from 'react'

// Create a new context for managing user-related data
export const UserDataContext = createContext()

// UserContext component that provides user-related state and functions to its children
const UserContext = ({ children }) => {
    // Initialize user state with default values for email and full name
    const [ user, setUser ] = useState({
        email: '',
        fullName: {
            firstName: '',
            lastName: ''
        }
    })

    // Provide user state and setter function to all child components through context
    return (
        <div>
            <UserDataContext.Provider value={{ user, setUser }}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext