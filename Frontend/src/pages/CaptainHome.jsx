/*
 * CaptainHome.jsx
 * 
 * This component serves as the main dashboard for the Captain (driver) in the Uber-like monitoring app.
 * It enables real-time interaction with the backend via WebSockets and displays ride request details.
 * 
 * Core functionalities:
 * - Joins a WebSocket room upon login using the captain's ID
 * - Sends periodic location updates to the server (if location permissions are granted)
 * - Listens for new ride requests and ride confirmation events via WebSocket
 * - Shows ride popups when a new ride is available, allowing the captain to accept it
 * - Shows confirmation popup after ride is accepted
 * - Uses GSAP animations to smoothly slide in/out ride panels
 * - Provides quick navigation to ride history and payment history
 * - Displays captain details and a background image
 */ 


import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainHome = () => {
  // State for managing the ride popup and confirmation popup visibility
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  // References for GSAP animation panels
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  // Ride state
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!captain || !captain.id) {
      return;
    }

    socket.emit("join", {
      userId: captain.id,
      userType: "captain",
    });

    // Send captain's current location
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain.id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    // Handle incoming ride request
    const handleNewRide = (data) => {
      console.log("Ride Data set:", data);
      if (localStorage.getItem("captainStatus") !== "open") return;
      localStorage.setItem("captainStatus", data.user.id);
      setRide(data);
      setRidePopupPanel(true);
      setConfirmRidePopupPanel(false);
      console.log("Ride popup set to true");
    };

    const handleRideConfirmed = (ride) => {
      console.log("Ride confirmed:", ride);
      if (
        ride.captain.id !== captain.id &&
        localStorage.getItem("captainStatus") == ride.userId
      ) {
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(false);
        localStorage.setItem("captainStatus", "open");
        return;
      }
      if (ride.captain.id == captain.id)
        localStorage.setItem("captainStatus", "closed");
    };

    socket.on("new-ride", handleNewRide); 
    socket.on("ride-confirmed", handleRideConfirmed);
    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("new-ride", handleNewRide); // Cleanup interval on unmount
    };
  }, [captain]);

  async function confirmRide() {

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
    console.log("🚀 ride:", ride);
    console.log("🚀 captain:", captain);

    if (!ride?.ride_id || !captain?.id) {
      console.error("❌ Missing rideId or captainId");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride.ride_id,
          captainId: captain.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen">
        <nav className="bg-white text-black flex justify-between items-center p-4 z-50 relative ">
          <img
            className="w-16"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber Logo"
          />
          <div className="flex items-center gap-8 ">
            <button
              className="bg-black text-white px-4 py-2 mx-2 mr-[-17px] rounded-lg hover:bg-gray-400"
              onClick={() => navigate("/captain-ride-history")}
            >
              Ride History
            </button>
            <button
              className="bg-black text-white px-4 py-2 mx-2 mr-[-12px] rounded-lg hover:bg-gray-400"
              onClick={() => navigate("/captain-payment-history")}
            >
              Payment History
            </button>
            <div className="flex">
            <img className='h-10 w-10 rounded-full object-cover mr-2' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
            <span className="text-lg mr-7 pt-1">{captain.fullname.firstname}</span>
            </div>
          </div>
        </nav>
      <div className="h-2/4 justify-center display: flex" >
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
          style={{height:350, width:1300,mb:10}}
        />
      </div>
      <div className="h-2/5 p-6 pt-10">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      {console.log("ride:", ride)}
      {
        <div
          ref={confirmRidePopupPanelRef}
          className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
        >
          <ConfirmRidePopUp
            ride={ride}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            setRidePopupPanel={setRidePopupPanel}
          />
        </div>
      }
    </div>
  );
};

export default CaptainHome;
