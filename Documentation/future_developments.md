
## Future Developments

The current backend and database support a solid foundation for the Uber Clone App. However, several planned features and improvements are still in the pipeline to enhance functionality and user experience.

---

### Blacklist Token Functionality
- Currently, the `blacklist_token` table is not actively used.
- **Planned Enhancement:** If a captain cancels **5 rides within a short duration**, they should be temporarily blacklisted using a token with an expiry.
- This can help **control abuse** and ensure fair service to users.

---

### Real-Time Tracking & Maps Integration
- Real-time location tracking is **not implemented yet**.
- **To be added:**
  - Integration of **Google Maps API** or **Mapbox API**.
  - Use of **WebSockets** to emit captain's live location at regular intervals.
  - Display live tracking UI on the user’s ride screen.
- This will improve **transparency and safety** for the user.

---

### Rating Response System
- The `rating_response` table is present, but **not yet integrated** in logic.
- **To be implemented:**
  - When a user submits a rating, emit a **Socket.IO event** to the captain.
  - Captain can send a **“Thank you for your feedback”** message or emojis via UI.
- Encourages a **better user-captain relationship** and **two-way feedback**.

---

### Promo Code / Ride Discount Functionality
- The `ride_discount` table has been seeded from the backend but **not integrated** in frontend logic.
- **To be implemented:**
  - User can **enter a promo code** at the time of booking.
  - The system should **validate** the code and apply the discount if valid.
  - Final fare should reflect the discounted amount.
- Adds **marketing and engagement value** to the platform.

---

### Additional Ideas

- **Referral Program Table**: Invite friends, track referral usage, and reward.
- **Captain Weekly Reports**: Auto-generated earnings + rating report via email or downloadable PDF.
- **User Ride Goals**: Offer achievements for frequent users (like "5 rides this week = 10% off").
- **Chat Support Table**: Integrate a basic chat or ticket system between user and support.

---
