## Backend Overview
The backend of the Uber Clone Application is developed using Flask (Python), providing a modular and scalable REST API architecture to support essential features such as user and captain authentication, real-time ride management, payment processing, and user feedback collection. Here's a breakdown of its core components:

### Framework & Tools
- **Flask**: Lightweight Python web framework used to build RESTful API endpoints.
- **Flask-JWT-Extended**: Handles secure authentication using JWT tokens.
- **Flask-SQLAlchemy**: ORM for database interactions with MySQL.
- **Flask-SocketIO**: Enables real-time communication between users and captains (for ride events).
- **Marshmallow**: Used for data serialization and validation.

### Authentication & Authorization
This section outlines how users and captains register/login, how JWT tokens are handled, and how token expiration is managed.

#### 1. Registration & Login Flow
**User/Captain Registration**
- Users register with firstname, lastname, email, and password (hashed).
- Captains also provide vehicle details: color, plate, capacity, and type.
- After successful registration, a JWT token is generated and sent back to the client.

**User/Captain Login**
- Verifies email and password (hashed) against stored records.
- If valid, issues a JWT token and returns it along with profile info.
- Updates last_login timestamp in the respective activity table (UserActivity or CaptainActivity).

#### 2. JWT Token Handling
**Token Generation**
- JWT is generated using:
  ```python
  create_access_token(identity=user_id)
  ```
- Includes the user/captain ID as the token's identity.

**Token Validation**
- The custom decorator `@auth_user`:
  - Ensures token is present and valid using `verify_jwt_in_request()`.
  - Checks the token is not blacklisted.
  - Confirms user/captain still exists in the DB.

**Client Storage**
- Tokens are sent in JSON responses.
- On the client side, they should be securely stored in `localStorage`.

#### 3. Token Expiry
- Configured as:
  ```python
  app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
  ```
- Access tokens expire after 7 days for added security.

---

### What is Socket.IO?
Socket.IO enables real-time, bidirectional communication between clients (e.g., browser/mobile apps) and the server using WebSockets under the hood. Unlike HTTP, which is request-response-based, WebSockets allow persistent connections for instant event-based updates.

### Why Use Sockets in Ride Booking App?
- Instantly notify users and captains when a ride is booked, accepted, or started.
- Improve responsiveness and interactivity.

### Socket Connection Lifecycle
**1. connect**
- Triggered when a client connects.
- Logs the unique `socket.id` of the connected client.
- Used to track each user's active session.
```python
@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
```

**2. join**
- Triggered when a user or captain logs in.
- Saves the client’s `socket.id` in the DB.
- Differentiates between user and captain.
- Enables targeted communication later.
```python
@socketio.on('join')
def handle_join(data):
    # data = {"userId": ..., "userType": "user" or "captain"}
```

**Use case**: Allows server to later send a ride request or confirmation directly to that user/captain.

**3. disconnect**
- Triggered when a client disconnects (closes app/browser).
- Logs that the user is disconnected.
- Can be extended to update captain's online/offline status.
```python
@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
```

### Server-Emitted Socket Events (Real-time Messages)
**4. send_message_to_socket_id**
- Utility to send message to a specific user/captain.
```python
def send_message_to_socket_id(socket_id, event, data):
    socketio.emit(event, data, room=socket_id)
```
Used when you want to send a targeted update (e.g., ride confirmation to a specific captain).

### App-Specific Real-Time Events
**1. new-ride**
- Broadcast when a user books a ride.
- Sent to all captains (or filtered subset).
- Contains user info, pickup, destination, fare, etc.
```python
socketio.emit("new-ride", ride_data, to=None)
```
Allows captains to see available ride requests in real time.

**2. ride-confirmed**
- Sent after a captain accepts a ride.
- Delivered to the user who created the ride.
- Contains captain info, fare, duration, etc.
```python
socketio.emit("ride-confirmed", ride_data, to=None)
```
Notifies the user that their ride has been accepted and who their captain is.

**3. ride-started**
- Sent when captain starts the ride (OTP verified).
- Confirms ride has begun.
- Contains all essential ride info: captain, destination, fare, duration, etc.
```python
socketio.emit("ride-started", ride_data, to=None)
```
Keeps the user informed and can trigger a UI change to ride-in-progress mode.

### Summary Flow (Socket Events in Action)
1. User opens app → connect → join  
2. Captain opens app → connect → join  
3. User books ride → new-ride emitted  
4. Captain sees ride → confirms → ride-confirmed to user  
5. Captain verifies OTP → starts ride → ride-started emitted  
6. Any client disconnects → disconnect

---

## API Routes
This part outlines the available API endpoints for the Uber clone app. Routes are grouped by functionality—User, Captain, Ride, Map, Payment, and Ratings—each responsible for specific features like authentication, ride booking, payments, and feedback.

### User Routes
**POST /user/register**:  
Creates a new user with email and hashed password after checking for duplicates.  
Saves the user in the database and returns success or error message.

**POST /user/login**:  
Validates email and password against stored credentials.  
If valid, returns a JWT token for session authentication.

**GET /user/profile**:  
Decodes the JWT token sent in the request headers.  
Fetches and returns user details like name and email.

**POST /user/logout**:  
Invalidates the JWT token by adding it to a denylist.  
Ensures the token can't be reused for further requests.

### Captain Routes
**POST /captain/register**:  
Registers a new captain by collecting their details securely.  
Hashes password and stores captain data in the database.

**POST /captain/login**:  
Authenticates captain credentials and issues a JWT token.  
The token allows access to protected captain routes.

**GET /captain/profile**:  
Extracts captain identity from the token provided.  
Returns profile information including name and contact.

**POST /captain/logout**:  
Blacklists the JWT token to log the captain out.  
Prevents any further access with that token.

### Ride Routes
**POST /ride/create**:  
User submits pickup and drop locations to request a ride.  
Stores the ride request in the DB and waits for captain acceptance.

**GET /ride/get-fare**:  
Estimates fare based on distance using a fixed rate.  
Helps user know expected cost before booking.

**POST /ride/confirm**:  
Confirms the ride by locking in pickup/drop and captain.  
Changes ride status to “confirmed” for tracking.

**GET /ride/start-ride**:  
Triggered by the captain when the ride begins.  
Marks the ride status as “ongoing” in the database.

**POST /ride/end-ride**:  
Ends the ride and calculates total fare based on distance.  
Updates ride status to “completed” and stores data.

**GET /ride/ride-history**:  
Returns the logged-in user's past ride details.  
Extracts data from the ride table using user ID.

**GET /ride/favoriteRoute**:  
Analyzes user’s ride history to find most traveled paths.  
Returns frequently used source-destination combinations.

**GET /ride/captain-ride-history**:  
Shows all rides completed or accepted by the captain.  
Useful for tracking trips and earnings.

### Map Routes
**GET /map/get-coordinates**:  
Accepts a location name and returns latitude/longitude.

**GET /map/get-distance-time**:  
Calculates distance and estimated time between two points.  
Returns both distance in km and duration in minutes.

**GET /map/get-suggestions**:  
Provides auto-complete suggestions for places.  
Based on user’s partial input, using a places API.

### Payment Routes
**POST /payment/create-checkout-session**:  
Creates a Stripe checkout session with payment amount and metadata.  
Returns a redirect URL for user to complete payment.

**POST /payment/pay**:  
Handles payment result.  
Saves transaction details and updates captain’s earnings.

**GET /payment/captain-payment-history**:  
Fetches captain’s ride-wise payment history.  
Useful for financial reporting and payouts.

### Ratings Routes
**POST /rating/rate**:  
Lets user rate the captain post-ride with stars and feedback.  
Stores rating, tags (like "Clean Car"), and ride ID.

**GET /rating/categories**:  
Returns all available feedback categories or tags.  
Helps users choose from predefined feedback options.

**POST /rating/categories/add**:  
Adds new rating categories if they don’t already exist.  
Prevents duplication and keeps category list clean.

**POST /rating/rate-response**:  
Allows captain to respond to a user's review.  
Each review can have one corresponding captain reply.
