/**
 * File: UserProtectWrapper.jsx
 * Purpose: This file implements a wrapper component for protecting routes that require authentication.
 * 
 * Features:
 * - Provides route protection
 * - Handles authentication checks
 * - Manages redirects for unauthenticated users
 * - Wraps protected components
 * - Implements authentication state management
 * - Provides loading states
 * 
 * Usage:
 * - Wraps components that require authentication
 * - Protects routes from unauthorized access
 * - Manages authentication flow
 * - Handles redirects based on auth state
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectWrapper = ({ children }) => {
  // State for authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("userToken");
        
        if (!token) {
          // No token found, redirect to login
          navigate("/login");
          return;
        }

        // Token exists, set authenticated
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show children if authenticated
  return isAuthenticated ? children : null;
};

export default UserProtectWrapper;