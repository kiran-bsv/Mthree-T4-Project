import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const captainRideHistory = () => {
  const [captainRideHistory, setcaptainRideHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchcaptainRideHistory = async () => {
      try {
        const token = localStorage.getItem("captainToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/captain-ride-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setcaptainRideHistory(response.data.captain_ride_history);
      } catch (error) {
        console.log("Error fetching ride history:", error);
      }
    };

    fetchcaptainRideHistory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Your Ride History
      </h2>

      {/* Ride History Table */}
      <div className="overflow-x-auto shadow-lg border-b border-gray-200 rounded-lg">
        <div className="max-h-[328px] overflow-y-auto">
          {" "}
          {/* Set the max height and enable scrolling */}
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-grey text-black text-sm">
                <th className="py-3 px-6 text-left">Pickup Location</th>
                <th className="py-3 px-6 text-left">Destination</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {captainRideHistory.length > 0 ? (
                captainRideHistory.map(
                  (
                    ride,index // Limit rows to 7
                  ) => (
                    <tr key={ride.id || index} className="border-b hover:bg-gray-100">
                      <td className="py-4 px-6">{ride.pickup}</td>
                      <td className="py-4 px-6">{ride.destination}</td>
                      <td className="py-4 px-6">{ride.status}</td>
                      <td className="py-4 px-6">
                        {new Date(ride.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No rides found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default captainRideHistory;
