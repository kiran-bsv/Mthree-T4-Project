from flask import Blueprint, request, jsonify
from app import db
from models.payment_model import Payment
from models.captainPaymentHistory_model import CaptainPaymentHistory
from models.ride_model import Ride
from flask_jwt_extended import jwt_required, get_jwt_identity

payments_bp = Blueprint('payments', __name__)

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
