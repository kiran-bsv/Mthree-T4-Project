import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`, { transports: ["websocket"] }); // Replace with your server URL

const SocketProvider = ({ children }) => {
    useEffect(() => {
        // Basic connection logic
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

    }, []);

    // useEffect(() => {
    //     const handleEvent = (event, data) => {
    //         console.log(`Event received: ${event}`, data);
    //     };

    //     socket.onAny(handleEvent);

    //     return () => {
    //         socket.offAny(handleEvent); // Cleanup on unmount
    //     };
    // }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
