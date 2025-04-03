import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("captainToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/payments/captain-payment-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPayments(response.data.captain_payments);
        setTotalEarnings(
          response.data.captain_payments.reduce((sum, p) => sum + p.amount_earned, 0)
        );
      } catch (error) {
        console.log("Error fetching payment history:", error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Captain Payment History</h2>

      {/* Total Earnings Summary */}
      <div className="bg-white text-black p-8 rounded-xl shadow-lg text-center mb-6 ">
        <h3 className="text-2xl font-semibold">Total Earnings</h3>
        <p className="text-4xl font-bold mt-2 drop-shadow-lg">INR.{totalEarnings.toFixed(2)}</p>
      </div>

      {/* Payments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <div key={payment.ride_id || index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold text-gray-900">Ride ID: {payment.ride_id}</h3>
              <p className="text-gray-500 mt-2">Pickup: {payment.pickup}</p>
              <p className="text-gray-500">Destination: {payment.destination}</p>
              <p className="text-green-600 font-bold mt-4">Earned: INR.{payment.amount_earned.toFixed(2)}</p>
              <p className="text-gray-400 text-sm mt-2">{new Date(payment.date).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No payments found</p>
        )}
      </div>
    </div>
  );
};

export default CaptainPaymentHistory;