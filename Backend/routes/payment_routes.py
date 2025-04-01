from flask import Blueprint, request, jsonify
from app import db
from models.payment_model import Payment
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

    # Manually create a dictionary for the response
    payment_data = {
        "id": new_payment.id,
        "user_id": new_payment.user_id,
        "ride_id": new_payment.ride_id,
        "amount": new_payment.amount,
        "status": new_payment.status,
        "created_at": new_payment.created_at.isoformat(),
        "payment_mode": new_payment.payment_mode
    }

    return jsonify({"message": "Payment successful", "payment": payment_data}), 201

@payments_bp.route('/history', methods=['GET'])
@jwt_required()
def get_payments():
    user_id = get_jwt_identity()
    payments = Payment.query.filter_by(user_id=user_id).all()
    
    return jsonify({"payments": [p.to_dict() for p in payments]}), 200
