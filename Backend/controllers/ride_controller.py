from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.ride_model import Ride, db
from models.rideHistory_model import RideHistory
from models.favouriteLocation_model import FavoriteLocation
from models.captainRideHistory_model import CaptainRideHistory
from marshmallow import Schema, fields, ValidationError
from services.ride_service import create_ride, get_fare, confirm_ride, start_ride, end_ride

#createRideSchema to validate the request data for creating a ride
class CreateRideSchema(Schema):
    pickup = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid pickup address"})
    destination = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid destination address"})
    vehicleType = fields.Str(required=True, validate=lambda s: s in ["auto", "car", "moto"], error_messages={"required": "Invalid vehicle type"})

#fareQuerySchema to validate the request data for fare query
class FareQuerySchema(Schema):
    pickup = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid pickup address"})
    destination = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid destination address"})

#rideConfirmationSchema to validate the request data for ride confirmation
class RideConfirmationSchema(Schema):
    rideId = fields.Int(required=True, error_messages={"required": "Invalid ride id"})
    captainId = fields.Int(required=True, error_messages={"required": "Captain ID is required"})

#startRideSchema to validate the request data for starting a ride
class StartRideSchema(Schema):
    rideId = fields.Int(required=True, error_messages={"required": "Invalid ride id"})
    otp = fields.Str(required=True, validate=lambda s: len(s) == 6, error_messages={"required": "Invalid OTP"})

#endRideSchema to validate the request data for ending a ride
class EndRideSchema(Schema):
    rideId = fields.Int(required=True, error_messages={"required": "Invalid ride id"})

create_ride_schema = CreateRideSchema()
fare_query_schema = FareQuerySchema()
ride_id_schema = RideConfirmationSchema()
start_ride_schema = StartRideSchema()
end_ride_schema = EndRideSchema()


# handles ride creation by validating input, calculating fare, and saving ride data
# jwt_required decorator ensures that the user is authenticated before confirming the ride
@jwt_required()
def create_ride_api():
    try:
        data = create_ride_schema.load(request.json)
        print("data", data)
        ride = create_ride(**data)
        return jsonify({column.name: getattr(ride, column.name) for column in ride.__table__.columns}), 201

    except ValidationError as err:
        return jsonify(err.messages), 400

# handles fare calculation by validating input and calling get_fare returning fare, duration, and distance
@jwt_required()
def get_fare_api():
    try:
        data = fare_query_schema.load(request.args)
        fare, duration, distance = get_fare(data['pickup'], data['destination'])
        print(f"line 49 - fare: {fare} \n duration: {duration}")
        return jsonify({'fare': fare, 'duration': duration, 'distance': distance}), 200
    except ValidationError as err:
        return jsonify(err.messages), 400

# handles ride confirmation by validating input and calling confirm_ride to update ride status 
def confirm_ride_api():
    try:
        data = RideConfirmationSchema().load(request.get_json())  

        ride = Ride.query.get(data['rideId'])
        if not ride:
            return jsonify({"rideId": ["Invalid ride id"]}), 400

        ride = confirm_ride(data['rideId'], data['captainId'])
        return jsonify({'message': 'Ride confirmed', 'ride_id': ride.get('id')}), 200

    except ValidationError as err:
        return jsonify(err.messages), 400

# handles ride start by validating input and calling start_ride to update ride status
@jwt_required()
def start_ride_api():
    try:
        data = start_ride_schema.load(request.args)
        ride = start_ride(data['rideId'], data['otp'], get_jwt_identity())
        return jsonify({'message': 'Ride started', 'ride_id': ride.get('id')}), 200
    except ValidationError as err:
        return jsonify(err.messages), 400

# handles ride end by validating input and calling end_ride to update ride status
@jwt_required()
def end_ride_api():
    try:
        data = end_ride_schema.load(request.json)
        captain_id = get_jwt_identity()
        
        if not captain_id:
            return jsonify({'captainId': ['Captain ID is required']}), 400

        ride = end_ride(data['rideId'], captain_id)
        print("ride", ride)
        return jsonify({'message': 'Ride ended', 'ride_id': ride.id}), 200

    except ValidationError as err:
        return jsonify(err.messages), 400
    except ValueError as err:
        return jsonify({'error': str(err)}), 400
    
# handles ride history retrieval by filtering rides based on user ID and returning ride details
@jwt_required()
def get_ride_history_api():
    user_id = get_jwt_identity()
    ride_history = RideHistory.query.filter_by(user_id=user_id).all()

    history_data = [
        {
            "ride_id": ride.ride_id,
            "status": ride.status,
            "pickup": ride.pickup,
            "destination": ride.destination,
            "fare": ride.fare,
            "timestamp": ride.timestamp
        }
        for ride in ride_history
    ]
    
    return jsonify({"ride_history": history_data}), 200

# handles favorite locations retrieval by filtering favorite locations based on user ID and returning top 3 locations
@jwt_required()
def get_favorite_locations():
    user_id = get_jwt_identity()
    favorites = FavoriteLocation.query.filter_by(user_id=user_id).order_by(FavoriteLocation.count.desc()).limit(3).all()

    result = [{"pickup": f.pickup, "destination": f.destination, "count": f.count} for f in favorites]
    return jsonify({"favorite_locations": result}), 200

# handles captain ride history retrieval by filtering rides based on captain ID and returning ride details
@jwt_required()
def get_captain_ride_history_api():
    captain_id = get_jwt_identity()
    captain_ride_history = CaptainRideHistory.query.filter_by(captain_id=captain_id).all()

    history_data = [
        {
            "ride_id": ride.ride_id,
            "status": ride.status,
            "pickup": ride.pickup,
            "destination": ride.destination,
            "timestamp": ride.timestamp
        }
        for ride in captain_ride_history
    ]
    
    return jsonify({"captain_ride_history": history_data}), 200