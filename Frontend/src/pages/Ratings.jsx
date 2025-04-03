import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

const Ratings = () => {
  const location = useLocation();
  // const { ride } = location.state || {};
  const [ride, setRide] = useState(location.state?.ride || JSON.parse(localStorage.getItem("rideData")));
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    socket.connect(); // Ensure the socket reconnects

    socket.emit("rideCompleted", ride);

    socket.on("updateRideStatus", (data) => {
      console.log("Ride Updated:", data);
      // Handle ride update logic here
    });

    return () => {
      socket.disconnect(); // Cleanup socket on unmount
    };
  }, [ride]);

  const submitRating = async () => {
    if (!ride) {
      console.error("Missing required ride data");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ratings/rate`,
        {
          captain_id: ride.captain.id,
          ride_id: ride.rideId,
          rating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Rating submitted:", response.data);
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (error) {
      console.error(
        "Error submitting rating:",
        error.response?.data || error.message
      );
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-3">Rate Your Ride</h2>

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

      <textarea
        className="w-3/4 p-2 border rounded-lg"
        rows="3"
        placeholder="Write a review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

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
