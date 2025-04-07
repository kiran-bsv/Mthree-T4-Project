/**
 * File: SuccessPage.jsx
 * Purpose: This file displays a success message after a successful ride booking or payment.
 * 
 * Features:
 * - Confirmation of successful transactions
 * - Navigation options after success
 * - Display of relevant success details
 * - Implementation of responsive design
 * - Handling of different success scenarios
 * 
 * Usage:
 * - Displayed after successful ride bookings
 * - Shown after successful payments
 * - Provides user feedback on completed actions
 * - Guides users to next steps
 */

import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="h-screen bg-black">
      {/* Main content container */}
      <div className="h-full flex flex-col items-center justify-center">
        {/* Success icon */}
        <div className="mb-8">
          <i className="text-6xl text-green-500 ri-checkbox-circle-fill"></i>
        </div>

        {/* Success message */}
        <h1 className="text-4xl font-bold text-white mb-6">Success!</h1>
        <p className="text-xl text-gray-300 mb-8 text-center">
          Your ride has been successfully booked.
        </p>

        {/* Navigation buttons container */}
        <div className="flex flex-col space-y-4 w-64">
          {/* Home button */}
          <Link
            to="/home"
            className="bg-white text-black font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-100"
          >
            Go to Home
          </Link>

          {/* Ride history button */}
          <Link
            to="/ride-history"
            className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-700"
          >
            View Ride History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
