from flask import Blueprint
from controllers.map_controller import get_coordinates, get_distance_time_api, get_auto_complete_suggestions_api

map_bp = Blueprint("map", __name__)

map_bp.route('/get-coordinates', methods=['GET'])(get_coordinates)
map_bp.route('/get-distance-time', methods=['GET'])(get_distance_time_api)
map_bp.route('/get-suggestions', methods=['GET'])(get_auto_complete_suggestions_api)