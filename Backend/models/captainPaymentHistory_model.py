from app import db
from datetime import datetime

class CaptainPaymentHistory(db.Model):
    __tablename__ = "captain_payments_history"
    id = db.Column(db.Integer, primary_key=True)
    captain_id = db.Column(db.Integer, db.ForeignKey('captain.id'), nullable=False)
    ride_id = db.Column(db.Integer, db.ForeignKey('ride.id'), nullable=False, unique=True)
    pickup = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)
    amount_earned = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    captain = db.relationship('Captain', backref='payment_history')
    ride = db.relationship('Ride', backref='payment_history')