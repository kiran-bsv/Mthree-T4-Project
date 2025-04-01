from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import stripe
import os
from dotenv import load_dotenv
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


payments_bp = Blueprint('payments', __name__)

# Handle preflight requests explicitly
@payments_bp.route('/create-checkout-session', methods=['OPTIONS'])
@cross_origin(origins="http://localhost:5173")
def handle_preflight():
    response = jsonify({'message': 'Preflight request success'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response, 200

@payments_bp.route('/create-checkout-session', methods=['POST'])
@cross_origin(origins="http://localhost:5173")
def create_checkout_session():
    try:
        data = request.get_json()
        # print(f"Received data: {data}")
        amount = data.get('amount')

        if not amount:
            return jsonify({"error": "Missing amount"}), 400

        amount_cents = int(float(amount) * 100)

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {'name': 'Ride Payment'},
                    'unit_amount': amount_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url="http://localhost:5173/payment/success",
            cancel_url="http://localhost:5173/payment/cancel",
        )

        return jsonify({"id": session.id}), 200

    except Exception as e:
         print(f"Error: {e}")
    return jsonify({"error": str(e)}), 500
