from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user_model import User, db
from services.user_service import create_user
from werkzeug.security import check_password_hash
from marshmallow import ValidationError

def register_user():
    try:
        data = request.json
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User already exists'}), 400

        new_user = create_user(
            firstname=data['fullname']['firstname'],
            lastname=data['fullname'].get('lastname', ''),
            email=data['email'],
            password=data['password']
        )

        token = create_access_token(identity=str(new_user.id))
        return jsonify({'token': token, 'user_id': new_user.id}), 201
    except ValidationError as err:
        return jsonify(err.messages), 400

def login_user():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token}), 200

@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'id': user_id,
                    'fullname': {'firstname': user.firstname, 
                                 'lastname': user.lastname},
                    'email': user.email}), 200

@jwt_required()
def logout_user():
    return jsonify({'message': 'Logged out successfully'}), 200
