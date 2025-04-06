# Challenges Faced During Development

Throughout the development of this ride-booking application, we faced multiple challenges—technical, architectural, and real-time coordination issues. Here's how we tackled them across backend, database, and frontend layers.

---

## Backend Challenges

### 1. Real-time Communication with Sockets

Implementing stable socket connections between users and captains was tough, especially in handling event lifecycles like ride request, accept, start, cancel, and complete. Unexpected disconnects, multiple socket events triggering simultaneously, and tracking active sockets were major hurdles.

**How We Solved It:**

- We used `Flask-SocketIO` to manage real-time communication with rooms and event-based messaging.
- Introduced **namespaces** to separate user and captain flows cleanly.
- Maintained a mapping of user and captain **socket IDs** in the backend to ensure messages (like ride acceptance, ride start, etc.) reached the correct recipient.
- Added event acknowledgements and reconnect logic to re-bind sockets after disconnection or page reloads.

---

## Database Challenges

### 1.Status Sync Across Modules

In the early stages of development, we encountered inconsistencies in how ride statuses were handled across different modules. For instance, the backend might mark a ride as "ONGOING," but the frontend wouldn’t reflect the change in real-time or might even show an outdated status like "CONFIRMED." This led to confusion for both users and captains during active rides.

The root cause was that different parts of the system were using string-based status updates without a centralized structure, and there was no strict validation for allowed transitions. It became error-prone, especially when the frontend or database attempted to manually set statuses or misinterpreted them.

**How We Solved It:**

- We defined an enumeration (enum) in the backend with clearly defined ride statuses: `PENDING`, `CONFIRMED`, `ONGOING`, `COMPLETED`, `CANCELLED`.
- All ride status transitions were validated centrally through backend logic (e.g., a ride cannot jump from `PENDING` directly to `COMPLETED`).
- The frontend was updated to only rely on the backend for status changes, and sockets were used to receive real-time status updates.
- This ensured consistency across the application, improved debugging, and reduced edge-case bugs related to ride flow.


---

## Frontend Challenges

### 1. Stripe Integration and Socket Disconnection

**Problem:**
- Users were redirected to Stripe's hosted payment page during card payments.
- This redirection caused the active `socket` connection to break, as users temporarily left our domain.
- As a result, real-time features like ride completion updates or captain responses failed after payment.

**How We Solved It:**
- Re-established the `socket` connection when users returned to the `/ratings` page.
- On reconnect, we re-emitted necessary identifiers (like `userId`, `rideId`) to resume communication.
- This allowed the backend to reassociate the user and continue sending real-time updates.

---
