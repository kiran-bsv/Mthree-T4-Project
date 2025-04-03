import React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride } = location.state || {};
  useEffect(() => {
    const timer = setTimeout(() => {
        // navigate("/ratings");
        navigate("/ratings", { state: { ride } });
    },2000);
    return () => clearTimeout(timer);
    }, [navigate]);
   
  

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-green-100">
      <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
      <p className="text-lg text-gray-700">Thank you for your payment.</p>
      {/* <button
        onClick={() => navigate("/")}
        className="mt-5 px-5 py-2 bg-blue-600 text-white rounded"
      >
        Go to Home
      </button> */}
    </div>
  );
};

export default SuccessPage;
