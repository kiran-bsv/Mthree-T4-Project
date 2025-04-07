/**
 * File: Ratings.jsx
 * Purpose: This file handles the rating and feedback system for completed rides.
 * 
 * Features:
 * - Implements star rating system
 * - Collects user feedback
 * - Handles rating submission
 * - Displays rating interface
 * - Manages rating state
 * - Provides feedback options
 * 
 * Usage:
 * - Allows users to rate their ride experience
 * - Collects feedback on ride quality
 * - Submits ratings to the backend
 * - Provides rating interface after ride completion
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

// Initialize socket connection for real-time updates
const socket = io("http://127.0.0.1:5000");

const Ratings = () => {
  // Get ride data from location state or localStorage
  const location = useLocation();
  const [ride, setRide] = useState(location.state?.ride || JSON.parse(localStorage.getItem("rideData")));
  const navigate = useNavigate();

  // State for managing ratings and feedback
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [categoryRatings, setCategoryRatings] = useState({
    cleanliness: 0,
    punctuality: 0,
    driver_behavior: 0,
  });

  // Effect to check and add required rating categories
  useEffect(() => {
    const checkAndAddCategories = async () => {
      try {
        // Fetch existing categories from backend
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/ratings/categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        // Process existing categories
        const existingCategories = response.data.categories.map((c) =>
          c.name.toLowerCase()
        );

        // Define required categories and find missing ones
        const requiredCategories = ["cleanliness", "punctuality", "driver_behavior"];
        const missingCategories = requiredCategories.filter(
          (cat) => !existingCategories.includes(cat)
        );

        // Add any missing categories to the backend
        if (missingCategories.length > 0) {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/ratings/categories/add`,
            {
              categories: missingCategories.map((name) => ({ name })),
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Missing categories added:", missingCategories);
        }
      } catch (error) {
        console.error("Error checking/adding categories:", error.response?.data || error.message);
      }
    };

    checkAndAddCategories();
  }, []);

  // Handle category-specific ratings
  const handleCategoryRating = (category, score) => {
    setCategoryRatings((prev) => ({ ...prev, [category]: score }));
  };

  // Submit the complete rating to the backend
  const submitRating = async () => {
    if (!ride) {
      console.error("Missing required ride data");
      return;
    }

    try {
      // Send rating data to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ratings/rate`,
        {
          captain_id: ride.captain.id,
          ride_id: ride.rideId,
          rating,
          review,
          category_ratings: [
            { category: "Cleanliness", score: categoryRatings.cleanliness },
            { category: "Punctuality", score: categoryRatings.punctuality },
            { category: "Driver Behavior", score: categoryRatings.driver_behavior },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Rating submitted:", response.data);
      // Navigate to home page after successful submission
      setTimeout(() => navigate("/home"), 800);
    } catch (error) {
      console.error("Error submitting rating:", error.response?.data || error.message);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-3">Rate Your Ride</h2>

      {/* Star rating interface */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`text-3xl mx-1 cursor-pointer ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
          >
            ★
          </i>
        ))}
      </div>

      {/* Review text area */}
      <textarea
        className="w-3/4 p-2 border rounded-lg"
        rows="3"
        placeholder="Write a review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      {/* Category-specific ratings */}
      <div className="mt-4 w-3/4">
        <h3 className="text-lg font-semibold">Rate Specific Aspects:</h3>
        {["cleanliness", "punctuality", "driver_behavior"].map((category) => (
          <div key={category} className="flex items-center mt-2">
            <span className="mr-2 capitalize">{category.replace("_", " ")}</span>
            {[1, 2, 3, 4, 5].map((score) => (
              <i
                key={score}
                className={`text-xl mx-1 cursor-pointer ${
                  score <= categoryRatings[category] ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleCategoryRating(category, score)}
              >
                ★
              </i>
            ))}
          </div>
        ))}
      </div>

      {/* Submit button */}
      <button
        className="mt-3 bg-green-600 text-white p-2 rounded-lg"
        onClick={submitRating}
      >
        Submit
      </button>
    </div>
  );
};

export default Ratings;
