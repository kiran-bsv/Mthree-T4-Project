from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.ride_model import Ride, db
from marshmallow import Schema, fields, ValidationError
from services.ride_service import create_ride, get_fare, confirm_ride, start_ride, end_ride

class CreateRideSchema(Schema):
    pickup = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid pickup address"})
    destination = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid destination address"})
    vehicleType = fields.Str(required=True, validate=lambda s: s in ["auto", "car", "moto"], error_messages={"required": "Invalid vehicle type"})

class FareQuerySchema(Schema):
    pickup = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid pickup address"})
    destination = fields.Str(required=True, validate=lambda s: len(s) >= 3, error_messages={"required": "Invalid destination address"})

class RideConfirmationSchema(Schema):
    rideId = fields.Int(required=True, error_messages={"required": "Invalid ride id"})
    captainId = fields.Int(required=True, error_messages={"required": "Captain ID is required"})

class StartRideSchema(Schema):
    rideId = fields.Int(required=True, error_messages={"required": "Invalid ride id"})
    otp = fields.Str(required=True, validate=lambda s: len(s) == 6, error_messages={"required": "Invalid OTP"})

class EndRideSchema(Schema):
    rideId = fields.Int(required=True, error_messages={"required": "Invalid ride id"})

create_ride_schema = CreateRideSchema()
fare_query_schema = FareQuerySchema()
ride_id_schema = RideConfirmationSchema()
start_ride_schema = StartRideSchema()
end_ride_schema = EndRideSchema()

@jwt_required()
def create_ride_api():
    try:
        data = create_ride_schema.load(request.json)
        print("data", data)
        ride = create_ride(**data)
        return jsonify({column.name: getattr(ride, column.name) for column in ride.__table__.columns}), 201

    except ValidationError as err:
        return jsonify(err.messages), 400

@jwt_required()
def get_fare_api():
    try:
        data = fare_query_schema.load(request.args)
        fare, duration, distance = get_fare(data['pickup'], data['destination'])
        print(f"line 49 - fare: {fare} \n duration: {duration}")
        return jsonify({'fare': fare, 'duration': duration, 'distance': distance}), 200
    except ValidationError as err:
        return jsonify(err.messages), 400

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


@jwt_required()
def start_ride_api():
    try:
        data = start_ride_schema.load(request.args)
        ride = start_ride(data['rideId'], data['otp'], get_jwt_identity())
        return jsonify({'message': 'Ride started', 'ride_id': ride.get('id')}), 200
    except ValidationError as err:
        return jsonify(err.messages), 400

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