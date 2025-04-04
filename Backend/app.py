import os
import jwt
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from flask_migrate import Migrate
from database_handler.database_handler import connect_to_db, db
import stripe

# Import Routes
from routes.user_routes import user_bp
from routes.ride_routes import ride_bp
from routes.map_routes import map_bp
from routes.captain_routes import captain_bp
from routes.rating_routes import ratings_bp
from routes.payment_routes import payments_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# ✅ Properly configured CORS
# CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)
CORS(app)

# Stripe API key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize and connect to the database
connect_to_db(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize JWT
jwt = JWTManager(app)

# Register Blueprints (Routes)
app.register_blueprint(user_bp, url_prefix='/users')      
app.register_blueprint(ride_bp, url_prefix='/rides')      
app.register_blueprint(map_bp, url_prefix='/maps')        
app.register_blueprint(captain_bp, url_prefix='/captains')
app.register_blueprint(ratings_bp, url_prefix='/ratings')
app.register_blueprint(payments_bp, url_prefix='/payments')

# Home Route
@app.route('/')
def home():
    return jsonify({'message': 'Hello, Flask!'})

# ✅ Payment Checkout Session Route (No extra CORS here)
@app.route('/payment/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        amount = data.get('amount')

        if not amount:
            return jsonify({"error": "Missing amount"}), 400

        amount_cents = int(float(amount) * 100)

        # Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Ride Payment',
                    },
                    'unit_amount': amount_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/success',
            cancel_url='http://localhost:5173/cancel',
        )

        return jsonify({'id': session.id})

    except Exception as e:
        print(f"Error during session creation: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
