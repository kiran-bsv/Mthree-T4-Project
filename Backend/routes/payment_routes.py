from flask import Blueprint, request, jsonify
from flask_cors import CORS
# from app import db
# from models.payment_model import Payment
# from models.user_model import User
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Create a Blueprint for payments
payments_bp = Blueprint('payments', __name__)

# ✅ Apply CORS to the Blueprint level (to avoid duplicate headers)
CORS(payments_bp, resources={r"/create-checkout-session": {"origins": "http://localhost:5173"}})

# ✅ Handle CORS preflight properly
@payments_bp.route('/create-checkout-session', methods=['OPTIONS'])
def handle_preflight():
    return '', 204  # ✅ Return a proper preflight response

# ✅ Payment route with JWT authentication
@payments_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()  # 🔐 Require authentication
def create_checkout_session():
    try:
        # Get logged-in user identity from JWT
        user_id = get_jwt_identity()
        data = request.get_json()
        amount = data.get('amount')

        # Validate amount
        if not amount:
            return jsonify({"error": "Missing amount"}), 400
        
        amount_cents = int(float(amount) * 100)  # Convert to cents

        # Create a Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email=f"user{user_id}@example.com",
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': 'Ride Payment'},
                    'unit_amount': amount_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url="http://localhost:5173/payment/success",
            cancel_url="http://localhost:5173/payment/cancel",
        )

        return jsonify({"id": session.id}), 200  # Return the Stripe session ID

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
# @payments_bp.route("/payment/save", methods=["POST"])
# @jwt_required()  # Ensure only authenticated users can make payments
# def save_payment():
#     try:
#         data = request.json
#         user_id = get_jwt_identity()  # Get the user ID from the JWT token
#         ride_id = data.get("ride_id")
#         amount = data.get("amount")
#         payment_mode = data.get("payment_mode")
        
#         if not ride_id or not amount or not payment_mode:
#             return jsonify({"error": "Missing required fields"}), 400
        
#         # Check if a payment record for the ride already exists (to prevent duplicates)
#         existing_payment = Payment.query.filter_by(ride_id=ride_id).first()
#         if existing_payment:
#             return jsonify({"error": "Payment for this ride already exists"}), 400

#         # Save payment record
#         new_payment = Payment(
#             user_id=user_id,
#             ride_id=ride_id,
#             amount=amount,
#             payment_mode=payment_mode,
#             status="completed"  # Set status to completed for successful transactions
#         )

#         db.session.add(new_payment)
#         db.session.commit()

#         return jsonify({"message": "Payment recorded successfully", "payment_id": new_payment.id}), 201
    
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500
