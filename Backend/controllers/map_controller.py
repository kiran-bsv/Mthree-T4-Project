from flask import request, jsonify
from flask_jwt_extended import jwt_required
from services.map_service import get_address_coordinates, get_distance_time, get_auto_complete_suggestions
from marshmallow import Schema, fields, ValidationError

#  1. Get Coordinates
@jwt_required()
def get_coordinates():
    """
    Fetches latitude & longitude for a given address.
    """
    return {"lat": 16.9525, "lng": 81.7881}  

# 2. Get Distance & Time
@jwt_required()
def get_distance_time_api():
    """
    Fetches distance & estimated travel time between two locations.
    """
    return {"distance": "100 km", "duration": "2 hours"}

#  3. Get Auto-Complete Suggestions
@jwt_required()
def get_auto_complete_suggestions_api():
    # Mock response (returning hardcoded values)
    suggestions = ["New York, NY, USA", "New Delhi, India", "New Orleans, LA, USA"]

    return jsonify({"suggestions": suggestions}), 200
