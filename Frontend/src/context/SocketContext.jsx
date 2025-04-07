import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create a new context for managing socket connections
export const SocketContext = createContext();

// Initialize socket connection with the server using environment variable for base URL
// Configured to use WebSocket transport only
const socket = io(`${import.meta.env.VITE_BASE_URL}`, { transports: ["websocket"] });

// SocketProvider component that manages socket connection and provides it to child components
const SocketProvider = ({ children }) => {
    // Set up socket connection event listeners when component mounts
    useEffect(() => {
        // Handle successful connection to server
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Handle disconnection from server
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

    }, []);

    // Commented out generic event handler that could be used to log all socket events
    // useEffect(() => {
    //     const handleEvent = (event, data) => {
    //         console.log(`Event received: ${event}`, data);
    //     };

    //     socket.onAny(handleEvent);

    //     return () => {
    //         socket.offAny(handleEvent); // Cleanup on unmount
    //     };
    // }, []);

    // Provide socket instance to all child components through context
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
