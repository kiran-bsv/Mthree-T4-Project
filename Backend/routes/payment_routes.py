from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Blueprint
import stripe
import os
from dotenv import load_dotenv



# ride_bp = Blueprint('rides', __name__)

apps = Blueprint('payment', __name__)
CORS(apps, resources={r"/*": {"origins": "http://localhost:5173"}}) 
load_dotenv()  # Load environment variables from .env
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

if not stripe.api_key:
    raise ValueError("STRIPE_SECRET_KEY is not set. Check your .env file.")
@apps.route("/success")
def success():
    return "Payment successful! ."

@apps.route("/cancel")
def cancel():
    return "Payment canceled. Please try again."

@apps.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": "Sample Product"},
                        "unit_amount": 1000,  # Amount in cents ($10)
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url="http://localhost:5000/payment/success",  # Redirect to frontend success page
            cancel_url="http://localhost:5000/payment/cancel",  # Redirect to frontend cancel page
        )
        return jsonify({"id": session.id, "url": session.url})  # Return session URL to frontend
    except Exception as e:
        return jsonify(error=str(e)), 400

if __name__ == "__main__":
    apps.run(port=5000, debug=True)
