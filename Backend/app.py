import os
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_socketio import SocketIO  
from database_handler.database_handler import connect_to_db, db
# import eventlet
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
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize and connect to the database
connect_to_db(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize JWT and CORS
jwt = JWTManager(app)
CORS(app)
# socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")

# Register Blueprints (Routes)
app.register_blueprint(user_bp, url_prefix='/users')      
app.register_blueprint(ride_bp, url_prefix='/rides')      
app.register_blueprint(map_bp, url_prefix='/maps')        
app.register_blueprint(captain_bp, url_prefix='/captains')
app.register_blueprint(ratings_bp, url_prefix='/ratings')
app.register_blueprint(payments_bp, url_prefix='/payments')

@app.route('/')
def home():
    return jsonify({'message': 'Hello, Flask!'})

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response

@app.route('/payment/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.get_json()
        amount = data.get('amount')

        if not amount:
            return jsonify({"error": "Missing amount"}), 400

        print(f"Received amount: {amount}")  # Debugging line

        amount_cents = int(float(amount) * 100)

        # Your Stripe session creation logic...
    except Exception as e:
        print(f"Error during session creation: {str(e)}")  # Debugging line
        return jsonify({"error": str(e)}), 500