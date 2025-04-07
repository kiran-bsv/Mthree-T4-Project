- [🚗 **Uber Clone Backend Documentation**](#-uber-clone-backend-documentation)
  - [🧠 **Backend Overview**](#-backend-overview)
  - [⚙️ **Framework \& Tools**](#️-framework--tools)
  - [🔐 **Authentication \& Authorization**](#-authentication--authorization)
    - [✅ **Registration \& Login Flow**-](#-registration--login-flow-)
      - [👤 User/Captain Registration](#-usercaptain-registration)
      - [🔐 User/Captain Login](#-usercaptain-login)
    - [🧾 **JWT Token Handling**](#-jwt-token-handling)
      - [🛠️ Token Generation](#️-token-generation)
      - [🔍 Token Validation](#-token-validation)
      - [💾 Client-Side Token Storage](#-client-side-token-storage)
    - [⏱️ **Token Expiry**](#️-token-expiry)
  - [🔌 **Real-Time Communication with Socket.IO**](#-real-time-communication-with-socketio)
    - [❓ What is Socket.IO?](#-what-is-socketio)
    - [⚡ Why Use Sockets in a Ride App?](#-why-use-sockets-in-a-ride-app)
    - [🔄 **Socket Connection Lifecycle**](#-socket-connection-lifecycle)
      - [1. **connect**](#1-connect)
      - [2. **join**](#2-join)
      - [3. **disconnect**](#3-disconnect)
    - [📤 **Server-Emitted Events (Real-Time Messages)**](#-server-emitted-events-real-time-messages)
      - [🔁 `send_message_to_socket_id`](#-send_message_to_socket_id)
    - [🚦 **App-Specific Real-Time Events**](#-app-specific-real-time-events)
      - [🆕 `new-ride`](#-new-ride)
      - [✅ `ride-confirmed`](#-ride-confirmed)
      - [🟢 `ride-started`](#-ride-started)
    - [📊 Summary Flow: Socket Events in Action](#-summary-flow-socket-events-in-action)
  - [📡 **API Routes Overview**](#-api-routes-overview)
    - [👤 **User Routes**](#-user-routes)
    - [🧑‍✈️ **Captain Routes**](#️-captain-routes)
    - [🚘 **Ride Routes**](#-ride-routes)
    - [🗺️ **Map Routes**](#️-map-routes)
    - [💳 **Payment Routes**](#-payment-routes)
    - [🌟 **Ratings Routes**](#-ratings-routes)


-------


# 🚗 **Uber Clone Backend Documentation**

## 🧠 **Backend Overview**
The backend of the **Uber Clone Application** is developed using **Flask (Python)**. It follows a **modular** and **scalable REST API architecture**, enabling essential features such as:

- 🧍‍♂️ User & Captain authentication
- 🚖 Real-time ride management
- 💳 Payment processing
- 🗣️ Feedback and rating system

---

## ⚙️ **Framework & Tools**

| Tool                | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| **Flask**           | Lightweight web framework for creating RESTful APIs                     |
| **Flask-JWT-Extended** | Handles authentication using JWT tokens securely                      |
| **Flask-SQLAlchemy**| ORM for interacting with a **MySQL** database                           |
| **Flask-SocketIO**  | Real-time WebSocket communication between users and captains            |
| **Marshmallow**     | For **serialization**, **deserialization**, and **data validation**     |

---

## 🔐 **Authentication & Authorization**

### ✅ **Registration & Login Flow**- 


#### 👤 User/Captain Registration
- Users provide: `firstname`, `lastname`, `email`, and `password (hashed)`
- Captains additionally provide vehicle details:
  - `color`, `plate`, `capacity`, `type`
- On successful registration:
  - A **JWT token** is generated and sent back
  - Stored in client-side **localStorage**

#### 🔐 User/Captain Login
- Validates credentials using:
  - Hashed password comparison
- If correct:
  - Returns JWT token
  - Updates `last_login` in either `UserActivity` or `CaptainActivity` table

---

### 🧾 **JWT Token Handling**

#### 🛠️ Token Generation
```python
create_access_token(identity=user_id)
```
- Identity used: user or captain ID

#### 🔍 Token Validation
- Handled with a custom decorator:
```python
@auth_user
def some_protected_route():
    ...
```
- Uses:
  - `verify_jwt_in_request()` to validate token
  - Checks if token is **blacklisted**
  - Verifies the user/captain exists

#### 💾 Client-Side Token Storage
- JWT token is returned in a JSON response
- Should be stored securely (e.g., `localStorage` or `sessionStorage`)

---

### ⏱️ **Token Expiry**
Configured in `app.config`:
```python
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
```
- 🔐 Tokens expire after **7 days** for enhanced security

---

## 🔌 **Real-Time Communication with Socket.IO**

### ❓ What is Socket.IO?
- Enables **real-time**, **bidirectional** communication using **WebSockets**
- Better than HTTP for:
  - Instant ride updates
  - Persistent connection without polling

---

### ⚡ Why Use Sockets in a Ride App?
- Notify **captains instantly** when a user books a ride
- Notify **users immediately** when a captain accepts or starts a ride
- Keep the app **interactive** and **responsive**

---

### 🔄 **Socket Connection Lifecycle**

#### 1. **connect**
- Triggered when a client connects
```python
@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
```

#### 2. **join**
- Triggered post-login
- Stores `socket.id` in DB to enable targeted messaging
```python
@socketio.on('join')
def handle_join(data):
    # data = {"userId": ..., "userType": "user" or "captain"}
```

#### 3. **disconnect**
- Logs when a user or captain disconnects
- Can also update online/offline status
```python
@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
```

---

### 📤 **Server-Emitted Events (Real-Time Messages)**

#### 🔁 `send_message_to_socket_id`
Utility function to send message to a specific client:
```python
def send_message_to_socket_id(socket_id, event, data):
    socketio.emit(event, data, room=socket_id)
```

---

### 🚦 **App-Specific Real-Time Events**

#### 🆕 `new-ride`
- Triggered when a user **books a ride**
- Broadcasted to **all captains** or a **filtered subset**
```python
socketio.emit("new-ride", ride_data)
```

#### ✅ `ride-confirmed`
- Sent to user when a captain **accepts** the ride
```python
socketio.emit("ride-confirmed", ride_data)
```

#### 🟢 `ride-started`
- Triggered when ride **begins (OTP verified)**
```python
socketio.emit("ride-started", ride_data)
```

---

### 📊 Summary Flow: Socket Events in Action

```text
User connects       → connect → join  
Captain connects    → connect → join  
User books ride     → emits 'new-ride'  
Captain accepts     → emits 'ride-confirmed'  
Captain starts ride → emits 'ride-started'  
Client disconnects  → disconnect
```

---

## 📡 **API Routes Overview**

---

### 👤 **User Routes**

| Method | Route             | Description                                               |
|--------|-------------------|-----------------------------------------------------------|
| POST   | `/user/register`  | Register a new user                                       |
| POST   | `/user/login`     | Authenticate and return JWT token                         |
| GET    | `/user/profile`   | Get user info from JWT                                    |
| POST   | `/user/logout`    | Add JWT to denylist, logging the user out                 |

---

### 🧑‍✈️ **Captain Routes**

| Method | Route              | Description                                               |
|--------|--------------------|-----------------------------------------------------------|
| POST   | `/captain/register`| Register new captain with vehicle details                 |
| POST   | `/captain/login`   | Login and get JWT token                                   |
| GET    | `/captain/profile` | Get captain details using token                           |
| POST   | `/captain/logout`  | Blacklist the JWT token                                   |

---

### 🚘 **Ride Routes**

| Method | Route                    | Description                                                       |
|--------|--------------------------|-------------------------------------------------------------------|
| POST   | `/ride/create`           | Submit ride request                                               |
| GET    | `/ride/get-fare`         | Estimate fare based on distance                                   |
| POST   | `/ride/confirm`          | Confirm and lock the ride with captain                            |
| GET    | `/ride/start-ride`       | Captain marks ride as started                                     |
| POST   | `/ride/end-ride`         | Ends the ride, calculates fare, and updates DB                    |
| GET    | `/ride/ride-history`     | Show user's past ride details                                     |
| GET    | `/ride/favoriteRoute`    | Get user's most frequent pickup-drop pairs                        |
| GET    | `/ride/captain-ride-history` | Show captain's completed and accepted rides                      |

---

### 🗺️ **Map Routes**

| Method | Route                    | Description                                                       |
|--------|--------------------------|-------------------------------------------------------------------|
| GET    | `/map/get-coordinates`   | Get latitude/longitude of a location name                         |
| GET    | `/map/get-distance-time` | Calculate time & distance between pickup and drop                 |
| GET    | `/map/get-suggestions`   | Get place suggestions (auto-complete)                             |

---

### 💳 **Payment Routes**

| Method | Route                          | Description                                                 |
|--------|--------------------------------|-------------------------------------------------------------|
| POST   | `/payment/create-checkout-session` | Creates Stripe session and returns redirect URL          |
| POST   | `/payment/pay`                 | Finalizes payment and updates captain earnings              |
| GET    | `/payment/captain-payment-history` | Shows ride-wise payment history for captain              |

---

### 🌟 **Ratings Routes**

| Method | Route                    | Description                                                   |
|--------|--------------------------|---------------------------------------------------------------|
| POST   | `/rating/rate`           | Rate the captain post-ride with stars and feedback            |
| GET    | `/rating/categories`     | Get all feedback tags/categories                              |
| POST   | `/rating/categories/add` | Add a new feedback category (if unique)                       |
| POST   | `/rating/rate-response`  | Captain replies to a user's review                            |

---

