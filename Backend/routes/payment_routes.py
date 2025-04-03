from flask import Blueprint, request, jsonify
from flask_cors import CORS
from app import db
from models.payment_model import Payment

from models.user_model import User

from models.captainPaymentHistory_model import CaptainPaymentHistory
from models.captain_model import CaptainEarnings, Captain
from models.ride_model import Ride, RideInvoice, RideDiscount
from models.transaction_model import Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid, random
from datetime import datetime

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

    # Check if payment already exists for this ride
    existing_payment = Payment.query.filter_by(ride_id=ride_id, status="completed").first()
    if existing_payment:
        return jsonify({"error": "Payment already made for this ride"}), 400

    # Fetch the ride details
    ride = Ride.query.get(ride_id)
    if not ride or not ride.captain_id:
        return jsonify({"error": "Ride not found or captain not assigned"}), 400

    captain = Captain.query.get(ride.captain_id)
    if not captain:
        return jsonify({"error": "Captain not found"}), 400

    # Fetch ride discount if available
    discount = RideDiscount.query.filter_by(ride_id=ride_id).first()
    
    if not discount:
        # Apply a new discount only if it doesn’t already exist
        discount_codes = ["SAVE10", "OFFER20", "DISCOUNT30"]
        discount = RideDiscount(
            ride_id=ride_id,
            discount_code=random.choice(discount_codes),
            discount_amount=round(random.uniform(10, 30), 2),
            applied_at=datetime.utcnow()
        )
        db.session.add(discount)
        db.session.commit()
    
    final_fare = ride.fare - discount.discount_amount  # Apply discount

    # Create payment entry
    new_payment = Payment(
        user_id=user_id, ride_id=ride_id,
        amount=final_fare, status="completed",
        payment_mode=payment_mode
    )
    db.session.add(new_payment)
    db.session.commit()

    # Generate unique transaction ID
    transaction_id = str(uuid.uuid4())
    new_transaction = Transaction(
        payment_id=new_payment.id,
        transaction_id=transaction_id,
        status="success",
        amount=final_fare
    )
    db.session.add(new_transaction)

    # Generate Invoice
    new_invoice = RideInvoice(
        ride_id=ride_id, user_id=user_id, captain_id=ride.captain_id,
        base_fare=ride.fare, discount_amount=discount.discount_amount,
        final_fare=final_fare
    )
    db.session.add(new_invoice)

    # Calculate captain earnings (80% of the final amount)
    captain_earnings = round(final_fare * 0.8, 2)

    # Store captain's earnings
    captain_payment = CaptainPaymentHistory(
        captain_id=ride.captain_id,
        ride_id=ride_id,
        pickup=ride.pickup,
        destination=ride.destination,
        amount_earned=captain_earnings,
    )
    db.session.add(captain_payment)

    captain_earnings_entry = CaptainEarnings.query.filter_by(captain_id=captain.id).first()
    if captain_earnings_entry:
        captain_earnings_entry.total_earnings += captain_earnings
    else:
        captain_earnings_entry = CaptainEarnings(
            captain_id=captain.id,
            captain_name=f"{captain.firstname} {captain.lastname}",
            total_earnings=captain_earnings
        )
        db.session.add(captain_earnings_entry)

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
        # "invoice": {
        #     "invoice_id": new_invoice.id,
        #     "ride_id": new_invoice.ride_id,
        #     "amount_paid": new_invoice.amount_paid,
        #     "discount_applied": new_invoice.discount_applied,
        #     "final_amount": new_invoice.final_amount,
        #     "payment_mode": new_invoice.payment_mode,
        #     "date": new_invoice.created_at.strftime("%Y-%m-%d %H:%M:%S")
        # },
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
