import { createContext, useState, useContext } from 'react';

// Create a new context for managing captain-related data
export const CaptainDataContext = createContext();

// CaptainContext component that provides captain-related state and functions to its children
const CaptainContext = ({ children }) => {
    // State for storing the current captain's data
    const [ captain, setCaptain ] = useState(null);
    // State to track loading status during captain data operations
    const [ isLoading, setIsLoading ] = useState(false);
    // State for handling and storing any errors that occur
    const [ error, setError ] = useState(null);

    // Function to update the captain's data
    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    // Object containing all state values and functions to be provided through context
    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    // Provide the context value to all child components
    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;