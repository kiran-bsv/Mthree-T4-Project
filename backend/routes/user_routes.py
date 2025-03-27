from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, ValidationError
from controllers.user_controller import register_user, login_user, get_user_profile, logout_user
from middlewares.auth_middleware import auth_user

user_bp = Blueprint('user', __name__)

class RegisterUserSchema(Schema):
    email = fields.Email(required=True, error_messages={"required": "Invalid Email"})
    fullname = fields.Dict(keys=fields.Str(), values=fields.Str(), required=True)
    password = fields.Str(required=True, validate=lambda s: len(s) >= 6, error_messages={"required": "Password must be at least 6 characters long"})

class LoginUserSchema(Schema):
    email = fields.Email(required=True, error_messages={"required": "Invalid Email"})
    password = fields.Str(required=True, validate=lambda s: len(s) >= 6, error_messages={"required": "Password must be at least 6 characters long"})

register_schema = RegisterUserSchema()
login_schema = LoginUserSchema()

@user_bp.route('/register', methods=['POST'])
def register():
    return register_user()

@user_bp.route('/login', methods=['POST'])
def login():
    return login_user()

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    return get_user_profile()

@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return logout_user()