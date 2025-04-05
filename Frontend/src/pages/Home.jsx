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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      // console.log("Ride confirmed: line 57", ride);
      if (ride.userId != user.id) {
        return;
      }
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    };

    const handleRideStarted = (ride) => {
      console.log("Ride started: line 63", ride);
      console.log("user 67:", user);
      if (ride.userId != user.id) {
        return;
      }
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

  const handleClick = () => {
    console.log("Ride history clicked");
    // navigate("/ride-history");
  };

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
    // console.log(pickup,destination)
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
    if (!locations.includes(pickup)) {
      alert(
        "LOL there! Our magic carpet doesn't fly to that pickup spot. Try another one from the list! or check the empty field"
      );
      return;
    }
    if (!locations.includes(destination)) {
      alert(
        "Yikes! Our GPS can't find that destination. Maybe it's on Mars? Try a different one!  or check the empty field"
      );
      return;
    }
    setVehiclePanel(true); // shows the pickup vehicle options
    setPanelOpen(false); // pickup & dest panel

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

  function AutoPlayMethods() {
    let sliderRef = useRef(null);
  
  
    const settings = {
     
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      // autoplaySpeed: 2000,
      // variableWidth: true
    };
  
    return (
      <div>      
      <div className="slider-container h-96 mt-[-40px] overflow-hidden">       
        <Slider ref={sliderRef} {...settings}>
          <div className="" >
            <img className="slide h-full object-cover  w-3/4"
              src="https://www.papayaqatar.com/wp-content/uploads/2023/12/uber-clone-banner.webp"
              alt="Slide 1"
            />
          </div>
          <div>
            <img className="slide h-96  w-3/4"
              src="https://dianapps.com/blog/wp-content/uploads/2022/12/1080600.png"
              alt="Slide 2"
            />
          </div>
          <div>
            <img className="slide h-96  w-3/4 "
              src="https://www.shutterstock.com/image-vector/online-taxi-concept-people-call-260nw-1839852040.jpg"
              alt="Slide 3"
            />
          </div>
         
        </Slider>        
      </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden ">
      {/* <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      /> */}
      <nav className="text-black flex justify-between items-center p-4 z-50 relative bg-black border-gray-200 dark:bg-black-900 ">
        {/* <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        /> */}
        <img src="data:image/png;base64,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" class="h-8" alt="Flowbite Logo" />
            <span class="ml-[-28cm] text-2xl font-semibold whitespace-nowrap text-white">Uber</span>
        <div className="flex items-center gap-8 mr-3">
          <button
            className="bg-black text-white px-4 py-2 mx-2 rounded-lg hover:bg-gray-400"
            onClick={() => navigate("/ride-history")}
          >
            Ride History
          </button>
          <div className='hover:bg-gray-400 pl-4 pr-3 rounded-lg'>
          <span className="text-lg text-white ml-[-0.3cm] hover:bg-gray-400">{user.fullname.firstname}</span>
        
          </div>
          </div>
      </nav>
      <div className="   mt-10 ml-[250px] mr-4 ">
        <AutoPlayMethods></AutoPlayMethods> 
      </div>

      <div className="h-screen w-screen">
        {/* image for temporary use  */}
        {/* <LiveTracking /> */}
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div
          className={`h-[30%] p-6 bg-white relative transition-all duration-300 ${
            panelOpen ? "top-[65px]" : "top-0"
          }`}
        >
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            {/* <i className="ri-arrow-down-wide-line"></i> */}
            <i class="ri-arrow-down-s-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold ">Find a trip</h4>

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
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-gray-500 p-2 cursor-pointer"
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
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
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
