from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, ValidationError
from controllers.captain_controller import register_captain, login_captain, get_captain_profile, logout_captain

#captain_bp is a blueprint for the captain routes
# It allows us to organize our routes and controllers better
captain_bp = Blueprint('captain', __name__)

# Captain registration schema using Marshmallow for validation.It defines the expected structure of the registration data
class CaptainRegisterSchema(Schema):
    email = fields.Email(required=True, error_messages={"required": "Invalid Email"})
    fullname = fields.Dict(keys=fields.Str(), values=fields.Str(), required=True)
    password = fields.Str(required=True, validate=lambda s: len(s) >= 6, error_messages={"required": "Password must be at least 6 characters long"})
    vehicle = fields.Dict(required=True)

register_schema = CaptainRegisterSchema()

@captain_bp.route('/register', methods=['POST'])
def register():
    try:
        data = register_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    return register_captain()

@captain_bp.route('/login', methods=['POST'])
def login():
    return login_captain()

@captain_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    return get_captain_profile()

@captain_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return logout_captain()
