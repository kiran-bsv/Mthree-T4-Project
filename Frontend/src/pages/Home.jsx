import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import locations from "../locations";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [duration, setDuration] = useState({});
  const [distance, setDistance] = useState(null);
  const [vehicleType, setvehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  // const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  // console.log("user:",user);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    socket.emit("join", { userType: "user", userId: user.id });
  }, [user]);

  useEffect(() => {
    const handleRideConfirmed = (ride) => {
      console.log("user : line 56", user);
      console.log("Ride confirmed: line 57", ride);
      if(ride.userId != user.id) { return; }
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    };

    const handleRideStarted = (ride) => {
      console.log("Ride started: line 63", ride);
      console.log("user 67:", user)
      if(ride.userId != user.id) { return; }
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
    };

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket]);

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      // const response = await axios.get(
      //   `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
      //   {
      //     params: { input: e.target.value },
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      //     },
      //   }
      // );
      // setPickupSuggestions(response.data.suggestions);
      const query = e.target.value.toLowerCase();
      setPickup(query);

      if (query.length === 0) {
        // setSuggestions([]);
        return;
      }

      const filteredSuggestions = locations.filter((location) =>
        location.toLowerCase().startsWith(query)
      );
      // .slice(0, 5); // Limit suggestions

      setPickupSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      // const response = await axios.get(
      //   `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
      //   {
      //     params: { input: e.target.value },
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      //     },
      //   }
      // );
      // setDestinationSuggestions(response.data.suggestions);
      const query = e.target.value.toLowerCase();
      setDestination(query);

      if (query.length === 0) {
        // setSuggestions([]);
        return;
      }

      const filteredSuggestions = locations.filter((location) =>
        location.toLowerCase().startsWith(query)
      );
      // .slice(0, 5); // Limit suggestions

      setDestinationSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    setVehiclePanel(true);  // shows the pickup vehicle options
    setPanelOpen(false);   // pickup & dest panel

    // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
    //     params: { pickup, destination },
    //     headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`
    //     }
    // })

    // setFare(response.data)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Fare fetched successfully:", response.data);
      // setFare(response.data.fare?.[0]);
      setFare(response.data.fare);
      // console.log(response.data.fare.fare?.[1]);
      // setDuration(response.data.fare?.[1]);
      setDuration(response.data.duration);
      setDistance(response.data.distance);
    } catch (error) {
      console.error("Error fetching fare:", error);
      alert("Error fetching fare. Please try again.");
    }
  }

  async function createRide() {
    // const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
    //     pickup,
    //     destination,
    //     vehicleType
    // }, {
    //     headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`
    //     }
    // })
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Ride created successfully:", response.data);
    } catch (error) {
      console.error("Error creating ride:", error);
      alert("Error creating ride. Please try again.");
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        {/* <LiveTracking /> */}
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">


        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            {/* location & dest. input boxex */}
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>




        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      {/* choose pickup vehicle options */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicle={setvehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          duration={duration}
          distance={distance}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          duration={duration}
          distance={distance}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
