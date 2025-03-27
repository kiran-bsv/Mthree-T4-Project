from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

class Captain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    socketId = db.Column(db.String(100), nullable=True)
    status = db.Column(db.Enum('active', 'inactive'), default='inactive')

    vehicle_color = db.Column(db.String(50), nullable=False)
    vehicle_plate = db.Column(db.String(50), nullable=False)
    vehicle_capacity = db.Column(db.Integer, nullable=False)
    vehicleType = db.Column(db.Enum('car', 'motorcycle', 'auto'), nullable=False)

    location_ltd = db.Column(db.Float, default=17.88)
    location_lng = db.Column(db.Float, default=89.88)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self):
        return create_access_token(identity=str(self.id))
