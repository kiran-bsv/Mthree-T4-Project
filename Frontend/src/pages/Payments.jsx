import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payments = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus("Processing...");

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payments/pay`,
        { ride_id: ride.rideId, amount: ride.fare, payment_mode: paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTimeout(() => {
        setLoading(false);
        setPaymentStatus("Payment Successful!");
        setTimeout(() => navigate("/ratings", { state: { ride } }), 1500);
      }, 1000);
    } catch (error) {
      setPaymentStatus("Payment Failed. Try Again.");
    }

    // setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 p-5">
      <h2 className="text-2xl font-bold mb-2">Confirm Payment</h2>
      <p className="text-lg text-gray-600">
        Amount: <span className="font-semibold">₹{ride?.fare || "0"}</span>
      </p>

      <div className="w-full max-w-md bg-white p-5 rounded-lg shadow-lg mt-5">
        <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
        {["cash", "card", "upi"].map((method) => (
          <button
            key={method}
            className={`flex items-center gap-3 w-full p-3 rounded-lg border ${
              method === paymentMethod
                ? "border-green-500 bg-green-100"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod(method)}
          >
            {method.charAt(0).toUpperCase() + method.slice(1)}
          </button>
        ))}
      </div>

      <button
        className="mt-5 w-full max-w-md bg-black text-white font-semibold p-3 rounded-lg"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {paymentStatus && (
        <p className="mt-3 text-green-600 font-medium">{paymentStatus}</p>
      )}
    </div>
  );
};

export default Payments;
