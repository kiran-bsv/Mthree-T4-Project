from flask import Blueprint
from controllers.ride_controller import create_ride_api, get_fare_api, confirm_ride_api, start_ride_api, end_ride_api, get_ride_history_api, get_favorite_locations

ride_bp = Blueprint('rides', __name__)

ride_bp.route('/create', methods=['POST'])(create_ride_api)
ride_bp.route('/get-fare', methods=['GET'])(get_fare_api)
ride_bp.route('/confirm', methods=['POST'])(confirm_ride_api)
ride_bp.route('/start-ride', methods=['GET'])(start_ride_api)
ride_bp.route('/end-ride', methods=['POST'])(end_ride_api)
ride_bp.route('/ride-history', methods=['GET'])(get_ride_history_api)
ride_bp.route('/favoriteRoute', methods=['GET'])(get_favorite_locations)