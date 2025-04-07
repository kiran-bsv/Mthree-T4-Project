from datetime import datetime
from app import db

class CaptainRideHistory(db.Model):
    __tablename__ = 'captain_ride_history'

    id = db.Column(db.Integer, primary_key=True)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # e.g., 'completed', 'cancelled'
    pickup = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    captain = db.relationship('Captain', backref='captain_ride_histories')
    ride = db.relationship('Ride', backref='captain_ride_histories')
