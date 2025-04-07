from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime

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
    
# CaptainProfile model to store captain's profile information    
class CaptainProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False, unique=True)
    fullname = db.Column(db.String(100), nullable=False)  # Stores full name
    phone = db.Column(db.String(20), unique=True, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)

    captain = db.relationship('Captain', backref=db.backref('profile', uselist=False))

# CaptainActivity model to store captain's activity information
class CaptainActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False, unique=True)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    ip_address = db.Column(db.String(45), nullable=True)

    captain = db.relationship('Captain', backref=db.backref('activity', uselist=False))

# CaptainRideHistory model to store captain's ride history information
class CaptainEarnings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), unique=True, nullable=False)
    captain_name = db.Column(db.String(255), nullable=False)
    total_earnings = db.Column(db.Float, default=0.0)

    captain = db.relationship("Captain", backref=db.backref("earnings", uselist=False))

# CaptainRatings model to store captain's average ratings information
class CaptainRatings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), unique=True, nullable=False)
    captain_name = db.Column(db.String(255), nullable=False)
    average_rating = db.Column(db.Float, default=0.0)

    captain = db.relationship("Captain", backref=db.backref("ratings", uselist=False))
