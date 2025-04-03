from flask import request, jsonify
from models.captain_model import Captain, db, CaptainProfile, CaptainActivity
from models.vehicle_model import Vehicle
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

def register_captain():
    data = request.json
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400

    if Captain.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Captain already exists'}), 400

    # Create captain
    new_captain = Captain(
        firstname=data['fullname']['firstname'],
        lastname=data['fullname'].get('lastname', ''),
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        vehicle_color=data['vehicle']['color'],
        vehicle_plate=data['vehicle']['plate'],
        vehicle_capacity=data['vehicle']['capacity'],
        vehicleType=data['vehicle']['vehicleType']
    )
    db.session.add(new_captain)
    db.session.commit()  # Ensure ID is generated before adding related records

    # Create vehicle entry
    new_vehicle = Vehicle(
        captain_id=new_captain.id,
        vehicle_color=data["vehicle"]["color"],
        vehicle_plate=data["vehicle"]["plate"],
        vehicle_capacity=data["vehicle"]["capacity"],
        vehicle_type=data["vehicle"]["vehicleType"]
    )
    db.session.add(new_vehicle)

    # Create related profile and activity
    fullname = f"{data['fullname']['firstname']} {data['fullname'].get('lastname', '')}".strip()
    captain_profile = CaptainProfile(captain_id=new_captain.id, fullname=fullname)
    captain_activity = CaptainActivity(captain_id=new_captain.id)

    db.session.add_all([captain_profile, captain_activity])
    db.session.commit()  # Commit all related records at once

    token = create_access_token(identity=str(new_captain.id))
    return jsonify({'token': token, 'captain': new_captain.id}), 201

def login_captain():
    data = request.json
    captain = Captain.query.filter_by(email=data['email']).first()

    if not captain or not check_password_hash(captain.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = create_access_token(identity=str(captain.id))

    captain_activity = CaptainActivity.query.filter_by(captain_id=captain.id).first()
    if captain_activity:
        captain_activity.last_login = datetime.utcnow()
        db.session.commit()

    # print(captain)
    captain_data = {
        "email": captain.email,
        "fullname": {
            "firstname": captain.firstname,
            "lastname": captain.lastname
        },
        "id": captain.id,
        "vehicle": {
            "capacity": captain.vehicle_capacity,  
            "color": captain.vehicle_color,
            "plate": captain.vehicle_plate,
            "vehicleType": captain.vehicleType
        }
    }

    # print("Login Successful:", captain_data)
    return jsonify({'token': token, 'captain':captain_data}), 200

@jwt_required()
def get_captain_profile():
    captain_id = get_jwt_identity()
    captain = Captain.query.get(captain_id)

    if not captain:
        return jsonify({'error': 'Captain not found'}), 404

    return jsonify( {
        'id': captain.id,
        "fullname": {  
        "firstname": captain.firstname,
        "lastname": captain.lastname
        },
        'email': captain.email,
        'vehicle': {
            'color': captain.vehicle_color,
            'plate': captain.vehicle_plate,
            'capacity': captain.vehicle_capacity,
            'type': captain.vehicleType
        }
    }), 200

@jwt_required()
def logout_captain():
    return jsonify({'message': 'Logged out successfully'}), 200