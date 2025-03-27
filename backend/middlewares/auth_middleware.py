from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.user_model import User
from models.blacklistToken_model import BlacklistToken

def auth_user(func):
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            token = request.headers.get('Authorization').split(" ")[1]

            if BlacklistToken.query.filter_by(token=token).first():
                return jsonify({'message': 'Unauthorized'}), 401

            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({'message': 'Unauthorized'}), 401

            request.user = user
            return func(*args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Unauthorized'}), 401
    return wrapper
