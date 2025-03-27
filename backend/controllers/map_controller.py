from flask import request, jsonify
from flask_jwt_extended import jwt_required
from services.map_service import get_address_coordinates, get_distance_time, get_auto_complete_suggestions
from marshmallow import Schema, fields, ValidationError

# ✅ Validation Schema using Marshmallow
class AddressSchema(Schema):
    address = fields.String(required=True, error_messages={"required": "Address is required"})

class DistanceSchema(Schema):
    origin = fields.String(required=True, error_messages={"required": "Origin is required"})
    destination = fields.String(required=True, error_messages={"required": "Destination is required"})

class AutoCompleteSchema(Schema):
    input = fields.String(required=True, error_messages={"required": "Input is required"})

address_schema = AddressSchema()
distance_schema = DistanceSchema()
autocomplete_schema = AutoCompleteSchema()

# ------------------------------------------
#  1. Get Coordinates
# ------------------------------------------
@jwt_required()
def get_coordinates():
    """
    Fetches latitude & longitude for a given address.
    """
    # try:
    #     data = address_schema.load(request.args)
    # except ValidationError as err:
    #     return jsonify(err.messages), 400

    # coordinates = get_address_coordinates(data["address"])

    # if not coordinates:
    #     return jsonify({"message": "Coordinates not found"}), 404

    # return jsonify(coordinates), 200
    return {"lat": 16.9525, "lng": 81.7881}  

# --------------------------------------------
# 2. Get Distance & Time
# --------------------------------------------
@jwt_required()
def get_distance_time_api():
    """
    Fetches distance & estimated travel time between two locations.
    """
    # try:
    #     data = distance_schema.load(request.args)
    # except ValidationError as err:
    #     return jsonify(err.messages), 400

    # distance_time = get_distance_time(data["origin"], data["destination"])

    # if not distance_time:
    #     return jsonify({"message": "Unable to fetch distance and time"}), 404

    # return jsonify(distance_time), 200
    #mock resonse 
    return {"distance": "100 km", "duration": "2 hours"}

# --------------------------------------------------------
#  3. Get Auto-Complete Suggestions
# --------------------------------------------------------
# @jwt_required()
# def get_auto_complete_suggestions_api():
#     """
#     Fetches place autocomplete suggestions.
#     """
#     try:
#         data = autocomplete_schema.load(request.args)
#     except ValidationError as err:
#         return jsonify(err.messages), 400

#     suggestions = get_auto_complete_suggestions(data["input"])

#     # if not suggestions:
#     #     return jsonify({"message": "No suggestions found"}), 404

#     return jsonify({"suggestions": suggestions}), 200

@jwt_required()
def get_auto_complete_suggestions_api():
    """
    Fetches place autocomplete suggestions.
    """
    try:
        data = autocomplete_schema.load(request.args)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Mock response (returning hardcoded values)
    suggestions = ["New York, NY, USA", "New Delhi, India", "New Orleans, LA, USA"]

    return jsonify({"suggestions": suggestions}), 200
