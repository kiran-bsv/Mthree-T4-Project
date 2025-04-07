// Import React and necessary dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
// Import context providers
import UserContext from './context/UserContext.jsx';
import CaptainContext from './context/CapatainContext.jsx';
import SocketProvider from './context/SocketContext.jsx';

// Create root and render the application with all necessary providers
createRoot(document.getElementById('root')).render(
  // Wrap the application with context providers in the correct order
  <CaptainContext>
    <UserContext>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </UserContext>
  </CaptainContext>
)
