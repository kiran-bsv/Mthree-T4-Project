from datetime import datetime
from app import db

class RideHistory(db.Model):
    __tablename__ = 'ride_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # e.g., 'completed', 'cancelled'
    pickup = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (if needed)
    user = db.relationship('User', backref='ride_histories')
    # captain = db.relationship('Captain', backref='ride_histories')
    ride = db.relationship('Ride', backref='ride_histories')
