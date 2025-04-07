
# Payment & Rating System Document

---


---

## 1. **Overview**
This feature enables users to securely pay for their ride using Stripe and submit a rating after completion. It handles transactions, captain earnings, discount application, and history tracking.

---

## 2. **Frontend Implementation (Payments.jsx)**

- **Libraries Used**: Axios, Stripe JS
- **Flow**:
  - `useEffect()` creates Stripe Checkout session when component mounts.
  - POST request sent to `/create-checkout-session` with JWT token and amount.
  - Stripe redirects user to hosted checkout page on success.

```jsx
const stripe = await loadStripe("your-publishable-key");
const response = await axios.post(
  'http://localhost:5000/create-checkout-session',
  { amount: 100 },
  { headers: { Authorization: `Bearer ${token}` } }
);
const result = await stripe.redirectToCheckout({ sessionId: response.data.id });
```

---

## 3. **Backend Implementation (payment_routes.py)**

### a. **Stripe Checkout Creation**
- Secured using JWT.
- Converts amount to cents.
- Generates session using `stripe.checkout.Session.create()`.

### b. **Ride Payment Logic (`/pay` endpoint)**
- Validates ride and amount.
- Applies random discount if not already.
- Creates:
  - Payment Record
  - Transaction Entry
  - Ride Invoice
  - Captain Payment History
  - Updates/Creates Captain Earnings

### c. **Captain Payment History (`/captain-payment-history`)**
- JWT-secured GET endpoint.
- Returns captain’s payment logs including date, pickup, destination, and amount.

---

## 4. **Security Features**
- JWT authentication for all protected routes.
- CORS applied at blueprint level.
- Handles Stripe preflight OPTIONS request.

---



---

## 5. **Sample Flow**
1. User completes ride → clicks Pay
2. Redirected to Stripe Checkout
3. Payment processed
4. Discount (if not applied) gets added
5. Payment, Transaction, Invoice, and Captain earnings recorded

---

## 6. **Rating System (Future Scope)**
- After successful payment, redirect to a rating page.
- User submits a rating & feedback.
- Linked to `Ride` and `Captain` tables.

---

## 7. **Challenges & Learnings**
- Understanding Stripe’s workflow
- Backend-to-frontend secure token transmission
- Managing multiple DB updates in a single transaction

---

## 8. **Demo Link / Screenshots**
> Add screenshots of Stripe checkout, invoice generation, and captain earnings dashboard (if available).

---


---
