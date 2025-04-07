
# UBER Application - Sequence Flow and Detailed Process Explanation

---

## 1. Overview
This document outlines the complete step-by-step flow of the UBER application based on the sequence diagram. It is divided into two main flows: User and Rider. Each step is explained clearly to understand how the system works.

---

## 2. UBER Application Launch
- The UBER app is opened.
- Two flows are initialized: one for the **User** (customer) and the other for the **Rider** (driver).

---

## 3. User Flow

### Step 1: Authentication
- **Action:** User enters a **Username and Password**.
- **System Check:** If the credentials are valid → proceed to login.
- **Next:** User is granted access to the application.

### Step 2: Location Search
- **Action:** User searches for a pick-up and drop-off location.
- **System Response:** Suggestions or map interface is provided for accurate location pinning.

### Step 3: Book a Ride
- **Action:** User books the ride after selecting the source and destination.
- **System Response:** A ride request is sent to nearby riders.

### Step 4: OTP Generation
- **Action:** After a ride is confirmed by the rider, the system **generates an OTP**.
- **Purpose:** This OTP ensures secure communication and validates the correct ride.

### Step 5: OTP Verification
- **Action:** User shares the OTP with the Rider.
- **System Check:** Rider enters OTP to verify.
- **Result:** If OTP is correct → ride begins.

### Step 6: Ride Progress
- **System:** Updates the app with ride.

### Step 7: Ride Completion
- **Action:** Upon reaching the destination, ride is marked as **Completed**.

### Step 8: Payment Options
User selects a payment method:

#### a. Cash:
- **Action:** User chooses Cash.
- **Process:** Pays the Rider in cash.
- **Next:** Redirected to **Success Page**.
- **Final:** Navigates back to **Home**.

#### b. Card:
- **Action:** User selects Card.
- **Process:** Payment is processed using **Stripe** gateway.
- **Next:** Redirected to **Success Page**.
- **Final:** Navigates back to **Home**.

#### c. UPI:
- **Action:** User selects UPI.
- **Process:** Pays using any UPI-supported app.
- **Next:** Redirected to **Success Page**.
- **Final:** Navigates back to **Home**.

---

## 4. Rider Flow

### Step 1: Authentication
- **Action:** Rider enters **Username and Password**.
- **System Check:** If the credentials are correct → login is successful.

### Step 2: Ride Request Handling
- **System:** Rider receives a **ride request**.
- **Action:** Rider can accept the request.

### Step 3: OTP Verification
- **Action:** After accepting, rider waits for OTP from the User.
- **Process:** Rider enters the OTP in the app.
- **Check:** If OTP matches → ride starts.

### Step 4: Ride Starts
- **System:** Ride Started.
- **Monitoring:** Ride is on the way.

### Step 5: Ride Completion
- **Action:** Rider marks the trip as completed upon arrival.
- **System:** Awaits User payment confirmation.

---
