from app import db
from datetime import datetime

class Ride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=True)
    pickup = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    fare = db.Column(db.Float, nullable=False)

    status = db.Column(db.Enum('pending', 'accepted', 'ongoing', 'completed', 'cancelled'), default='pending')
    duration = db.Column(db.Integer)  # in seconds
    distance = db.Column(db.Float)  # in meters
    paymentID = db.Column(db.String(255), nullable=True)
    orderId = db.Column(db.String(255), nullable=True)
    signature = db.Column(db.String(255), nullable=True)
    otp = db.Column(db.String(6), nullable=False)
    vehicleType = db.Column(db.String(50), nullable=False)
