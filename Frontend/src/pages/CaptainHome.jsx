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
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //     if (!captain || !captain.id) {
  //         return;
  //     }

  //     socket.emit("join", {
  //         userId: captain.id,
  //         userType: "captain"
  //     });

  //     const updateLocation = () => {
  //         if (navigator.geolocation) {
  //             navigator.geolocation.getCurrentPosition(position => {

  //                 socket.emit('update-location-captain', {
  //                     userId: captain.id,
  //                     location: {
  //                         ltd: position.coords.latitude,
  //                         lng: position.coords.longitude
  //                     }
  //                 });
  //             });
  //         }
  //     };

  //     const locationInterval = setInterval(updateLocation, 10000);
  //     updateLocation();

  //     return () => clearInterval(locationInterval);  // Cleanup interval on unmount
  // }, [captain]);

  // socket.on('new-ride', (data) => {
  //     console.log("Ride Data set:", data);
  //     setRide(data)
  //     setRidePopupPanel(true);
  //     console.log("Ride popup set to true");
  //     // setRidePopupPanel(true)

  // })

  useEffect(() => {
    if (!captain || !captain.id) {
      return;
    }

    socket.emit("join", {
      userId: captain.id,
      userType: "captain",
    });

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

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    const handleNewRide = (data) => {
      console.log("Ride Data set:", data);
      // if(ride.status === "confirmed" || ride.status) {
      if (localStorage.getItem("captainStatus") !== "open") return;
      localStorage.setItem("captainStatus", data.user.id);
      setRide(data);
      setRidePopupPanel(true);
      setConfirmRidePopupPanel(false);
      // const timer = setTimeout(() => {
      //     setRidePopupPanel((prev) => {
      //         if (prev && !confirmRidePopupPanel) {
      //             console.log('close popup from captain home -1');
      //             return false;
      //         }
      //         return prev;
      //     });
      //     console.log('close popup from captain home -2');
      // }, 6000);

      // return () => clearTimeout(timer);
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
    // return () => {
    //     clearInterval(locationInterval);  // Cleanup interval
    //     socket.off('new-ride', handleNewRide);  // Cleanup socket event
    // };
  }, [captain]);

  async function confirmRide() {
    // const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

    //     rideId: ride.id,
    //     captainId: captain.id,

    // }, {
    //     headers: {
    //         Authorization: `Bearer ${localStorage.getItem('captainToken')}`
    //     }
    // })

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
      console.log("ride.Id in captainHome.jsx 152:", ride.id);
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
      {/* <div className="fixed p-6 top-0 flex items-center justify-between w-screen"> */}
        {/* <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" /> */}
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
        {/* <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link> */}
      {/* </div> */}
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
