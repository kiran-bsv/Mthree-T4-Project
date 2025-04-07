- [🚘 Frontend - Cloud Monitoring Uber Project](#-frontend---cloud-monitoring-uber-project)
  - [🎯 Purpose](#-purpose)
  - [🧰 Tech Stack](#-tech-stack)
  - [🧩 Key Dependencies Explained](#-key-dependencies-explained)
  - [🗂 Folder Structure](#-folder-structure)
  - [📄 JSX Pages Overview](#-jsx-pages-overview)
    - [1. Captain Pages](#1-captain-pages)
    - [2. User Pages](#2-user-pages)
    - [3. Shared or General Pages](#3-shared-or-general-pages)
    - [4. Root-Level](#4-root-level)
  - [🔑 Features Summary](#-features-summary)
  - [📦 Future Suggestions](#-future-suggestions)


----------------

# 🚘 Frontend - Cloud Monitoring Uber Project

## 🎯 Purpose

The frontend of the Uber Project serves as the **user interface layer**, enabling seamless interaction with the ride-booking system and real-time monitoring data. Core functionalities include:

- Booking rides
- Tracking ride status
- Visualizing system health through monitoring dashboards
- Surfacing metrics, alerts, and performance indicators

It ensures a **transparent, responsive, and user-friendly experience**, bridging user interactions with backend services while remaining extensible for future enhancements.

---

## 🧰 Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Remix Icons, React Icons
- **Real-Time Comm.**: Socket.IO
- **Animation**: GSAP
- **Payments**: Stripe
- **Utilities**: Axios, QR Code libraries

---

## 🧩 Key Dependencies Explained

| Category           | Library                          | Purpose                                                                 |
|-------------------|----------------------------------|-------------------------------------------------------------------------|
| **Core**           | `react`, `react-dom`            | Core React libraries to build and render UI components                 |
|                   | `react-router-dom`               | Page routing/navigation                                                |
| **UI / Icons**     | `react-icons`, `remixicon`       | Provide icon sets (Font Awesome, Material, Remix Icons, etc.)          |
|                   | `react-slick`, `slick-carousel` | Responsive carousels/sliders                                           |
|                   | `gsap`, `@gsap/react`            | Smooth animations, transitions, and effects                            |
| **Real-Time**      | `socket.io-client`              | Enables real-time 2-way communication (chat/logs/live updates)         |
| **Payments**       | `@stripe/stripe-js`             | Stripe payment gateway integration                                     |
| **Utilities**      | `axios`                         | For making HTTP requests to the backend                                |
|                   | `qrcode.react`, `react-qr-code` | QR Code generation (e.g., ride info or tracking)                       |

---

## 🗂 Folder Structure

```
├── .vscode/
├── public/
├── src/
│   ├── assets/              # Static assets like images or logos
│   ├── components/          # Shared, reusable UI components
│   ├── context/             # Global context/state providers
│   ├── pages/               # All route-based pages
│   ├── App.jsx              # Root component containing routes
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind base styles
│   └── locations.js         # Location-based data
├── .env                     # Environment variables
├── Dockerfile               # Docker config for containerization
├── tailwind.config.js       # Tailwind customization
├── vite.config.js           # Vite config for aliasing, optimizations
└── README.md
```

---

## 📄 JSX Pages Overview

### 1. Captain Pages

| Page                        | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| `CaptainHome.jsx`          | Captain dashboard: ride info, animations, controls                         |
| `CaptainLogin.jsx`         | Login form for captains                                                    |
| `CaptainLogout.jsx`        | Clears session/token on logout                                             |
| `CaptainPaymentHistory.jsx`| Shows captain's earnings from rides                                        |
| `CaptainProtectWrapper.jsx`| Route guard: protects captain routes                                       |
| `CaptainRideHistory.jsx`   | Ride history for captains                                                  |
| `CaptainSignup.jsx`        | Register new captain users                                                 |

### 2. User Pages

| Page                        | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| `UserLogin.jsx`            | Login form for riders/users                                                |
| `UserLogout.jsx`           | Logout and session cleanup for users                                       |
| `UserSignup.jsx`           | Registration form for new users                                            |
| `UserProtectWrapper.jsx`   | Guards user routes (auth protected)                                        |

### 3. Shared or General Pages

| Page                        | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| `Home.jsx`                 | Main dashboard (redirects based on user role)                              |
| `Payments.jsx`            | User's payment records (possibly shared with captain)                      |
| `Ratings.jsx`             | Ride feedback view for users/captains                                      |
| `RideHistory.jsx`         | User ride history overview                                                  |
| `Riding.jsx`              | Live ride tracking, estimated time, controls                                |
| `Start.jsx`               | Entry point for starting a new ride                                         |
| `SuccessPage.jsx`         | Confirmation for successful payment/booking                                 |

### 4. Root-Level

| File                       | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `App.jsx`                 | Main application layout with route handling                                |
| `main.jsx`                | React app entry point; injects App to DOM                                  |

---

## 🔑 Features Summary

- 🔒 Protected routing for Captains and Users
- 🚗 Real-time ride tracking using Socket.IO
- 📱 QR Code generation for ride verification
- 💳 Stripe-powered payment integration
- 🎨 Modern animations via GSAP
- 📜 Responsive design with Tailwind CSS
- 📈 Dashboard-ready UI for ride history and payments

---

## 📦 Future Suggestions



| Folder        | Purpose                                                                 |
|---------------|-------------------------------------------------------------------------|
| `hooks/`       | Custom React hooks (`useAuth`, `useSocket`)                            |
| `services/`    | API layer abstraction (`rideService.js`, `authService.js`)             |
| `utils/`       | Utility functions and validators                                        |
| `store/`       | Global state management (Redux, Zustand, etc.)                         |
| `tests/`       | Unit and integration tests using Jest + Testing Library                |
| `theme/`       | Tailwind or styled-components customization                            |
| `layouts/`     | Layout components (`AuthLayout`, `DashboardLayout`)                    |

---