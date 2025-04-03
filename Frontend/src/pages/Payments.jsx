import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51R8jsFCAERKUWFVyq2lEPigw9VijIzkCaBA7h9PQr98cWd6DV0SHoF0ytjGn983mZFJpJtgEpu4bKpJ35uziv8jD00ImdYkhtx");

const Payments = () => {
  const location = useLocation();
  const { ride } = location.state || {}; // Retrieve ride data
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();
  const handlePayment = async () => {
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
        // setTimeout(() => navigate("/ratings", { state: { ride } }), 1500);
      }, 1000);
    } catch (error) {
      setPaymentStatus("Payment Failed. Try Again.");
    }
    if (paymentMethod === "card") {
      // setPaymentStatus("Only card payments are supported via Stripe.");
      // return;
    // }

    setLoading(true);
    setPaymentStatus("Processing...");

    try {
      // ✅ Retrieve JWT token from local storage
      // const token = localStorage.getItem("token");
      // const token = localStorage.getItem("captainToken") || localStorage.getItem("userToken");
      // const token = localStorage.getItem("captainToken") || localStorage.getItem("userToken") || localStorage.getItem("token");
      const token =
  localStorage.getItem("captainToken") ||
  localStorage.getItem("userToken") ||
  localStorage.getItem("token");

console.log("Retrieved JWT Token:", token);

if (!token) {
  setPaymentStatus("Authentication failed. Please log in.");
  alert("No JWT token found. Please log in again.");
  return;
}
localStorage.setItem("rideData", JSON.stringify(ride));

      console.log("JWT Token: ", token); 
      // if (!token) {
      //   setPaymentStatus("Authentication failed. Please log in.");
      //   throw new Error("No JWT token found");
      // }

      // ✅ Send authenticated request to backend
      
      const response = await axios.post(
        "http://127.0.0.1:5000/payment/create-checkout-session",
        { ride_id: ride?.rideId || "test", amount: ride?.fare || 100 },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // 🔐 Include JWT token
          },
          withCredentials: true,
        }
      );

      console.log("Response from server:", response);
      const session = response.data;
    //   if (session.id) {
    //     const stripe = await stripePromise;
    //     await stripe.redirectToCheckout({ sessionId: session.id });
    //   } else {
    //     throw new Error("Payment session creation failed.");
    //   }
    // } 
    if (session.id) {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (!error) {
        // ✅ Navigate to success page after Stripe checkout
        navigate("/success", { state: { ride } });
        localStorage.setItem("rideData", JSON.stringify(ride));

        setTimeout(() => {
          // navigate("/ratings");
          navigate("/ratings", { state: { ride } });
        }, 2000);
      }
    } else {
      throw new Error("Payment session creation failed.");
    }
  } 
catch (error) {
      console.error("Payment Error:", error);
      setPaymentStatus(`Error: ${error.response?.data?.error || error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
// setPaymentStatus("Processing...")
// setTimeout(() => {
//   setPaymentStatus("Payemnt Recieved");
  
//   console.log("Payment recived");
//   navigate("/success", {state: { ride }});
//   setTimeout(() => {
//     // navigate("/ratings");
//     navigate("/ratings", { state: { ride } });
//   }, 2000);
// }, 5000);
  } else if (paymentMethod === "cash"){
    setPaymentStatus("Processing...")
    setTimeout(() => {
      setPaymentStatus("Payemnt Recieved");
      
      console.log("Payment recived");
      navigate("/success", {state: { ride }});
      setTimeout(() => {
        // navigate("/ratings");
        navigate("/ratings", { state: { ride } });
      }, 2000);
    }, 5000);
  } else if (paymentMethod === "upi") {
    setPaymentStatus("Processing UPI payment");
    setTimeout(() => {
      setPaymentStatus("Payemnt Recieved");
      console.log("Payment recived");
      // navigate("/success");
      navigate("/success", {state: { ride }});
      setTimeout(() => {
        // navigate("/ratings");
        navigate("/ratings", { state: { ride } });
      }, 2000);
    }, 5000);
  } else {
    setPaymentStatus("Invalid payment method");
  }
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

      {paymentStatus && <p className="mt-3 text-red-600 font-medium">{paymentStatus}</p>}
    </div>
  );
};

export default Payments;
