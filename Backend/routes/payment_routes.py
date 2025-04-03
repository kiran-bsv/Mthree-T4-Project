from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app import db
from models.payment_model import Payment

from models.user_model import User

from models.captainPaymentHistory_model import CaptainPaymentHistory
from models.ride_model import Ride

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
            # success_url="http://localhost:5173/payment/success",
            # cancel_url="http://localhost:5173/payment/cancel",
        )

        return jsonify({"id": session.id}), 200  # Return the Stripe session ID

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
@payments_bp.route('/pay', methods=['POST'])
@jwt_required()
def make_payment():
    data = request.get_json()
    user_id = get_jwt_identity()
    ride_id = data.get('ride_id')
    amount = data.get('amount')
    payment_mode = data.get('payment_mode')

    if not ride_id or not amount:
        return jsonify({"error": "Missing required payment details"}), 400

    new_payment = Payment(user_id=user_id, ride_id=ride_id, amount=amount, status="completed", payment_mode=payment_mode)
    db.session.add(new_payment)
    db.session.commit()

        
    # Fetch the captain_id for this ride
    ride = Ride.query.get(ride_id)
    if not ride or not ride.captain_id:
        return jsonify({"error": "Ride not found or captain not assigned"}), 400

    # Calculate captain earnings (80% of the total amount)
    captain_earnings = round(amount * 0.8, 2)

    # Store captain's earnings
    captain_payment = CaptainPaymentHistory(
        captain_id=ride.captain_id,
        ride_id=ride_id,
        pickup=ride.pickup,
        destination=ride.destination,
        amount_earned=captain_earnings,
    )
    db.session.add(captain_payment)

    # Commit all changes
    db.session.commit()

    return jsonify({
        "message": "Payment successful",
        "payment": {
            "id": new_payment.id,
            "ride_id": new_payment.ride_id,
            "amount": new_payment.amount,
            "status": new_payment.status,
            "payment_mode": new_payment.payment_mode
        },
        "captain_payment": {
            "id": captain_payment.id,
            "ride_id": captain_payment.ride_id,
            "amount_earned": captain_payment.amount_earned
        }
    }), 201

# @payments_bp.route('/history', methods=['GET'])
# @jwt_required()
# def get_payments():
#     user_id = get_jwt_identity()
#     payments = Payment.query.filter_by(user_id=user_id).all()
    
#     return jsonify({"payments": [p.to_dict() for p in payments]}), 200

@payments_bp.route('/captain-payment-history', methods=['GET'])
@jwt_required()
def get_captain_payments():
    captain_id = get_jwt_identity()

    # Fetch all payments for this captain
    payments = CaptainPaymentHistory.query.filter_by(captain_id=captain_id).all()

    payment_data = [
        {
            "ride_id": payment.ride_id,
            "pickup": payment.ride.pickup,
            "destination": payment.ride.destination,
            "amount_earned": payment.amount_earned,
            "date": payment.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for payment in payments
    ]

    return jsonify({"captain_payments": payment_data}), 200
