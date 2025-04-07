/**
 * File: UserLogout.jsx
 * Purpose: This file handles user logout functionality and session termination.
 * 
 * Features:
 * - Implements user logout process
 * - Clears authentication state
 * - Removes user session data
 * - Handles navigation after logout
 * - Provides logout confirmation
 * - Manages cleanup of user data
 * 
 * Usage:
 * - Terminates user sessions
 * - Clears user authentication
 * - Redirects users to login page
 * - Ensures secure logout process
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();

  // Handle logout process
  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    // Navigate to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Logout message container */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        {/* Logout icon */}
        <div className="mb-4">
          <i className="text-4xl text-gray-600 ri-logout-box-line"></i>
        </div>

        {/* Logout message */}
        <h2 className="text-2xl font-bold mb-4">Logging out...</h2>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
};

export default UserLogout;
